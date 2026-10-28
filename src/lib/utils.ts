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
