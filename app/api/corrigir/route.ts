import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

// Corrige o português do depoimento SEM alterar o sentido.
// A chave ANTHROPIC_API_KEY vem das variáveis de ambiente.

export async function POST(req: NextRequest) {
  const { depoimento, tom } = await req.json();

  if (!depoimento || typeof depoimento !== "string") {
    return NextResponse.json(
      { erro: "Envie o campo 'depoimento' como texto." },
      { status: 400 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    // Modo demo: devolve uma versão levemente ajustada para o app rodar
    // sem a chave configurada.
    return NextResponse.json({
      corrigido: depoimento.charAt(0).toUpperCase() + depoimento.slice(1),
      modo: "demo",
    });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const instrucaoTom =
    tom === "emocionante"
      ? "Deixe o tom um pouco mais emocionante e caloroso, mas sem inventar fatos."
      : "Mantenha o tom natural e sincero do aluno.";

  const prompt = `Você corrige depoimentos de alunos aprovados em vestibulares.

Regras invioláveis:
- Corrija apenas ortografia, pontuação, acentuação e concordância.
- NÃO altere o sentido, os fatos, os nomes de curso/faculdade ou a mensagem do aluno.
- NÃO invente informações que o aluno não escreveu.
- Preserve a voz pessoal do aluno. ${instrucaoTom}
- Responda SOMENTE com o depoimento corrigido, sem aspas e sem comentários.

Depoimento original:
${depoimento}`;

  try {
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    });

    const texto = msg.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { text: string }).text)
      .join("")
      .trim();

    return NextResponse.json({ corrigido: texto, modo: "ia" });
  } catch (e) {
    return NextResponse.json(
      { erro: "Não foi possível corrigir agora. Tente novamente." },
      { status: 500 }
    );
  }
}
