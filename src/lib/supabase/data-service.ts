import { createClient } from "./server";
import { Tenant, LandingPage, ServiceItem, BusinessHour, Profile } from "@/types/database";

// Base de dados em memória para demonstração e testes locais offline
const DEMO_PROFILES: Record<string, Profile> = {
  "admin-1": {
    id: "admin-1",
    email: "admin@saas.com",
    full_name: "Administrador Geral",
    role: "superadmin",
    created_at: new Date().toISOString(),
  },
  "salon-owner-1": {
    id: "salon-owner-1",
    email: "aline@lumiere.com",
    full_name: "Aline Vasconcelos",
    role: "tenant_admin",
    created_at: new Date().toISOString(),
  },
  "barber-owner-1": {
    id: "barber-owner-1",
    email: "marcos@navalha.com",
    full_name: "Marcos Tavares",
    role: "tenant_admin",
    created_at: new Date().toISOString(),
  },
  "nails-owner-1": {
    id: "nails-owner-1",
    email: "gisele@nails.com",
    full_name: "Gisele Rocha",
    role: "tenant_admin",
    created_at: new Date().toISOString(),
  },
};

let DEMO_TENANTS: Tenant[] = [
  {
    id: "tenant-salon-1",
    owner_id: "salon-owner-1",
    business_name: "Lumière Concept Hair & Spa",
    slug: "lumiere-hair",
    segment: "salon",
    plan_type: "pro",
    status: "active",
    created_at: "2026-01-10T10:00:00Z",
    updated_at: "2026-02-15T14:30:00Z",
  },
  {
    id: "tenant-barber-1",
    owner_id: "barber-owner-1",
    business_name: "Navalha de Ouro Barber Club",
    slug: "navalha-de-ouro",
    segment: "barber",
    plan_type: "starter",
    status: "active",
    created_at: "2026-01-15T11:00:00Z",
    updated_at: "2026-02-18T16:00:00Z",
  },
  {
    id: "tenant-nails-1",
    owner_id: "nails-owner-1",
    business_name: "Studio Gisele Nail Art & Gel",
    slug: "gisele-nails",
    segment: "nails",
    plan_type: "starter",
    status: "active",
    created_at: "2026-02-01T09:00:00Z",
    updated_at: "2026-02-20T11:20:00Z",
  },
];

let DEMO_PAGES: Record<string, LandingPage> = {
  "tenant-salon-1": {
    id: "page-salon-1",
    tenant_id: "tenant-salon-1",
    template_id: "salon",
    status: "published",
    theme_config: {
      primary_color: "#A9855E",
      accent_color: "#C2A37E",
      font_preset: "luxury",
      dark_mode: false,
    },
    hero_section: {
      badge: "Salão de Beleza & Estética",
      headline: "Elegância e cuidado em cada detalhe do seu cabelo",
      subheadline: "Especialistas em mechas personalizadas, tratamentos capilares profundos e visagismo.",
      cta_text: "Agendar Atendimento VIP",
      hero_image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
    },
    about_section: {
      title: "Nossa Filosofia de Beleza",
      description: "Acreditamos que cada cliente possui uma beleza singular. Nosso espaço foi pensado para oferecer momentos de relaxamento e tratamentos com os melhores cosméticos internacionais.",
      years_experience: 12,
      highlight_image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    },
    contact_info: {
      whatsapp_number: "11988887777",
      whatsapp_default_message: "Olá! Gostaria de informações sobre horários disponíveis para mechas e corte.",
      address_street: "Rua Oscar Freire, 1420",
      address_neighborhood: "Jardins",
      address_city: "São Paulo",
      address_state: "SP",
      google_maps_url: "https://maps.google.com/?q=Rua+Oscar+Freire+1420+Sao+Paulo",
      instagram_handle: "@lumierehair",
    },
    differentials: [
      {
        id: "diff-1",
        title: "Diagnóstico Capilar Prévio",
        description: "Avaliação minuciosa da elasticidade, porosidade e histórico do fio para assegurar total integridade antes de qualquer transformação.",
      },
      {
        id: "diff-2",
        title: "Cosméticos de Padrão Internacional",
        description: "Protocolos executados exclusivamente com fórmulas de alta performance para nutrição profunda e proteção térmica prolongada.",
      },
      {
        id: "diff-3",
        title: "Atendimento Rigoroso com Hora Marcada",
        description: "Respeito absoluto ao seu tempo. Agenda organizada com intervalo exclusivo entre clientes para garantir dedicação integral.",
      },
      {
        id: "diff-4",
        title: "Ambiente Acolhedor & Privativo",
        description: "Estrutura moderna e iluminada, climatização agradável, café especial e estações confortáveis para uma experiência relaxante.",
      },
    ],
    gallery: [
      {
        id: "gal-1",
        url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
        title: "Loiro Perolado & Esfumado",
        alt: "Resultado de mechas loiro perolado com raiz esfumada",
      },
      {
        id: "gal-2",
        url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
        title: "Espaço de Cuidado & Lavatórios",
        alt: "Ambiente interno elegante do salão de beleza",
      },
      {
        id: "gal-3",
        url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80",
        title: "Morena Iluminada Caramelo",
        alt: "Cabelo com mechas morena iluminada em tons de caramelo",
      },
      {
        id: "gal-4",
        url: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80",
        title: "Corte em Camadas com Balanço",
        alt: "Corte feminino contemporâneo em camadas",
      },
      {
        id: "gal-5",
        url: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80",
        title: "Finalização & Escova Modelada",
        alt: "Finalização com ondas suaves e brilho espelhado",
      },
      {
        id: "gal-6",
        url: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
        title: "Terapia Capilar & Reconstrução",
        alt: "Tratamento de reconstrução e nutrição profunda",
      },
    ],
    team: [
      {
        id: "team-1",
        name: "Aline Vasconcelos",
        role: "Fundadora & Master Colorista",
        specialty: "Loiros Personalizados e Visagismo",
        image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "team-2",
        name: "Camila Silveira",
        role: "Especialista em Cortes & Styling",
        specialty: "Cortes Geométricos e Finalizações Naturais",
        image_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "team-3",
        name: "Rodrigo Mello",
        role: "Terapeuta Capilar & Cuidados",
        specialty: "Saúde do Couro Cabeludo e Cronograma Intensivo",
        image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      },
    ],
    seo_title: "Lumière Concept Hair | Salão de Beleza nos Jardins",
    seo_description: "Salão de beleza premium com especialistas em loiros, mechas, corte e estética capilar.",
    published_at: "2026-02-15T14:30:00Z",
    created_at: "2026-01-10T10:00:00Z",
    updated_at: "2026-02-15T14:30:00Z",
  },
  "tenant-barber-1": {
    id: "page-barber-1",
    tenant_id: "tenant-barber-1",
    template_id: "barber",
    status: "published",
    theme_config: {
      primary_color: "#C5A059",
      accent_color: "#1C1C1C",
      font_preset: "classic",
      dark_mode: true,
    },
    hero_section: {
      badge: "Barbearia Tradicional & Moderna",
      headline: "Estilo com tradição e precisão na navalha",
      subheadline: "Cortes modernos, barba alinhada e ambiente exclusivo com café e cerveja artesanal.",
      cta_text: "Garantir Meu Horário",
      hero_image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80",
    },
    about_section: {
      title: "A Arte da Barba e Cabelo",
      description: "Resgatamos o ritual clássico das barbearias tradicionais com o que há de mais atual em visagismo masculino e cuidados para barba e cabelo.",
      years_experience: 9,
      highlight_image_url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
    },
    contact_info: {
      whatsapp_number: "11977776666",
      whatsapp_default_message: "E aí! Gostaria de marcar corte e barba para hoje/amanhã.",
      address_street: "Avenida Paulista, 850",
      address_neighborhood: "Bela Vista",
      address_city: "São Paulo",
      address_state: "SP",
      google_maps_url: "https://maps.google.com/?q=Avenida+Paulista+850+Sao+Paulo",
      instagram_handle: "@barbernavalha",
    },
    differentials: [
      {
        id: "diff-b1",
        title: "Barboterapia com Toalha Quente",
        description: "Ritual completo com vapor de ozônio, óleos essenciais pré-barba, navalhete descartável e toalha quente para abertura dos poros sem irritação.",
      },
      {
        id: "diff-b2",
        title: "Navalha & Acabamento Milimétrico",
        description: "Técnica apurada de alinhamento de contorno, degradê perfeito (fade) e finalização com lâmina de precisão cirúrgica.",
      },
      {
        id: "diff-b3",
        title: "Sem Espera & Hora Marcada",
        description: "Seu tempo é prioridade. Atendimento rigorosamente no horário agendado, com intervalo garantido para uma experiência sem pressa.",
      },
      {
        id: "diff-b4",
        title: "Lounge com Bebida Cortesia",
        description: "Ambiente reservado com climatização agradável, café expresso moído na hora e cerveja artesanal gelada durante seu atendimento.",
      },
    ],
    gallery: [
      {
        id: "gal-b1",
        url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
        title: "Degradê Fade Alinhado",
        alt: "Corte masculino com transição suave em degradê",
      },
      {
        id: "gal-b2",
        url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
        title: "Barboterapia Tradicional",
        alt: "Barba na toalha quente com massagem facial",
      },
      {
        id: "gal-b3",
        url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
        title: "Navalhado Clássico",
        alt: "Acabamento de costeleta e pezinho com navalha",
      },
      {
        id: "gal-b4",
        url: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=800&q=80",
        title: "Ambiente Vintage & Cadeiras de Couro",
        alt: "Espaço interno clássico da barbearia",
      },
      {
        id: "gal-b5",
        url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80",
        title: "Barba Desenhada & Alinhamento",
        alt: "Design de barba longa com contornos limpos",
      },
      {
        id: "gal-b6",
        url: "https://images.unsplash.com/photo-1534778356534-d3d45b6df1da?auto=format&fit=crop&w=800&q=80",
        title: "Corte Clássico na Tesoura",
        alt: "Finalização clássica com penteado e pomada matte",
      },
    ],
    team: [
      {
        id: "team-b1",
        name: "Marcos Tavares",
        role: "Fundador & Master Barber",
        specialty: "Fade de Alta Precisão e Barba na Toalha",
        image_url: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "team-b2",
        name: "Diego Ramos",
        role: "Especialista em Navalha & Visagismo",
        specialty: "Alinhamento Clássico e Camuflagem de Fios",
        image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "team-b3",
        name: "Lucas Albuquerque",
        role: "Barber & Hair Stylist",
        specialty: "Cortes Contemporâneos e Texturização",
        image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      },
    ],
    seo_title: "Navalha de Ouro Barber Club | Barbearia na Paulista",
    seo_description: "Corte masculino, barba na toalha quente e atendimento sem fila. Agende pelo WhatsApp.",
    published_at: "2026-02-18T16:00:00Z",
    created_at: "2026-01-15T11:00:00Z",
    updated_at: "2026-02-18T16:00:00Z",
  },
  "tenant-nails-1": {
    id: "page-nails-1",
    tenant_id: "tenant-nails-1",
    template_id: "nails",
    status: "published",
    theme_config: {
      primary_color: "#E0A395",
      accent_color: "#F5DDD7",
      font_preset: "modern",
      dark_mode: false,
    },
    hero_section: {
      badge: "Unhas em Gel & Fibra de Vidro",
      headline: "Unhas perfeitas, resistentes e com acabamento natural",
      subheadline: "Alongamento em gel, blindagem e nail art de alta precisão com durabilidade incomparável.",
      cta_text: "Agendar Minha Sessão",
      hero_image_url: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80",
    },
    about_section: {
      title: "Saúde das Unhas & Alta Durabilidade",
      description: "Trabalhamos com materiais antialérgicos de alta qualidade e técnicas que preservam a integridade e saúde da unha natural com máxima elegância.",
      years_experience: 6,
      highlight_image_url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80",
    },
    contact_info: {
      whatsapp_number: "11966665555",
      whatsapp_default_message: "Oi Gisele! Quero agendar aplicação de unhas em gel.",
      address_street: "Rua Domingos de Morais, 500 - Sala 42",
      address_neighborhood: "Vila Mariana",
      address_city: "São Paulo",
      address_state: "SP",
      google_maps_url: "https://maps.google.com/?q=Rua+Domingos+de+Morais+500+Sao+Paulo",
      instagram_handle: "@giselenailart",
    },
    differentials: [
      {
        id: "diff-n1",
        title: "Biossegurança & Autoclave Cirúrgica",
        description: "Instrumentos metálicos 100% esterilizados em autoclave e kits individuais com lixas descartáveis para total segurança.",
      },
      {
        id: "diff-n2",
        title: "Preservação da Unha Natural",
        description: "Técnica apurada de preparação sem desbaste agressivo da lâmina, garantindo unhas saudáveis e fortes sob o gel.",
      },
      {
        id: "diff-n3",
        title: "Curvatura C Fina & Natural",
        description: "Alongamento com espessura realista e simetria anatômica perfeita, sem aspecto pesado ou artificial.",
      },
      {
        id: "diff-n4",
        title: "Brilho Espelhado de até 30 Dias",
        description: "Géis construtores e top coats hipoalergênicos importados que não amarelam, não descascam e mantêm acabamento de vidro.",
      },
    ],
    gallery: [
      {
        id: "gal-n1",
        url: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80",
        title: "Alongamento Nude Rosé",
        alt: "Unhas em gel com acabamento natural nude rosé",
      },
      {
        id: "gal-n2",
        url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80",
        title: "Formato Almond Elegante",
        alt: "Design amendoado com esmaltação clean",
      },
      {
        id: "gal-n3",
        url: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80",
        title: "Babyboomer Suave",
        alt: "Degradê suave em estilo babyboomer francês",
      },
      {
        id: "gal-n4",
        url: "https://images.unsplash.com/photo-1522337094846-8a818192de1f?auto=format&fit=crop&w=800&q=80",
        title: "Blindagem & Brilho Duradouro",
        alt: "Unhas naturais blindadas com top coat espelhado",
      },
      {
        id: "gal-n5",
        url: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
        title: "Nail Art Minimalista",
        alt: "Linhas finas e detalhes discretos em nail art",
      },
      {
        id: "gal-n6",
        url: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&w=800&q=80",
        title: "Manutenção & Cuticulagem Russa",
        alt: "Acabamento perfeito de cutícula e nivelamento",
      },
    ],
    team: [
      {
        id: "team-n1",
        name: "Gisele Rocha",
        role: "Fundadora & Master Nail Designer",
        specialty: "Gel Moldado, Fibra Slim e Cuticulagem Russa",
        image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "team-n2",
        name: "Beatriz Lima",
        role: "Especialista em Blindagem & Esmaltação",
        specialty: "Unhas Frágeis, Formatos Amendoados e Nail Art Clean",
        image_url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
      },
    ],
    seo_title: "Studio Gisele Nail Art | Unhas em Gel e Fibra",
    seo_description: "Especialista em unhas de gel, esmaltação em gel e banho de gel em São Paulo.",
    published_at: "2026-02-20T11:20:00Z",
    created_at: "2026-02-01T09:00:00Z",
    updated_at: "2026-02-20T11:20:00Z",
  },
};

let DEMO_SERVICES: Record<string, ServiceItem[]> = {
  "tenant-salon-1": [
    {
      id: "srv-1",
      tenant_id: "tenant-salon-1",
      category: "Cabelo",
      name: "Mechas Criativas & Iluminação",
      description: "Técnica personalizada com teste de mecha prévio e tonalização premium.",
      price: 480.0,
      duration_minutes: 180,
      image_url: null,
      sort_order: 1,
      is_active: true,
      created_at: "2026-01-10T10:00:00Z",
    },
    {
      id: "srv-2",
      tenant_id: "tenant-salon-1",
      category: "Cabelo",
      name: "Corte Visagista & Escova Modelada",
      description: "Estudo do formato do rosto e finalização com proteção térmica.",
      price: 180.0,
      duration_minutes: 60,
      image_url: null,
      sort_order: 2,
      is_active: true,
      created_at: "2026-01-10T10:00:00Z",
    },
    {
      id: "srv-3",
      tenant_id: "tenant-salon-1",
      category: "Tratamento",
      name: "Cronograma de Hidratação Profunda",
      description: "Recuperação lipídica e selagem de cutículas para brilho intenso.",
      price: 220.0,
      duration_minutes: 75,
      image_url: null,
      sort_order: 3,
      is_active: true,
      created_at: "2026-01-10T10:00:00Z",
    },
    {
      id: "srv-3b",
      tenant_id: "tenant-salon-1",
      category: "Coloração",
      name: "Coloração Global & Banho de Brilho",
      description: "Uniformização da cor com pigmentos nobres sem amônia e proteção da fibra.",
      price: 290.0,
      duration_minutes: 90,
      image_url: null,
      sort_order: 4,
      is_active: true,
      created_at: "2026-01-10T10:00:00Z",
    },
    {
      id: "srv-3c",
      tenant_id: "tenant-salon-1",
      category: "Finalização",
      name: "Escova Modelada & Styling Babyliss",
      description: "Lavagem terapêutica, massagem capilar e modelagem com ondas duradouras.",
      price: 130.0,
      duration_minutes: 50,
      image_url: null,
      sort_order: 5,
      is_active: true,
      created_at: "2026-01-10T10:00:00Z",
    },
    {
      id: "srv-3d",
      tenant_id: "tenant-salon-1",
      category: "Tratamento",
      name: "Detox & Terapia do Couro Cabeludo",
      description: "Esfoliação suave, desobstrução folicular e nutrição para controle de oleosidade e fortalecimento.",
      price: 240.0,
      duration_minutes: 60,
      image_url: null,
      sort_order: 6,
      is_active: true,
      created_at: "2026-01-10T10:00:00Z",
    },
  ],
  "tenant-barber-1": [
    {
      id: "srv-4",
      tenant_id: "tenant-barber-1",
      category: "Cabelo",
      name: "Corte Degradê / Fade Clássico",
      description: "Acabamento na navalha, lavagem refrescante e pomada modeladora.",
      price: 65.0,
      duration_minutes: 40,
      image_url: null,
      sort_order: 1,
      is_active: true,
      created_at: "2026-01-15T11:00:00Z",
    },
    {
      id: "srv-5",
      tenant_id: "tenant-barber-1",
      category: "Barba",
      name: "Barboterapia com Toalha Quente",
      description: "Massagem facial, esfoliação, navalhado clássico e balm pós-barba.",
      price: 55.0,
      duration_minutes: 35,
      image_url: null,
      sort_order: 2,
      is_active: true,
      created_at: "2026-01-15T11:00:00Z",
    },
    {
      id: "srv-6",
      tenant_id: "tenant-barber-1",
      category: "Combo",
      name: "Combo Imperial (Cabelo + Barba)",
      description: "Experiência completa com corte degradê, barboterapia na toalha quente e bebida de cortesia.",
      price: 110.0,
      duration_minutes: 70,
      image_url: null,
      sort_order: 3,
      is_active: true,
      created_at: "2026-01-15T11:00:00Z",
    },
    {
      id: "srv-6b",
      tenant_id: "tenant-barber-1",
      category: "Cabelo",
      name: "Corte na Tesoura & Texturização",
      description: "Modelagem clássica à mão livre, lavagem com shampoo refrescante e pomada matte.",
      price: 75.0,
      duration_minutes: 45,
      image_url: null,
      sort_order: 4,
      is_active: true,
      created_at: "2026-01-15T11:00:00Z",
    },
    {
      id: "srv-6c",
      tenant_id: "tenant-barber-1",
      category: "Barba",
      name: "Camuflagem de Fios Brancos (Barba ou Cabelo)",
      description: "Pigmentação sutil e natural que disfarça falhas e fios brancos sem aspecto artificial.",
      price: 60.0,
      duration_minutes: 30,
      image_url: null,
      sort_order: 5,
      is_active: true,
      created_at: "2026-01-15T11:00:00Z",
    },
    {
      id: "srv-6d",
      tenant_id: "tenant-barber-1",
      category: "Combo",
      name: "Combo Black Beard (Barba Completa + Camuflagem)",
      description: "Alinhamento, toalha quente e tonalização discreta para barba uniforme e densa.",
      price: 95.0,
      duration_minutes: 50,
      image_url: null,
      sort_order: 6,
      is_active: true,
      created_at: "2026-01-15T11:00:00Z",
    },
  ],
  "tenant-nails-1": [
    {
      id: "srv-7",
      tenant_id: "tenant-nails-1",
      category: "Alongamento",
      name: "Alongamento em Gel Moldado",
      description: "Estrutura resistente com curvatura C natural e cuticulagem russa.",
      price: 190.0,
      duration_minutes: 120,
      image_url: null,
      sort_order: 1,
      is_active: true,
      created_at: "2026-02-01T09:00:00Z",
    },
    {
      id: "srv-8",
      tenant_id: "tenant-nails-1",
      category: "Manutenção",
      name: "Manutenção de Gel (até 25 dias)",
      description: "Nivelamento, troca de cor e reforço da estrutura.",
      price: 130.0,
      duration_minutes: 90,
      image_url: null,
      sort_order: 2,
      is_active: true,
      created_at: "2026-02-01T09:00:00Z",
    },
    {
      id: "srv-9",
      tenant_id: "tenant-nails-1",
      category: "Blindagem",
      name: "Blindagem de Diamante & Esmaltação em Gel",
      description: "Proteção da unha natural com brilho de até 20 dias.",
      price: 110.0,
      duration_minutes: 60,
      image_url: null,
      sort_order: 3,
      is_active: true,
      created_at: "2026-02-01T09:00:00Z",
    },
    {
      id: "srv-10",
      tenant_id: "tenant-nails-1",
      category: "Alongamento",
      name: "Alongamento em Fibra de Vidro Slim",
      description: "Aplicação fio a fio ultra fina com acabamento imperceptível e alta durabilidade.",
      price: 210.0,
      duration_minutes: 130,
      image_url: null,
      sort_order: 4,
      is_active: true,
      created_at: "2026-02-01T09:00:00Z",
    },
    {
      id: "srv-11",
      tenant_id: "tenant-nails-1",
      category: "Tratamento",
      name: "Spa das Mãos & Cuticulagem Russa",
      description: "Esfoliação nutritiva, remoção combinada de cutícula com micromotor e hidratação profunda.",
      price: 65.0,
      duration_minutes: 40,
      image_url: null,
      sort_order: 5,
      is_active: true,
      created_at: "2026-02-01T09:00:00Z",
    },
  ],
};

let DEMO_HOURS: Record<string, BusinessHour[]> = {
  "tenant-salon-1": [
    { id: "h1", tenant_id: "tenant-salon-1", day_of_week: 1, open_time: "Fechado", close_time: "", is_closed: true },
    { id: "h2", tenant_id: "tenant-salon-1", day_of_week: 2, open_time: "09:00", close_time: "19:00", is_closed: false },
    { id: "h3", tenant_id: "tenant-salon-1", day_of_week: 3, open_time: "09:00", close_time: "19:00", is_closed: false },
    { id: "h4", tenant_id: "tenant-salon-1", day_of_week: 4, open_time: "09:00", close_time: "20:00", is_closed: false },
    { id: "h5", tenant_id: "tenant-salon-1", day_of_week: 5, open_time: "09:00", close_time: "20:00", is_closed: false },
    { id: "h6", tenant_id: "tenant-salon-1", day_of_week: 6, open_time: "08:30", close_time: "19:00", is_closed: false },
    { id: "h7", tenant_id: "tenant-salon-1", day_of_week: 0, open_time: "Fechado", close_time: "", is_closed: true },
  ],
  "tenant-barber-1": [
    { id: "h8", tenant_id: "tenant-barber-1", day_of_week: 1, open_time: "10:00", close_time: "20:00", is_closed: false },
    { id: "h9", tenant_id: "tenant-barber-1", day_of_week: 2, open_time: "09:00", close_time: "21:00", is_closed: false },
    { id: "h10", tenant_id: "tenant-barber-1", day_of_week: 3, open_time: "09:00", close_time: "21:00", is_closed: false },
    { id: "h11", tenant_id: "tenant-barber-1", day_of_week: 4, open_time: "09:00", close_time: "21:00", is_closed: false },
    { id: "h12", tenant_id: "tenant-barber-1", day_of_week: 5, open_time: "09:00", close_time: "21:00", is_closed: false },
    { id: "h13", tenant_id: "tenant-barber-1", day_of_week: 6, open_time: "08:00", close_time: "19:00", is_closed: false },
    { id: "h14", tenant_id: "tenant-barber-1", day_of_week: 0, open_time: "Fechado", close_time: "", is_closed: true },
  ],
  "tenant-nails-1": [
    { id: "h15", tenant_id: "tenant-nails-1", day_of_week: 1, open_time: "09:00", close_time: "18:00", is_closed: false },
    { id: "h16", tenant_id: "tenant-nails-1", day_of_week: 2, open_time: "09:00", close_time: "18:00", is_closed: false },
    { id: "h17", tenant_id: "tenant-nails-1", day_of_week: 3, open_time: "09:00", close_time: "18:00", is_closed: false },
    { id: "h18", tenant_id: "tenant-nails-1", day_of_week: 4, open_time: "09:00", close_time: "19:00", is_closed: false },
    { id: "h19", tenant_id: "tenant-nails-1", day_of_week: 5, open_time: "09:00", close_time: "19:00", is_closed: false },
    { id: "h20", tenant_id: "tenant-nails-1", day_of_week: 6, open_time: "09:00", close_time: "16:00", is_closed: false },
    { id: "h21", tenant_id: "tenant-nails-1", day_of_week: 0, open_time: "Fechado", close_time: "", is_closed: true },
  ],
};

function isLiveSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes("mock-project") && !url.includes("your-project"));
}

export const dataService = {
  // 1. Obter Perfil
  async getProfile(userId: string): Promise<Profile | null> {
    if (isLiveSupabaseConfigured()) {
      const supabase = await createClient();
      const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
      return data;
    }
    return DEMO_PROFILES[userId] || null;
  },

  // 2. Obter Todos os Tenants (Restrito ao Superadmin)
  async getAllTenants(): Promise<Tenant[]> {
    if (isLiveSupabaseConfigured()) {
      const supabase = await createClient();
      const { data } = await supabase.from("tenants").select("*").order("created_at", { ascending: false });
      return data || [];
    }
    return [...DEMO_TENANTS];
  },

  // 3. Obter Tenant por Proprietário (Para o Painel do Cliente)
  async getTenantByOwner(ownerId: string): Promise<Tenant | null> {
    if (isLiveSupabaseConfigured()) {
      const supabase = await createClient();
      const { data } = await supabase.from("tenants").select("*").eq("owner_id", ownerId).single();
      return data;
    }
    return DEMO_TENANTS.find((t) => t.owner_id === ownerId) || null;
  },

  // 4. Obter Landing Page por Tenant ID
  async getLandingPageByTenantId(tenantId: string): Promise<LandingPage | null> {
    if (isLiveSupabaseConfigured()) {
      const supabase = await createClient();
      const { data } = await supabase.from("landing_pages").select("*").eq("tenant_id", tenantId).single();
      return data;
    }
    return DEMO_PAGES[tenantId] || null;
  },

  // 5. Obter Dados Públicos por Slug (Com validação estrita de isolamento e status ativo)
  async getPublicPageBySlug(slug: string): Promise<{
    tenant: Tenant;
    page: LandingPage;
    services: ServiceItem[];
    business_hours: BusinessHour[];
  } | null> {
    if (isLiveSupabaseConfigured()) {
      const supabase = await createClient();
      const { data: tenant } = await supabase
        .from("tenants")
        .select("*")
        .eq("slug", slug)
        .eq("status", "active")
        .single();

      if (!tenant) return null;

      const { data: page } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("tenant_id", tenant.id)
        .eq("status", "published")
        .single();

      if (!page) return null;

      const { data: services } = await supabase
        .from("services")
        .select("*")
        .eq("tenant_id", tenant.id)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      const { data: hours } = await supabase
        .from("business_hours")
        .select("*")
        .eq("tenant_id", tenant.id)
        .order("day_of_week", { ascending: true });

      return {
        tenant,
        page,
        services: services || [],
        business_hours: hours || [],
      };
    }

    const tenant = DEMO_TENANTS.find((t) => t.slug === slug);
    if (!tenant) return null;

    const page = DEMO_PAGES[tenant.id];
    if (!page) return null;

    const services = DEMO_SERVICES[tenant.id] || [];
    const business_hours = DEMO_HOURS[tenant.id] || [];

    return {
      tenant,
      page,
      services,
      business_hours,
    };
  },

  // 6. Atualizar Status do Tenant (Superadmin)
  async updateTenantStatus(tenantId: string, status: "active" | "suspended" | "trial"): Promise<boolean> {
    if (isLiveSupabaseConfigured()) {
      const supabase = await createClient();
      const { error } = await supabase.from("tenants").update({ status }).eq("id", tenantId);
      return !error;
    }
    const tenant = DEMO_TENANTS.find((t) => t.id === tenantId);
    if (tenant) {
      tenant.status = status;
      return true;
    }
    return false;
  },

  // 7. Criar Novo Cliente/Tenant (Superadmin)
  async createTenant(data: {
    business_name: string;
    slug: string;
    segment: "salon" | "barber" | "nails";
    owner_name: string;
    owner_email: string;
    plan_type: "starter" | "pro";
  }): Promise<Tenant> {
    const newOwnerId = `owner-${Date.now()}`;
    const newTenantId = `tenant-${Date.now()}`;

    DEMO_PROFILES[newOwnerId] = {
      id: newOwnerId,
      email: data.owner_email,
      full_name: data.owner_name,
      role: "tenant_admin",
      created_at: new Date().toISOString(),
    };

    const newTenant: Tenant = {
      id: newTenantId,
      owner_id: newOwnerId,
      business_name: data.business_name,
      slug: data.slug.toLowerCase().trim().replace(/\s+/g, "-"),
      segment: data.segment,
      plan_type: data.plan_type,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    DEMO_TENANTS.unshift(newTenant);

    // Inicializa a landing page correspondente
    DEMO_PAGES[newTenantId] = {
      id: `page-${Date.now()}`,
      tenant_id: newTenantId,
      template_id: data.segment,
      status: "draft",
      theme_config: {
        primary_color: data.segment === "barber" ? "#C5A059" : data.segment === "nails" ? "#E0A395" : "#A9855E",
        accent_color: data.segment === "barber" ? "#1C1C1C" : data.segment === "nails" ? "#F5DDD7" : "#C2A37E",
        font_preset: data.segment === "barber" ? "classic" : data.segment === "nails" ? "modern" : "luxury",
        dark_mode: data.segment === "barber",
      },
      hero_section: {
        badge: data.segment === "barber" ? "Barbearia Tradicional" : data.segment === "nails" ? "Nail Designer" : "Salão de Beleza",
        headline: data.business_name,
        subheadline: "Atendimento personalizado e serviços de alta qualidade.",
        cta_text: "Agendar Horário",
        hero_image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
      },
      about_section: {
        title: "Sobre Nós",
        description: "Oferecemos os melhores tratamentos com pontualidade e dedicação.",
        years_experience: 5,
        highlight_image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      },
      contact_info: {
        whatsapp_number: "11999999999",
        whatsapp_default_message: "Olá! Gostaria de agendar um horário.",
        address_street: "Endereço comercial",
        address_neighborhood: "Bairro",
        address_city: "Cidade",
        address_state: "UF",
        google_maps_url: "",
        instagram_handle: "@seunegocio",
      },
      seo_title: `${data.business_name} | Agendamentos`,
      seo_description: `Conheça os serviços de ${data.business_name} e agende seu horário online.`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return newTenant;
  },

  // 8. Atualizar Configurações da Landing Page (Cliente)
  async updateLandingPage(tenantId: string, updates: Partial<LandingPage>): Promise<LandingPage | null> {
    const page = DEMO_PAGES[tenantId];
    if (!page) return null;

    DEMO_PAGES[tenantId] = {
      ...page,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return DEMO_PAGES[tenantId];
  },

  // 9. Publicar ou Reverter para Rascunho
  async togglePublishPage(tenantId: string): Promise<LandingPage | null> {
    const page = DEMO_PAGES[tenantId];
    if (!page) return null;

    const newStatus = page.status === "published" ? "draft" : "published";
    page.status = newStatus;
    if (newStatus === "published") {
      page.published_at = new Date().toISOString();
    }
    page.updated_at = new Date().toISOString();
    return page;
  },

  // 10. Atualizar Dados do Tenant (Nome, Segmento/Template)
  async updateTenant(tenantId: string, updates: { business_name?: string; segment?: "salon" | "barber" | "nails" }): Promise<Tenant | null> {
    if (isLiveSupabaseConfigured()) {
      const supabase = await createClient();
      const { data } = await supabase.from("tenants").update(updates).eq("id", tenantId).select().single();
      return data;
    }
    const tenant = DEMO_TENANTS.find((t) => t.id === tenantId);
    if (!tenant) return null;
    if (updates.business_name) tenant.business_name = updates.business_name;
    if (updates.segment) {
      tenant.segment = updates.segment;
      // Atualiza também o template_id correspondente na landing page
      const page = DEMO_PAGES[tenantId];
      if (page) {
        page.template_id = updates.segment;
      }
    }
    tenant.updated_at = new Date().toISOString();
    return tenant;
  },

  // 11. Obter Serviços do Tenant
  async getServices(tenantId: string): Promise<ServiceItem[]> {
    if (isLiveSupabaseConfigured()) {
      const supabase = await createClient();
      const { data } = await supabase.from("services").select("*").eq("tenant_id", tenantId).order("sort_order", { ascending: true });
      return data || [];
    }
    return DEMO_SERVICES[tenantId] || [];
  },

  // 12. Adicionar Novo Serviço
  async createService(
    tenantId: string,
    data: { name: string; description: string; category: string; price: number; duration_minutes: number; is_active?: boolean }
  ): Promise<ServiceItem> {
    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      tenant_id: tenantId,
      name: data.name,
      description: data.description,
      category: data.category || "Geral",
      price: data.price,
      duration_minutes: data.duration_minutes || 60,
      is_active: data.is_active ?? true,
      sort_order: (DEMO_SERVICES[tenantId]?.length || 0) + 1,
      created_at: new Date().toISOString(),
    };

    if (isLiveSupabaseConfigured()) {
      const supabase = await createClient();
      const { data: created } = await supabase.from("services").insert(newService).select().single();
      if (created) return created;
    }

    if (!DEMO_SERVICES[tenantId]) {
      DEMO_SERVICES[tenantId] = [];
    }
    DEMO_SERVICES[tenantId].push(newService);
    return newService;
  },

  // 13. Atualizar Serviço Existente
  async updateService(
    tenantId: string,
    serviceId: string,
    updates: Partial<ServiceItem>
  ): Promise<ServiceItem | null> {
    if (isLiveSupabaseConfigured()) {
      const supabase = await createClient();
      const { data } = await supabase.from("services").update(updates).eq("id", serviceId).eq("tenant_id", tenantId).select().single();
      return data;
    }

    const list = DEMO_SERVICES[tenantId] || [];
    const index = list.findIndex((s) => s.id === serviceId);
    if (index === -1) return null;

    list[index] = { ...list[index], ...updates };
    return list[index];
  },

  // 14. Remover Serviço
  async deleteService(tenantId: string, serviceId: string): Promise<boolean> {
    if (isLiveSupabaseConfigured()) {
      const supabase = await createClient();
      const { error } = await supabase.from("services").delete().eq("id", serviceId).eq("tenant_id", tenantId);
      return !error;
    }

    if (!DEMO_SERVICES[tenantId]) return false;
    DEMO_SERVICES[tenantId] = DEMO_SERVICES[tenantId].filter((s) => s.id !== serviceId);
    return true;
  },

  // 15. Adicionar Imagem à Galeria
  async addGalleryImage(
    tenantId: string,
    image: { url: string; title: string; alt?: string }
  ): Promise<LandingPage | null> {
    const page = DEMO_PAGES[tenantId];
    if (!page) return null;

    if (!page.gallery) {
      page.gallery = [];
    }

    page.gallery.push({
      id: `gal-${Date.now()}`,
      url: image.url,
      title: image.title,
      alt: image.alt || image.title,
    });
    page.updated_at = new Date().toISOString();
    return page;
  },

  // 16. Remover Imagem da Galeria
  async deleteGalleryImage(tenantId: string, imageId: string): Promise<LandingPage | null> {
    const page = DEMO_PAGES[tenantId];
    if (!page || !page.gallery) return null;

    page.gallery = page.gallery.filter((img) => img.id !== imageId);
    page.updated_at = new Date().toISOString();
    return page;
  },

  // 17. Obter e Atualizar Horários
  async getBusinessHours(tenantId: string): Promise<BusinessHour[]> {
    if (isLiveSupabaseConfigured()) {
      const supabase = await createClient();
      const { data } = await supabase.from("business_hours").select("*").eq("tenant_id", tenantId).order("day_of_week", { ascending: true });
      return data || [];
    }
    return DEMO_HOURS[tenantId] || [];
  },

  async updateBusinessHour(
    tenantId: string,
    dayOfWeek: number,
    openTime: string,
    closeTime: string,
    isClosed: boolean
  ): Promise<boolean> {
    if (isLiveSupabaseConfigured()) {
      const supabase = await createClient();
      const { error } = await supabase
        .from("business_hours")
        .upsert({ tenant_id: tenantId, day_of_week: dayOfWeek, open_time: openTime, close_time: closeTime, is_closed: isClosed });
      return !error;
    }

    const hours = DEMO_HOURS[tenantId] || [];
    const item = hours.find((h) => h.day_of_week === dayOfWeek);
    if (item) {
      item.open_time = openTime;
      item.close_time = closeTime;
      item.is_closed = isClosed;
    } else {
      hours.push({
        id: `h-${Date.now()}`,
        tenant_id: tenantId,
        day_of_week: dayOfWeek,
        open_time: openTime,
        close_time: closeTime,
        is_closed: isClosed,
      });
      DEMO_HOURS[tenantId] = hours;
    }
    return true;
  },

  // 18. Alterar Status Explícito da Página
  async setPageStatus(tenantId: string, status: "draft" | "published"): Promise<LandingPage | null> {
    const page = DEMO_PAGES[tenantId];
    if (!page) return null;

    page.status = status;
    if (status === "published") {
      page.published_at = new Date().toISOString();
    }
    page.updated_at = new Date().toISOString();
    return page;
  },
};

