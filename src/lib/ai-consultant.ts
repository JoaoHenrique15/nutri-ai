import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateNutritionPlan(data: any) {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error("Chave de API não configurada no .env");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Usamos o modelo Flash 1.5 que é RÁPIDO e aceita a chave gratuita
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        // Essa linha OBRIGA a IA a devolver apenas JSON (sem texto extra)
        responseMimeType: "application/json" 
      }
    });

    const prompt = `
      Crie uma dieta para:
      Peso: ${data.weight}kg, Altura: ${data.height}cm, Objetivo: ${data.goal}.
      
      Responda EXATAMENTE neste esquema JSON:
      {
        "calories": "ex: 2000 kcal",
        "summary": "Resumo motivacional curto.",
        "meals": [
          { "name": "Café da Manhã", "time": "08:00", "foods": ["2 Ovos", "Café"] },
          { "name": "Almoço", "time": "12:00", "foods": ["Frango", "Arroz"] },
          { "name": "Jantar", "time": "20:00", "foods": ["Salada", "Peixe"] }
        ]
      }
    `;

    console.log("🤖 Consultando IA (Modelo Flash)...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("✅ Resposta recebida!");
    return JSON.parse(text);

  } catch (error: any) {
    console.error("❌ ERRO REAL:", error);
    
    // Se der erro, retornamos um plano padrão para o site NÃO QUEBRAR
    return {
      calories: "Cálculo Indisponível",
      summary: "O Google Gemini está instável agora. Tente novamente em 1 minuto.",
      meals: [
        { name: "Aviso", time: "--:--", foods: ["Tente gerar novamente"] }
      ]
    };
  }
}