import type { Aprovacao } from "./supabase";

// Dados de exemplo. Substituidos automaticamente pelos dados reais
// assim que o Supabase estiver configurado.
// Julia Santos aparece duas vezes de proposito: e o caso de dois envios do
// mesmo email, que o painel mostra agrupado. Rafael Souza nao autoriza a
// postagem: e o caso que a equipe precisa enxergar antes de gastar design.
// Os depoimentos "original" ficam com os erros de digitacao de proposito —
// e o que a correcao por IA existe para arrumar.
export const aprovacoesMock: Aprovacao[] = [
  {
    id: "1",
    nome: "Júlia Santos",
    email: "julia.santos@email.com",
    curso: "Medicina",
    faculdade: "UFBA",
    depoimento_original:
      "eu estudei 2 anos no assaad e foi la que eu conseguir realizar meu sonho de passa em medicina, os profesor sao muito bom e me ajudaram bastante nessa jornada dificil",
    depoimento_corrigido: null,
    foto_url: null,
    comprovante_url: null,
    status: "pendente",
    autoriza_postagem: true,
    selos: ["1ª chamada"],
    criado_em: "2026-08-10T09:00:00Z",
  },
  {
    id: "6",
    nome: "Júlia Santos",
    email: "julia.santos@email.com",
    curso: "Medicina",
    faculdade: "UFRB",
    depoimento_original:
      "passei tambem na ufrb, queria mandar essa segunda aprovacao pra voces",
    depoimento_corrigido: null,
    foto_url: null,
    comprovante_url: null,
    status: "pendente",
    autoriza_postagem: true,
    selos: ["Segunda aprovação"],
    criado_em: "2026-08-11T19:30:00Z",
  },
  {
    id: "2",
    nome: "Pedro Lima",
    email: "pedro.lima@email.com",
    curso: "Direito",
    faculdade: "USP",
    depoimento_original:
      "o assaad mudou minha vida, passei em direito na usp e sou muito grato por tudo",
    depoimento_corrigido:
      "O Assaad mudou minha vida. Passei em Direito na USP e sou muito grato por tudo.",
    foto_url: null,
    comprovante_url: null,
    status: "design_pronto",
    autoriza_postagem: true,
    selos: ["1º lugar", "Nota 1000 na redação"],
    criado_em: "2026-08-09T14:20:00Z",
  },
  {
    id: "3",
    nome: "Ana Costa",
    email: "ana.costa@email.com",
    curso: "Medicina",
    faculdade: "UFMG",
    depoimento_original:
      "realizei o sonho de entrar em medicina depois de muito esforco e dedicacao com o apoio dos professores",
    depoimento_corrigido:
      "Realizei o sonho de entrar em Medicina depois de muito esforço e dedicação, com o apoio dos professores.",
    foto_url: null,
    comprovante_url: null,
    status: "postado",
    autoriza_postagem: true,
    selos: ["Bolsa integral"],
    criado_em: "2026-08-05T11:00:00Z",
  },
  {
    id: "4",
    nome: "Rafael Souza",
    email: "rafael.souza@email.com",
    curso: "Engenharia",
    faculdade: "USP",
    depoimento_original:
      "estudar no assaad foi decisivo pra minha aprovacao em engenharia, recomendo demais",
    depoimento_corrigido: null,
    foto_url: null,
    comprovante_url: null,
    status: "pendente",
    autoriza_postagem: false,
    selos: [],
    criado_em: "2026-08-11T08:15:00Z",
  },
  {
    id: "5",
    nome: "Mariana Alves",
    email: "mariana.alves@email.com",
    curso: "Medicina",
    faculdade: "UFBA",
    depoimento_original:
      "passei em medicina na ufba e devo muito aos professores do assaad que sempre acreditaram em mim",
    depoimento_corrigido:
      "Passei em Medicina na UFBA e devo muito aos professores do Assaad, que sempre acreditaram em mim.",
    foto_url: null,
    comprovante_url: null,
    status: "design_pronto",
    autoriza_postagem: true,
    selos: [],
    criado_em: "2026-08-08T16:40:00Z",
  },
];
