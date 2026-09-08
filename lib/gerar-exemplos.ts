import { MATERIAS } from "./supabase";
import type { Materia, Registro, StatusRegistro } from "./supabase";

// Gerador de dados de DEMONSTRACAO em volume, para ver como o painel se
// comporta com dezenas de registros em vez de meia duzia.
//
// E deterministico de proposito (PRNG com semente fixa): o mesmo dataset sai
// igual em todo build e em todo render. Isso evita divergencia entre o que o
// servidor renderiza e o que o navegador monta, e faz print/bug ser
// reproduzivel — com Math.random nada disso vale.

// mulberry32: PRNG pequeno e estavel, suficiente para dados de exemplo.
function semente(s: number) {
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NOMES = [
  "Ana", "Beatriz", "Camila", "Daniela", "Eduarda", "Fernanda", "Gabriela",
  "Helena", "Isabela", "Juliana", "Larissa", "Mariana", "Nathalia", "Olivia",
  "Patricia", "Rafaela", "Sofia", "Tatiane", "Vitoria", "Yasmin",
  "Andre", "Bruno", "Caio", "Daniel", "Enzo", "Felipe", "Gustavo", "Henrique",
  "Igor", "Joao", "Lucas", "Matheus", "Nicolas", "Otavio", "Pedro", "Rafael",
  "Samuel", "Thiago", "Vinicius", "Wesley",
];

const SOBRENOMES = [
  "Silva", "Santos", "Oliveira", "Souza", "Lima", "Pereira", "Costa",
  "Almeida", "Nascimento", "Carvalho", "Ferreira", "Rodrigues", "Gomes",
  "Martins", "Araujo", "Ribeiro", "Barbosa", "Rocha", "Alves", "Monteiro",
  "Cardoso", "Teixeira", "Moraes", "Freitas", "Machado",
];

const CURSOS = [
  "Medicina", "Direito", "Engenharia Civil", "Psicologia", "Odontologia",
  "Enfermagem", "Administracao", "Ciencia da Computacao", "Arquitetura",
  "Nutricao", "Fisioterapia", "Medicina Veterinaria", "Farmacia",
  "Jornalismo", "Biomedicina", "Engenharia de Producao", "Pedagogia",
  "Ciencias Contabeis", "Fonoaudiologia", "Educacao Fisica",
];

const FACULDADES = [
  "UFBA", "UFRB", "UNEB", "UEFS", "UFSB", "IFBA", "USP", "UNICAMP",
  "UFMG", "UFRJ", "UNIFESP", "UFPE", "UFC", "UFPR", "UFRGS",
];

const DEPOIMENTOS = [
  "estudei no assaad e consegui realizar o sonho da minha familia inteira",
  "os professores nao desistiram de mim nenhum dia, devo tudo a eles",
  "entrei achando que nao ia conseguir e sai aprovado, ainda nao acredito",
  "foi um ano puxado mas cada aula valeu a pena, obrigado por tudo",
  "minha mae chorou quando viu o resultado, esse card e pra ela",
  "sai da escola publica e passei numa federal, quero que isso inspire alguem",
  "reprovei duas vezes antes, na terceira deu certo, nao desistam",
  "o simulado semanal foi o que mais me ajudou a segurar o nervosismo",
  "trabalhava de dia e estudava de noite, hoje posso dizer que consegui",
  "o assaad me deu base e confianca, o resto foi esforco",
];

const SELOS = [
  "1º lugar", "1ª chamada", "Nota 1000 na redação", "Bolsa integral",
  "Ampla concorrência", "Cotista",
];

const STATUS: StatusRegistro[] = ["pendente", "design_pronto", "postado"];

function escolher<T>(r: () => number, lista: T[]): T {
  return lista[Math.floor(r() * lista.length)];
}

// Data espalhada num intervalo, em ordem decrescente de recencia.
function dataEm(base: string, diasAtras: number, r: () => number) {
  const d = new Date(base);
  d.setDate(d.getDate() - diasAtras);
  d.setHours(8 + Math.floor(r() * 12), Math.floor(r() * 60), 0, 0);
  return d.toISOString();
}

export function gerarAprovacoes(
  quantidade: number,
  emailsUsados: Set<string>
): Registro[] {
  const r = semente(20260908);
  const saida: Registro[] = [];

  for (let i = 0; i < quantidade; i++) {
    const nome = `${escolher(r, NOMES)} ${escolher(r, SOBRENOMES)}`;
    // Sufixo numerico garante email unico mesmo com nome repetido — senao
    // dois homonimos virariam um card agrupado por engano.
    const base = nome.toLowerCase().replace(/\s+/g, ".").replace(/[^a-z.]/g, "");
    let email = `${base}@email.com`;
    let n = 2;
    while (emailsUsados.has(email)) email = `${base}${n++}@email.com`;
    emailsUsados.add(email);

    // ~10% nao autoriza: proporcao parecida com a real, o suficiente para o
    // filtro e a metrica de alerta terem o que mostrar.
    const autoriza = r() > 0.1;
    const status = escolher(r, STATUS);
    // Depoimento revisado so existe em quem ja saiu de "pendente".
    const original = escolher(r, DEPOIMENTOS);
    const revisado = status === "pendente" ? null : maiuscula(original);

    const quantosSelos = r() > 0.65 ? (r() > 0.85 ? 2 : 1) : 0;
    const selos: string[] = [];
    while (selos.length < quantosSelos) {
      const s = escolher(r, SELOS);
      if (!selos.includes(s)) selos.push(s);
    }

    saida.push({
      id: `gen-ap-${i}`,
      nome,
      email,
      tipo: "aprovacao",
      curso: escolher(r, CURSOS),
      faculdade: escolher(r, FACULDADES),
      acertos: null,
      depoimento_original: original,
      depoimento_corrigido: revisado,
      foto_url: null,
      comprovante_url: null,
      status,
      autoriza_postagem: autoriza,
      selos,
      criado_em: dataEm("2027-01-29T00:00:00Z", Math.floor(r() * 21), r),
    });
  }

  return saida;
}

export function gerarAcertos(
  quantidade: number,
  emailsUsados: Set<string>
): Registro[] {
  const r = semente(20261110);
  const saida: Registro[] = [];

  for (let i = 0; i < quantidade; i++) {
    const nome = `${escolher(r, NOMES)} ${escolher(r, SOBRENOMES)}`;
    const base = nome.toLowerCase().replace(/\s+/g, ".").replace(/[^a-z.]/g, "");
    let email = `${base}@email.com`;
    let n = 2;
    while (emailsUsados.has(email)) email = `${base}${n++}@email.com`;
    emailsUsados.add(email);

    // Distribuicao por materia; o total do dia e a soma das duas areas dele.
    const porMateria: Partial<Record<Materia, number>> = {};
    // ~20% mandou so o total do dia, sem abrir por materia — acontece.
    const abriuMaterias = r() > 0.2;
    for (const m of MATERIAS) {
      if (abriuMaterias) {
        porMateria[m.id] = 22 + Math.floor(r() * (m.total - 21));
      }
    }
    const soma = (dia: 1 | 2) =>
      MATERIAS.filter((m) => m.dia === dia).reduce(
        (t, m) => t + (porMateria[m.id] ?? 0),
        0
      );

    const dia1 = abriuMaterias ? soma(1) : 45 + Math.floor(r() * 40);
    // ~15% ainda nao mandou o dia 2.
    const mandouDia2 = r() > 0.15;
    const dia2 = !mandouDia2 ? null : abriuMaterias ? soma(2) : 45 + Math.floor(r() * 40);

    if (!mandouDia2) {
      for (const m of MATERIAS.filter((x) => x.dia === 2)) delete porMateria[m.id];
    }

    saida.push({
      id: `gen-ac-${i}`,
      nome,
      email,
      tipo: "acerto",
      curso: "",
      faculdade: "",
      acertos: { dia1, dia2, materias: porMateria },
      depoimento_original: escolher(r, DEPOIMENTOS),
      depoimento_corrigido: null,
      foto_url: null,
      comprovante_url: null,
      status: escolher(r, STATUS),
      autoriza_postagem: r() > 0.1,
      selos: r() > 0.8 ? [escolher(r, SELOS)] : [],
      criado_em: dataEm("2026-11-11T00:00:00Z", Math.floor(r() * 4), r),
    });
  }

  return saida;
}

function maiuscula(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1) + ".";
}
