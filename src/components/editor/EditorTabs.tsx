"use client";

import { useState } from "react";
import Image from "next/image";
import { Tenant, LandingPage, ServiceItem, BusinessHour } from "@/types/database";
import {
  saveIdentityAction,
  saveHeroAction,
  createServiceAction,
  deleteServiceAction,
  addGalleryImageAction,
  deleteGalleryImageAction,
  saveAboutAndHoursAction,
  setPublishStatusAction,
} from "@/app/(dashboard)/app/actions";
import { formatCurrency } from "@/lib/utils";
import {
  Sparkles,
  Type,
  Scissors,
  Image as ImageIcon,
  Clock,
  Save,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Smartphone,
  Eye,
} from "lucide-react";
import Link from "next/link";

interface EditorTabsProps {
  tenant: Tenant;
  page: LandingPage;
  services: ServiceItem[];
  businessHours: BusinessHour[];
}

export function EditorTabs({
  tenant,
  page,
  services,
  businessHours,
}: EditorTabsProps) {
  const [activeTab, setActiveTab] = useState<
    "identity" | "hero" | "services" | "gallery" | "info"
  >("identity");

  const [feedback, setFeedback] = useState<string | null>(null);

  const isPublished = page.status === "published";

  const showNotification = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(null), 4000);
  };

  const tabs = [
    { id: "identity", label: "1. Identidade & Cores", icon: Sparkles },
    { id: "hero", label: "2. Topo (Hero)", icon: Type },
    { id: "services", label: "3. Procedimentos", icon: Scissors, badge: services.length },
    { id: "gallery", label: "4. Galeria de Fotos", icon: ImageIcon, badge: page.gallery?.length || 0 },
    { id: "info", label: "5. Sobre & Horários", icon: Clock },
  ] as const;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Barra de Publicação e Feedback Superior */}
      <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-4 z-30 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div
            className={`w-3.5 h-3.5 rounded-full ${
              isPublished ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
            }`}
          />
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Status:</span>
              <span className={isPublished ? "text-emerald-400" : "text-amber-400"}>
                {isPublished ? "Publicada e Acessível no Ar" : "Em Modo Rascunho"}
              </span>
            </div>
            <div className="text-xs text-neutral-400">
              {isPublished
                ? "Visitantes já conseguem visualizar sua página."
                : "Edite com tranquilidade; as alterações só vão ao ar quando você publicar."}
            </div>
          </div>
        </div>

        {/* Ações de Publicação */}
        <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-auto">
          <Link
            href="/app/preview"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs font-semibold hover:bg-neutral-800 transition-colors"
          >
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>Visualizar Preview</span>
          </Link>

          {isPublished ? (
            <form
              action={async () => {
                await setPublishStatusAction("draft");
                showNotification("A página foi alterada para Rascunho.");
              }}
            >
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-semibold hover:bg-rose-500/20 transition-colors"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Despublicar (Rascunho)</span>
              </button>
            </form>
          ) : (
            <form
              action={async () => {
                await setPublishStatusAction("published");
                showNotification("Parabéns! Sua página foi publicada com sucesso!");
              }}
            >
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-neutral-950 text-xs font-bold hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publicar Minha Página no Ar</span>
              </button>
            </form>
          )}

          <Link
            href={`/p/${tenant.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver no Ar</span>
          </Link>
        </div>
      </div>

      {/* Toast de Notificação Elegante */}
      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Navegação entre Abas do Editor */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-neutral-800 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                isActive
                  ? "bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/10"
                  : "bg-neutral-950 text-neutral-400 hover:text-white hover:bg-neutral-800/80 border border-neutral-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {"badge" in tab && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? "bg-neutral-950 text-amber-400"
                      : "bg-neutral-800 text-neutral-300"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* CONTEÚDO DA ABA 1: IDENTIDADE & CORES */}
      {activeTab === "identity" && (
        <form
          action={async (formData) => {
            await saveIdentityAction(formData);
            showNotification("Identidade visual e dados atualizados com sucesso!");
          }}
          className="p-5 sm:p-7 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6"
        >
          <div className="border-b border-neutral-800 pb-4">
            <h2 className="text-base font-bold text-white">Identidade do Negócio & Template</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Defina o nome da sua empresa, template especializado, paleta de cores e canais de contato.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Nome Comercial do Negócio
              </label>
              <input
                type="text"
                name="business_name"
                defaultValue={tenant.business_name}
                required
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Template Especializado (Segmento)
              </label>
              <select
                name="segment"
                defaultValue={tenant.segment}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="salon">Salão de Beleza (Design Elegante & Nude)</option>
                <option value="barber">Barbearia (Design Grafite, Âmbar & Madeira)</option>
                <option value="nails">Unhas em Gel / Nail Designer (Design Minimalista & Rosé)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                WhatsApp de Agendamento (DDD + Número)
              </label>
              <input
                type="text"
                name="whatsapp_number"
                defaultValue={page.contact_info.whatsapp_number}
                required
                placeholder="11999999999"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Instagram (@seuperfil)
              </label>
              <input
                type="text"
                name="instagram_handle"
                defaultValue={page.contact_info.instagram_handle}
                placeholder="@studioexemplo"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Cor Principal (Hexadecimal)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  defaultValue={page.theme_config.primary_color || "#A9855E"}
                  name="primary_color"
                  className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-700 cursor-pointer"
                />
                <span className="text-xs font-mono text-neutral-400">
                  {page.theme_config.primary_color}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Cor Secundária (Destaque)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  defaultValue={page.theme_config.accent_color || "#C2A37E"}
                  name="accent_color"
                  className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-700 cursor-pointer"
                />
                <span className="text-xs font-mono text-neutral-400">
                  {page.theme_config.accent_color}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 text-neutral-950 text-xs sm:text-sm font-semibold hover:bg-amber-400 transition-colors flex items-center gap-2 shadow-md shadow-amber-500/10"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Identidade</span>
            </button>
          </div>
        </form>
      )}

      {/* CONTEÚDO DA ABA 2: TOPO (HERO) */}
      {activeTab === "hero" && (
        <form
          action={async (formData) => {
            await saveHeroAction(formData);
            showNotification("Textos e fotos do Topo salvos com sucesso!");
          }}
          className="p-5 sm:p-7 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6"
        >
          <div className="border-b border-neutral-800 pb-4">
            <h2 className="text-base font-bold text-white">Seção de Destaque Superior (Hero)</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Esta é a primeira seção vista pelo visitante ao abrir sua landing page.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Selo de Especialidade (Badge Superior)
              </label>
              <input
                type="text"
                name="badge"
                defaultValue={page.hero_section.badge}
                required
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Título Principal de Alto Impacto (Headline)
              </label>
              <input
                type="text"
                name="headline"
                defaultValue={page.hero_section.headline}
                required
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Subtítulo Explicativo
              </label>
              <textarea
                name="subheadline"
                rows={3}
                defaultValue={page.hero_section.subheadline}
                required
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Texto do Botão de WhatsApp (CTA)
                </label>
                <input
                  type="text"
                  name="cta_text"
                  defaultValue={page.hero_section.cta_text}
                  required
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  URL da Fotografia Principal
                </label>
                <input
                  type="url"
                  name="hero_image_url"
                  defaultValue={page.hero_section.hero_image_url}
                  required
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 text-neutral-950 text-xs sm:text-sm font-semibold hover:bg-amber-400 transition-colors flex items-center gap-2 shadow-md shadow-amber-500/10"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Topo</span>
            </button>
          </div>
        </form>
      )}

      {/* CONTEÚDO DA ABA 3: PROCEDIMENTOS & SERVIÇOS */}
      {activeTab === "services" && (
        <div className="space-y-6">
          {/* Formulário para Adicionar Serviço */}
          <div className="p-5 sm:p-6 rounded-2xl bg-neutral-950 border border-neutral-800">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Adicionar Novo Procedimento / Serviço</span>
            </h2>

            <form
              action={async (formData) => {
                await createServiceAction(formData);
                showNotification("Novo serviço adicionado ao catálogo!");
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Nome do Procedimento
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Ex: Corte Visagista"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Categoria
                </label>
                <input
                  type="text"
                  name="category"
                  required
                  placeholder="Ex: Cabelo, Barba, Alongamento"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Preço em Reais (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  required
                  placeholder="Ex: 180.00"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Duração Estimada (Minutos)
                </label>
                <input
                  type="number"
                  name="duration_minutes"
                  defaultValue="60"
                  required
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Descrição Rápida dos Benefícios
                </label>
                <input
                  type="text"
                  name="description"
                  required
                  placeholder="Ex: Lavagem relaxante, corte à mão livre e finalização térmica."
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-neutral-950 text-xs sm:text-sm font-semibold hover:bg-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Procedimento</span>
                </button>
              </div>
            </form>
          </div>

          {/* Listagem de Serviços Cadastrados */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white">
              Procedimentos Cadastrados ({services.length})
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="p-4 sm:p-5 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-base">
                        {service.name}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-900 text-amber-400 border border-neutral-800">
                        {service.category}
                      </span>
                      <span className="text-xs text-neutral-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{service.duration_minutes} min</span>
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 max-w-xl">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <span className="text-lg font-bold text-amber-400 font-mono">
                      {formatCurrency(service.price)}
                    </span>

                    <form
                      action={async () => {
                        await deleteServiceAction(service.id);
                        showNotification("Serviço removido com sucesso!");
                      }}
                    >
                      <button
                        type="submit"
                        aria-label="Remover serviço"
                        className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 4: GALERIA DE FOTOS */}
      {activeTab === "gallery" && (
        <div className="space-y-6">
          {/* Adicionar Foto */}
          <div className="p-5 sm:p-6 rounded-2xl bg-neutral-950 border border-neutral-800">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Adicionar Foto ao Portfólio</span>
            </h2>

            <form
              action={async (formData) => {
                await addGalleryImageAction(formData);
                showNotification("Foto adicionada à galeria!");
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Legenda / Título da Foto
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Ex: Loiro Perolado ou Barba Desenhada"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  URL da Imagem
                </label>
                <input
                  type="url"
                  name="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-neutral-950 text-xs sm:text-sm font-semibold hover:bg-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar à Galeria</span>
                </button>
              </div>
            </form>
          </div>

          {/* Grid de Fotos Existentes */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white">
              Fotos Atuais ({page.gallery?.length || 0})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(page.gallery || []).map((img) => (
                <div
                  key={img.id}
                  className="relative rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 p-3 flex flex-col justify-between group"
                >
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-neutral-900 mb-3">
                    <Image
                      src={img.url}
                      alt={img.title}
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-200 truncate pr-2">
                      {img.title}
                    </span>

                    <form
                      action={async () => {
                        await deleteGalleryImageAction(img.id);
                        showNotification("Imagem removida da galeria!");
                      }}
                    >
                      <button
                        type="submit"
                        aria-label="Remover imagem"
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 5: SOBRE, HORÁRIOS & ENDEREÇO */}
      {activeTab === "info" && (
        <form
          action={async (formData) => {
            await saveAboutAndHoursAction(formData);
            showNotification("Informações do negócio e localização salvas!");
          }}
          className="p-5 sm:p-7 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6"
        >
          <div className="border-b border-neutral-800 pb-4">
            <h2 className="text-base font-bold text-white">Sobre a Empresa & Localização</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Conte a história do seu espaço e informe aos clientes seu endereço e horários.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Título da Seção Sobre
              </label>
              <input
                type="text"
                name="about_title"
                defaultValue={page.about_section.title}
                required
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Descrição & Filosofia do Espaço
              </label>
              <textarea
                name="about_description"
                rows={4}
                defaultValue={page.about_section.description}
                required
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Anos de Experiência
                </label>
                <input
                  type="number"
                  name="years_experience"
                  defaultValue={page.about_section.years_experience}
                  required
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Rua e Número
                </label>
                <input
                  type="text"
                  name="address_street"
                  defaultValue={page.contact_info.address_street}
                  required
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Bairro
                </label>
                <input
                  type="text"
                  name="address_neighborhood"
                  defaultValue={page.contact_info.address_neighborhood}
                  required
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Cidade / UF
                </label>
                <input
                  type="text"
                  name="address_city"
                  defaultValue={page.contact_info.address_city}
                  required
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 text-neutral-950 text-xs sm:text-sm font-semibold hover:bg-amber-400 transition-colors flex items-center gap-2 shadow-md shadow-amber-500/10"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Informações</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
