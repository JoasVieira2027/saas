"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicLandingPageData } from "@/types/landing-page";
import { SalonTemplate } from "@/components/templates/salon";
import { BarberTemplate } from "@/components/templates/barber";
import { NailsTemplate } from "@/components/templates/nails";
import { setPublishStatusAction } from "@/app/(dashboard)/app/actions";
import {
  Smartphone,
  Tablet,
  Monitor,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Scissors,
  Crown,
} from "lucide-react";

interface PreviewDeviceSwitcherProps {
  data: PublicLandingPageData;
}

export function PreviewDeviceSwitcher({ data }: PreviewDeviceSwitcherProps) {
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">("mobile");
  const [isPublished, setIsPublished] = useState(data.page.status === "published");
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handlePublish = async (status: "draft" | "published") => {
    await setPublishStatusAction(status);
    setIsPublished(status === "published");
    showNotification(
      status === "published"
        ? "Página publicada com sucesso!"
        : "A página foi retornada para modo Rascunho."
    );
  };

  const templateId = data.page.template_id || data.tenant.segment;

  return (
    <div className="space-y-5">
      {/* Barra Superior de Controles e Dispositivos */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        {/* Voltar e Identificação do Template */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <Link
            href="/app/editor"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-900 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Editor</span>
          </Link>

          <div className="flex items-center gap-1.5 text-xs text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-800">
            {templateId === "salon" && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
            {templateId === "barber" && <Scissors className="w-3.5 h-3.5 text-neutral-300" />}
            {templateId === "nails" && <Crown className="w-3.5 h-3.5 text-rose-300" />}
            <span className="capitalize font-medium text-white">
              Template: {templateId === "salon" ? "Salão" : templateId === "barber" ? "Barbearia" : "Unhas"}
            </span>
          </div>
        </div>

        {/* Alternador de Dispositivos */}
        <div className="flex items-center bg-neutral-900 p-1 rounded-xl border border-neutral-800">
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              device === "mobile"
                ? "bg-amber-500 text-neutral-950 shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Celular (375px)</span>
          </button>

          <button
            type="button"
            onClick={() => setDevice("tablet")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              device === "tablet"
                ? "bg-amber-500 text-neutral-950 shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet (768px)</span>
          </button>

          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              device === "desktop"
                ? "bg-amber-500 text-neutral-950 shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
        </div>

        {/* Ações de Publicação no Preview */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {isPublished ? (
            <button
              type="button"
              onClick={() => handlePublish("draft")}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-semibold hover:bg-rose-500/20 transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Despublicar</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handlePublish("published")}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-neutral-950 text-xs font-bold hover:bg-emerald-400 transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Publicar Agora</span>
            </button>
          )}

          <Link
            href={`/p/${data.tenant.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-900 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Abrir Nova Aba</span>
          </Link>
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Frame de Visualização do Dispositivo */}
      <div className="w-full flex justify-center py-4 overflow-x-auto">
        <div
          className={`transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl border-4 ${
            device === "mobile"
              ? "w-[375px] border-neutral-800 min-h-[700px] bg-neutral-950"
              : device === "tablet"
              ? "w-[768px] border-neutral-800 min-h-[850px] bg-neutral-950"
              : "w-full border-neutral-800/60 bg-neutral-950"
          }`}
        >
          {/* Top Notch / Header simulado para Mobile e Tablet */}
          {device !== "desktop" && (
            <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-2 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
              <span>{device === "mobile" ? "iPhone / Android (375px)" : "iPad / Tablet (768px)"}</span>
              <span className="w-12 h-1.5 rounded-full bg-neutral-700 mx-auto" />
              <span>{data.tenant.slug}.glowsaas.com</span>
            </div>
          )}

          {/* Renderização Real do Template */}
          <div className="w-full overflow-y-auto max-h-[800px] scrollbar-thin">
            {templateId === "salon" && <SalonTemplate data={data} />}
            {templateId === "barber" && <BarberTemplate data={data} />}
            {templateId === "nails" && <NailsTemplate data={data} />}
          </div>
        </div>
      </div>
    </div>
  );
}

