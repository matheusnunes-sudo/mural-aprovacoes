import type { Registro } from "./supabase";

// Dados de exemplo. Substituidos automaticamente pelos dados reais
// assim que o Supabase estiver configurado.
//
// Casos plantados de proposito:
// - Julia Santos aparece duas vezes em "aprovacao": dois envios do mesmo
//   email, que o painel mostra agrupado.
// - Julia e Pedro aparecem TAMBEM em "acerto": e o mesmo aluno em novembro
//   (acertos) e em janeiro (aprovacao).
// - Rafael Souza nao autoriza postagem: e o caso que a equipe precisa
//   enxergar antes de gastar design.
// - Carla mandou so o total do dia 1, sem abrir por materia — acontece.
// Os depoimentos "original" ficam com os erros de digitacao de proposito:
// e o que a correcao por IA existe para arrumar.
export const registrosMock: Registro[] = [
  // --- Acertos do ENEM (semana da prova) --------------------------------
  {
    id: "a1",
    nome: "Júlia Santos",
    email: "julia.santos@email.com",
    tipo: "acerto",
    curso: "",
    faculdade: "",
    acertos: {
      dia1: 82,
      dia2: 79,
      materias: { linguagens: 40, humanas: 42, natureza: 37, matematica: 42 },
    },
    depoimento_original:
      "sai da prova achando que tinha ido mal mas o resultado me surpreendeu demais",
    depoimento_corrigido: null,
    foto_url: null,
    comprovante_url: null,
    status: "pendente",
    autoriza_postagem: true,
    selos: ["1º lugar"],
    criado_em: "2026-11-10T20:00:00Z",
  },
  {
    id: "a2",
    nome: "Pedro Lima",
    email: "pedro.lima@email.com",
    tipo: "acerto",
    curso: "",
    faculdade: "",
    acertos: {
      dia1: 76,
      dia2: 81,
      materias: { linguagens: 38, humanas: 38, natureza: 39, matematica: 42 },
    },
    depoimento_original:
      "matematica sempre foi meu medo e foi onde eu mais acertei, valeu a pena",
    depoimento_corrigido:
      "Matemática sempre foi meu medo e foi onde eu mais acertei. Valeu a pena.",
    foto_url: null,
    comprovante_url: null,
    status: "design_pronto",
    autoriza_postagem: true,
    selos: ["Matemática"],
    criado_em: "2026-11-10T21:30:00Z",
  },
  {
    id: "a3",
    nome: "Carla Menezes",
    email: "carla.menezes@email.com",
    tipo: "acerto",
    curso: "",
    faculdade: "",
    // Mandou so o total do dia 1 — ainda sem abrir por materia.
    acertos: { dia1: 71, dia2: null, materias: {} },
    depoimento_original: "primeiro dia foi tranquilo, agora e focar no segundo",
    depoimento_corrigido: null,
    foto_url: null,
    comprovante_url: null,
    status: "pendente",
    autoriza_postagem: true,
    selos: [],
    criado_em: "2026-11-08T19:10:00Z",
  },
  {
    id: "a4",
    nome: "Rafael Souza",
    email: "rafael.souza@email.com",
    tipo: "acerto",
    curso: "",
    faculdade: "",
    acertos: {
      dia1: 68,
      dia2: 74,
      materias: { linguagens: 33, humanas: 35, natureza: 35, matematica: 39 },
    },
    depoimento_original: "consegui um resultado bom, mas prefiro nao divulgar",
    depoimento_corrigido: null,
    foto_url: null,
    comprovante_url: null,
    status: "pendente",
    autoriza_postagem: false,
    selos: [],
    criado_em: "2026-11-10T22:05:00Z",
  },

  // --- Aprovações (depois do SISU) ---------------------------------------
  {
    id: "1",
    nome: "Júlia Santos",
    email: "julia.santos@email.com",
    tipo: "aprovacao",
    curso: "Medicina",
    faculdade: "UFBA",
    acertos: null,
    depoimento_original:
      "eu estudei 2 anos no assaad e foi la que eu conseguir realizar meu sonho de passa em medicina, os profesor sao muito bom e me ajudaram bastante nessa jornada dificil",
    depoimento_corrigido: null,
    foto_url: null,
    comprovante_url: null,
    status: "pendente",
    autoriza_postagem: true,
    selos: ["1ª chamada"],
    criado_em: "2027-01-28T09:00:00Z",
  },
  {
    id: "6",
    nome: "Júlia Santos",
    email: "julia.santos@email.com",
    tipo: "aprovacao",
    curso: "Medicina",
    faculdade: "UFRB",
    acertos: null,
    depoimento_original:
      "passei tambem na ufrb, queria mandar essa segunda aprovacao pra voces",
    depoimento_corrigido: null,
    foto_url: null,
    comprovante_url: null,
    status: "pendente",
    autoriza_postagem: true,
    selos: ["Segunda aprovação"],
    criado_em: "2027-01-29T19:30:00Z",
  },
  {
    id: "2",
    nome: "Pedro Lima",
    email: "pedro.lima@email.com",
    tipo: "aprovacao",
    curso: "Direito",
    faculdade: "USP",
    acertos: null,
    depoimento_original:
      "o assaad mudou minha vida, passei em direito na usp e sou muito grato por tudo",
    depoimento_corrigido:
      "O Assaad mudou minha vida. Passei em Direito na USP e sou muito grato por tudo.",
    foto_url: null,
    comprovante_url: null,
    status: "design_pronto",
    autoriza_postagem: true,
    selos: ["1º lugar", "Nota 1000 na redação"],
    criado_em: "2027-01-27T14:20:00Z",
  },
  {
    id: "3",
    nome: "Ana Costa",
    email: "ana.costa@email.com",
    tipo: "aprovacao",
    curso: "Medicina",
    faculdade: "UFMG",
    acertos: null,
    depoimento_original:
      "realizei o sonho de entrar em medicina depois de muito esforco e dedicacao com o apoio dos professores",
    depoimento_corrigido:
      "Realizei o sonho de entrar em Medicina depois de muito esforço e dedicação, com o apoio dos professores.",
    foto_url: null,
    comprovante_url: null,
    status: "postado",
    autoriza_postagem: true,
    selos: ["Bolsa integral"],
    criado_em: "2027-01-24T11:00:00Z",
  },
  {
    id: "4",
    nome: "Rafael Souza",
    email: "rafael.souza@email.com",
    tipo: "aprovacao",
    curso: "Engenharia",
    faculdade: "USP",
    acertos: null,
    depoimento_original:
      "estudar no assaad foi decisivo pra minha aprovacao em engenharia, recomendo demais",
    depoimento_corrigido: null,
    foto_url: null,
    comprovante_url: null,
    status: "pendente",
    autoriza_postagem: false,
    selos: [],
    criado_em: "2027-01-29T08:15:00Z",
  },
  {
    id: "5",
    nome: "Mariana Alves",
    email: "mariana.alves@email.com",
    tipo: "aprovacao",
    curso: "Medicina",
    faculdade: "UFBA",
    acertos: null,
    depoimento_original:
      "passei em medicina na ufba e devo muito aos professores do assaad que sempre acreditaram em mim",
    depoimento_corrigido:
      "Passei em Medicina na UFBA e devo muito aos professores do Assaad, que sempre acreditaram em mim.",
    foto_url: null,
    comprovante_url: null,
    status: "design_pronto",
    autoriza_postagem: true,
    selos: [],
    criado_em: "2027-01-26T16:40:00Z",
  },
];
