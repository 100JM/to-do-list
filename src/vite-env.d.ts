/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_KAKAO_MAP_API_KEY: string
    readonly VITE_KAKAO_REST_API_KEY: string
    readonly VITE_GOOGLE_MAP_API_KEY: string
    readonly VITE_GOOGLE_PLACE_API_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}