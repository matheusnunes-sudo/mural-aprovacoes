import type { Config } from "tailwindcss";

// Design tokens sao a fonte da verdade do padrao visual.
// Ajuste as cores da marca aqui e o app inteiro acompanha.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Superficies em escala de elevacao (referencia: ClickUp / Apple)
        surface: {
          canvas: "#F7F7F8",   // fundo da pagina
          card: "#FFFFFF",     // cartoes
          sunken: "#F0F0F2",   // areas rebaixadas (uploads, campos)
        },
        ink: {
          DEFAULT: "#1A1A1E",  // texto primario
          soft: "#5B5B66",     // texto secundario
          muted: "#8E8E99",    // dicas, placeholders
        },
        line: {
          DEFAULT: "#E6E6EA",  // hairline padrao
          strong: "#D4D4DA",   // divisor em enfase
        },
        // Cor da marca Assaad. TROCAR pelo hex oficial da plataforma.
        brand: {
          50: "#EAF2FF",
          100: "#CFE0FF",
          500: "#2563EB",
          600: "#1D4FD8",
          700: "#1740B0",
        },
        // Estados semanticos
        warning: { bg: "#FFF4E5", fg: "#B25E00" },
        success: { bg: "#E7F6EC", fg: "#1B7F42" },
        info: { bg: "#EAF2FF", fg: "#1D4FD8" },
      },
      fontFamily: {
        // Referencia Apple/ClickUp: sans geometrica e legivel.
        // Inter cobre bem; troque por fonte da marca se houver.
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        // Cantos generosos como ClickUp/Apple, sem exagero
        card: "14px",
        control: "10px",
      },
      boxShadow: {
        // Sombras suaves e funcionais, nunca pesadas
        card: "0 1px 2px rgba(16,16,20,0.04), 0 1px 3px rgba(16,16,20,0.06)",
        pop: "0 8px 24px rgba(16,16,20,0.10)",
      },
      fontSize: {
        // Escala tipografica intencional
        display: ["28px", { lineHeight: "1.2", fontWeight: "600" }],
        title: ["20px", { lineHeight: "1.3", fontWeight: "600" }],
        body: ["15px", { lineHeight: "1.6", fontWeight: "400" }],
        label: ["13px", { lineHeight: "1.4", fontWeight: "500" }],
        caption: ["12px", { lineHeight: "1.4", fontWeight: "400" }],
      },
    },
  },
  plugins: [],
};
export default config;
