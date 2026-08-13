import type { Config } from "tailwindcss";

// Os valores das cores vivem como CSS variables em app/globals.css, em canais
// RGB, para o mesmo token servir tema claro e escuro e ainda aceitar opacidade
// (ex.: bg-brand-500/10). Trocar de tema = trocar as variaveis, nao as
// classes dos componentes.
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          canvas: "rgb(var(--surface-canvas) / <alpha-value>)",
          card: "rgb(var(--surface-card) / <alpha-value>)",
          sunken: "rgb(var(--surface-sunken) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          soft: "rgb(var(--ink-soft) / <alpha-value>)",
          muted: "rgb(var(--ink-muted) / <alpha-value>)",
        },
        line: {
          DEFAULT: "rgb(var(--line) / <alpha-value>)",
          strong: "rgb(var(--line-strong) / <alpha-value>)",
        },
        // Azul unico de acento, no espirito do system blue da Apple.
        brand: {
          50: "rgb(var(--brand-50) / <alpha-value>)",
          100: "rgb(var(--brand-100) / <alpha-value>)",
          500: "rgb(var(--brand-500) / <alpha-value>)",
          600: "rgb(var(--brand-600) / <alpha-value>)",
          700: "rgb(var(--brand-700) / <alpha-value>)",
        },
        warning: {
          bg: "rgb(var(--warning-bg) / <alpha-value>)",
          fg: "rgb(var(--warning-fg) / <alpha-value>)",
        },
        success: {
          bg: "rgb(var(--success-bg) / <alpha-value>)",
          fg: "rgb(var(--success-fg) / <alpha-value>)",
        },
        info: {
          bg: "rgb(var(--info-bg) / <alpha-value>)",
          fg: "rgb(var(--info-fg) / <alpha-value>)",
        },
        danger: {
          bg: "rgb(var(--danger-bg) / <alpha-value>)",
          fg: "rgb(var(--danger-fg) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        card: "1.25rem", // 20px
        control: "0.75rem", // 12px
        pill: "999px",
      },
      boxShadow: {
        // Sombras vem de variavel: no escuro elas mudam de receita.
        card: "var(--shadow-card)",
        pop: "var(--shadow-pop)",
        lift: "var(--shadow-lift)",
      },
      fontSize: {
        // Escala em rem (respeita o tamanho de fonte do usuario) com tracking
        // por tamanho: aperta no texto grande, abre no pequeno.
        hero: [
          "clamp(2rem, 7vw, 2.75rem)",
          { lineHeight: "1.05", fontWeight: "700", letterSpacing: "-0.03em" },
        ],
        display: [
          "clamp(1.625rem, 5vw, 1.875rem)",
          { lineHeight: "1.15", fontWeight: "700", letterSpacing: "-0.025em" },
        ],
        title: [
          "1.25rem",
          { lineHeight: "1.3", fontWeight: "600", letterSpacing: "-0.015em" },
        ],
        body: [
          "0.9375rem",
          { lineHeight: "1.6", fontWeight: "400", letterSpacing: "0" },
        ],
        label: [
          "0.8125rem",
          { lineHeight: "1.4", fontWeight: "500", letterSpacing: "0.01em" },
        ],
        caption: [
          "0.75rem",
          { lineHeight: "1.4", fontWeight: "400", letterSpacing: "0.01em" },
        ],
      },
    },
  },
  plugins: [],
};
export default config;
