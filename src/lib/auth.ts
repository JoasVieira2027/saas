import { cookies } from "next/headers";
import { Profile } from "@/types/database";

export const SESSION_COOKIE_NAME = "saas_auth_session";

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "CONFIGURAÇÃO CRÍTICA AUSENTE: A variável de ambiente SESSION_SECRET é obrigatória em ambiente de produção."
      );
    }
    return "saas-secure-session-key-dev-default-32-chars-long";
  }
  if (process.env.NODE_ENV === "production" && secret.length < 32) {
    throw new Error(
      "CONFIGURAÇÃO INSEGURA: A variável SESSION_SECRET deve conter no mínimo 32 caracteres em ambiente de produção."
    );
  }
  return secret;
}

export interface SessionData {
  userId: string;
  email: string;
  role: "superadmin" | "tenant_admin";
  fullName: string;
  impersonatedBy?: {
    adminId: string;
    adminEmail: string;
  };
}

// Utilitários criptográficos com Web Crypto API (100% compatível com Edge e Node.js)
const encoder = new TextEncoder();

async function getCryptoKey(): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toBase64Url(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf8").toString("base64url");
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(b64: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(b64, "base64url").toString("utf8");
  }
  const padded = b64.replace(/-/g, "+").replace(/_/g, "/") + "==".slice(0, (4 - (b64.length % 4)) % 4);
  return atob(padded);
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Assina dados de sessão gerando um token HMAC-SHA256: <base64url(payload)>.<hex_signature>
 */
export async function signSessionData(sessionData: SessionData): Promise<string> {
  const payloadStr = JSON.stringify(sessionData);
  const encodedPayload = toBase64Url(payloadStr);
  const key = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(encodedPayload));
  const hexSignature = bytesToHex(new Uint8Array(signatureBuffer));
  return `${encodedPayload}.${hexSignature}`;
}

/**
 * Verifica a assinatura HMAC-SHA256 de um token. Retorna null se adulterado ou inválido.
 */
export async function verifySessionToken(token: string): Promise<SessionData | null> {
  if (!token || !token.includes(".")) {
    return null;
  }

  const [encodedPayload, hexSignature] = token.split(".");
  if (!encodedPayload || !hexSignature) {
    return null;
  }

  try {
    const key = await getCryptoKey();
    const sigBytes = hexToBytes(hexSignature);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes as unknown as BufferSource,
      encoder.encode(encodedPayload)
    );

    if (!isValid) {
      return null;
    }

    const payloadJson = fromBase64Url(encodedPayload);
    const parsed = JSON.parse(payloadJson) as SessionData;

    // Validação estrita da estrutura
    if (!parsed.userId || !parsed.email || !parsed.role) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  return await verifySessionToken(sessionCookie.value);
}

export async function setSession(
  profile: Profile,
  impersonatedBy?: { adminId: string; adminEmail: string }
): Promise<void> {
  const cookieStore = await cookies();
  const sessionData: SessionData = {
    userId: profile.id,
    email: profile.email,
    role: profile.role,
    fullName: profile.full_name,
    ...(impersonatedBy ? { impersonatedBy } : {}),
  };

  const signedToken = await signSessionData(sessionData);

  cookieStore.set(SESSION_COOKIE_NAME, signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireSuperadmin(): Promise<SessionData> {
  const session = await getSession();
  if (!session || session.role !== "superadmin") {
    throw new Error("Acesso não autorizado: Requer perfil de Administrador Geral.");
  }
  return session;
}

export async function requireTenant(): Promise<SessionData> {
  const session = await getSession();
  if (!session) {
    throw new Error("Acesso não autorizado: Faça login para continuar.");
  }
  return session;
}


