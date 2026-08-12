import type { Aprovacao } from "./supabase";

// Dados de exemplo. Substituidos automaticamente pelos dados reais
// assim que o Supabase estiver configurado.
export const aprovacoesMock: Aprovacao[] = [
  {
    id: "1",
    nome: "Julia Santos",
    curso: "Medicina",
    faculdade: "UFBA",
    cidade: "Salvador",
    uf: "BA",
    depoimento_original:
      "eu estudei 2 anos no assaad e foi la que eu conseguir realizar meu sonho de passa em medicina, os profesor sao muito bom e me ajudaram bastante nessa jornada dificil",
    depoimento_corrigido: null,
    foto_url: null,
    comprovante_url: null,
    status: "pendente",
    responsavel: "Matheus",
    criado_em: "2026-08-10T09:00:00Z",
  },
  {
    id: "2",
    nome: "Pedro Lima",
    curso: "Direito",
    faculdade: "USP",
    cidade: "Sao Paulo",
    uf: "SP",
    depoimento_original:
      "o assaad mudou minha vida, passei em direito na usp e sou muito grato por tudo",
    depoimento_corrigido:
      "O Assaad mudou minha vida. Passei em Direito na USP e sou muito grato por tudo.",
    foto_url: null,
    comprovante_url: null,
    status: "design_pronto",
    responsavel: "Gabriel",
    criado_em: "2026-08-09T14:20:00Z",
  },
  {
    id: "3",
    nome: "Ana Costa",
    curso: "Medicina",
    faculdade: "UFMG",
    cidade: "Belo Horizonte",
    uf: "MG",
    depoimento_original:
      "realizei o sonho de entrar em medicina depois de muito esforco e dedicacao com o apoio dos professores",
    depoimento_corrigido:
      "Realizei o sonho de entrar em Medicina depois de muito esforco e dedicacao, com o apoio dos professores.",
    foto_url: null,
    comprovante_url: null,
    status: "postado",
    responsavel: "Pedro",
    criado_em: "2026-08-05T11:00:00Z",
  },
  {
    id: "4",
    nome: "Rafael Souza",
    curso: "Engenharia",
    faculdade: "USP",
    cidade: "Sao Paulo",
    uf: "SP",
    depoimento_original:
      "estudar no assaad foi decisivo pra minha aprovacao em engenharia, recomendo demais",
    depoimento_corrigido: null,
    foto_url: null,
    comprovante_url: null,
    status: "pendente",
    responsavel: "Matheus",
    criado_em: "2026-08-11T08:15:00Z",
  },
  {
    id: "5",
    nome: "Mariana Alves",
    curso: "Medicina",
    faculdade: "UFBA",
    cidade: "Feira de Santana",
    uf: "BA",
    depoimento_original:
      "passei em medicina na ufba e devo muito aos professores do assaad que sempre acreditaram em mim",
    depoimento_corrigido:
      "Passei em Medicina na UFBA e devo muito aos professores do Assaad, que sempre acreditaram em mim.",
    foto_url: null,
    comprovante_url: null,
    status: "design_pronto",
    responsavel: "Gabriel",
    criado_em: "2026-08-08T16:40:00Z",
  },
];

export const responsaveis = ["Matheus", "Gabriel", "Pedro"];
