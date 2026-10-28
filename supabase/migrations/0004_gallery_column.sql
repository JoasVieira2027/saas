-- Migração 0004: Coluna de galeria de imagens na tabela landing_pages
-- Problema identificado na auditoria pré-deploy: galeria não persistia no Supabase

ALTER TABLE public.landing_pages
  ADD COLUMN IF NOT EXISTS gallery JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.landing_pages.gallery IS 'Array JSON de objetos GalleryImage: [{id, url, title, alt}]';

