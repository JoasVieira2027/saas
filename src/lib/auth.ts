import { cookies } from "next/headers";
import { Profile } from "@/types/database";
import { dataService } from "./supabase/data-service";

const SESSION_COOKIE_NAME = "saas_auth_session";

export interface SessionData {
  userId: string;
  email: string;
  role: "superadmin" | "tenant_admin";
  fullName: string;
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const parsed = JSON.parse(sessionCookie.value) as SessionData;
    return parsed;
  } catch {
    return null;
  }
}

export async function setSession(profile: Profile): Promise<void> {
  const cookieStore = await cookies();
  const sessionData: SessionData = {
    userId: profile.id,
    email: profile.email,
    role: profile.role,
    fullName: profile.full_name,
  };

  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
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
