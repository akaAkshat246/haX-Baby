/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SB_URL?: string;
  readonly VITE_SB_ANON?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
