import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// Configura a ferramenta de busca
const searchTool = new TavilySearchResults({
  maxResults: 3,
  apiKey: process.env.TAVILY_API_KEY,
});

// Configura o Google Gemini
const chatModel = new ChatGoogleGenerativeAI({
  modelName: "gemini-pro", // Versão gratuita e eficiente
  maxOutputTokens: 2048,
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function generateNutritionPlan(userData: any) {
  console.log("🛠️ Iniciando consultoria com Gemini para:", userData.goal);

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
      1. Calcule IMC e TMB.
      2. Crie cardápio (Café, Almoço, Lanche, Jantar).
      3. IMPORTANTE: Retorne APENAS um JSON válido. Não coloque crases, não coloque a palavra 'json' no início. Apenas abra chaves '{' e feche chaves '}'.
      
      Formato JSON obrigatório:
      {
        "summary": "Resumo da estratégia",
        "calories": "X kcal",
        "meals": [
          { "name": "Café da Manhã", "items": ["Item A", "Item B"], "macros": "Prot: Xg..." },
          { "name": "Almoço", "items": ["Item A", "Item B"], "macros": "Prot: Xg..." },
          { "name": "Jantar", "items": ["Item A", "Item B"], "macros": "Prot: Xg..." }
        ],
        "tips": ["Dica 1", "Dica 2"]
      }
    `;

    const response = await chatModel.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage("Gere o plano agora.")
    ]);

    // Limpeza extra para garantir que o Gemini não mande markdown
    let cleanText = response.content.toString();
    cleanText = cleanText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Encontra onde começa e termina o JSON (caso ele fale algo antes)
    const firstBracket = cleanText.indexOf("{");
    const lastBracket = cleanText.lastIndexOf("}");
    if (firstBracket !== -1 && lastBracket !== -1) {
        cleanText = cleanText.substring(firstBracket, lastBracket + 1);
    }

    return JSON.parse(cleanText);

  } catch (error) {
    console.error("Erro na IA:", error);
    throw new Error("Falha ao gerar dieta. Tente novamente.");
  }
}