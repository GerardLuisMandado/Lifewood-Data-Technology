/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_ADMIN_EMAILS?: string;
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
  readonly VITE_EMAILJS_TEMPLATE_HIRED?: string;
  readonly VITE_EMAILJS_TEMPLATE_UPDATE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
