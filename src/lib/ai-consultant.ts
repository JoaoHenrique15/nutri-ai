import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export async function generateNutritionPlan(userData: any) {
  console.log("🛠️ Iniciando consultoria com Gemini para:", userData.goal);

  // VERIFICAÇÃO DE SEGURANÇA
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("❌ ERRO CRÍTICO: A chave GOOGLE_API_KEY não foi encontrada no arquivo .env");
    throw new Error("Chave de API do Google não configurada.");
  }

  // Configura a IA apenas quando a função é chamada (evita travar o site na inicialização)
  const chatModel = new ChatGoogleGenerativeAI({
    modelName: "gemini-pro",
    maxOutputTokens: 2048,
    apiKey: apiKey,
    temperature: 0.7,
  });

  try {
    const systemPrompt = `
      Você é um nutricionista especialista chamado NutriAI.
      DADOS DO CLIENTE:
      - Altura: ${userData.height} cm
      - Peso: ${userData.weight} kg
      - Idade: ${userData.age} anos
      - Meta: ${userData.goal}
      - Restrições: ${userData.restrictions}

      INSTRUÇÕES:
      Crie um cardápio de 1 dia (Café, Almoço, Lanche, Jantar) e retorne APENAS um JSON válido.
      Formato JSON obrigatório:
      {
        "summary": "Resumo...",
        "calories": "Total calórico",
        "meals": [
          { "name": "Café", "items": ["Item 1"], "macros": "Xg Prot" },
          { "name": "Almoço", "items": ["Item 1"], "macros": "Xg Prot" },
          { "name": "Jantar", "items": ["Item 1"], "macros": "Xg Prot" }
        ],
        "tips": ["Dica 1"]
      }
    `;

    const response = await chatModel.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage("Gere o plano agora.")
    ]);

    let cleanText = response.content.toString();
    cleanText = cleanText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const firstBracket = cleanText.indexOf("{");
    const lastBracket = cleanText.lastIndexOf("}");
    if (firstBracket !== -1 && lastBracket !== -1) {
        cleanText = cleanText.substring(firstBracket, lastBracket + 1);
    }

    return JSON.parse(cleanText);

  } catch (error) {
    console.error("Erro na IA:", error);
    return {
       summary: "Erro ao gerar dieta. Verifique a chave de API.",
       calories: "0",
       meals: [],
       tips: ["Erro técnico"]
    };
  }
}