import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatBRLPrice(priceInCents: number): string {
  return formatCurrency(priceInCents / 100);
}

export function parseBRLPrice(input: string): number {
  const cleaned = input.replace(/[^\d,\.]/g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.round(num * 100);
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return phone;
}

export function formatWhatsAppUrl(phone: string, text?: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const number = cleaned.startsWith("55") ? cleaned : `55${cleaned}`;
  const encodedText = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${number}${encodedText}`;
}

export const SEGMENT_LABELS: Record<string, string> = {
  salon: "Salão de Beleza",
  barber: "Barbearia",
  nails: "Unhas em Gel",
};

export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active: { label: "Ativo", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  suspended: { label: "Suspenso", color: "bg-rose-50 text-rose-700 border-rose-200" },
  trial: { label: "Período de Testes", color: "bg-amber-50 text-amber-700 border-amber-200" },
};

export const SUBSCRIPTION_STATUS_LABELS: Record<string, { label: string; bg: string; text: string; border: string }> = {
  active: { label: "Em Dia", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  pending: { label: "Pendente", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  overdue: { label: "Inadimplente", bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" },
  suspended: { label: "Suspensa", bg: "bg-red-900/20", text: "text-red-400", border: "border-red-800/40" },
  cancelled: { label: "Cancelada", bg: "bg-neutral-800", text: "text-neutral-400", border: "border-neutral-700" },
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  pix: "PIX",
  boleto: "Boleto Bancário",
  credit_card: "Cartão de Crédito",
  cash: "Dinheiro em Espécie",
  bank_transfer: "Transferência Bancária",
};

export function getDueDateStatus(dueDateStr?: string): {
  status: "overdue" | "due_soon" | "ok";
  daysDiff: number;
  label: string;
} {
  if (!dueDateStr) {
    return { status: "ok", daysDiff: 0, label: "Não definido" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = dueDateStr.split("-").map(Number);
  const due =
    parts.length === 3 ? new Date(parts[0], parts[1] - 1, parts[2]) : new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: "overdue",
      daysDiff: Math.abs(diffDays),
      label: `Atrasado há ${Math.abs(diffDays)} dia(s)`,
    };
  } else if (diffDays <= 5) {
    return {
      status: "due_soon",
      daysDiff: diffDays,
      label: diffDays === 0 ? "Vence hoje" : `Vence em ${diffDays} dia(s)`,
    };
  } else {
    return {
      status: "ok",
      daysDiff: diffDays,
      label: `Vence em ${diffDays} dias`,
    };
  }
}

