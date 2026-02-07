// teste-puro.js
const API_KEY = "AIzaSyCQIxirWAtKQzggh7Unyf8VIeesYOgL98A"; 

// Tentativa com o alias genérico
const MODELO = "gemma-3-4b-it";

const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent?key=${API_KEY}`;

async function testarConexao() {
  console.log(`📡 Testando o ALIAS: ${MODELO}...`);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: "Responda: SUCESSO" }] }] })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("❌ ERRO:", JSON.stringify(data, null, 2));
    } else {
      console.log("✅ SUCESSO ABSOLUTO! 🎉");
      console.log("🤖", data.candidates[0].content.parts[0].text);
    }
  } catch (error) { console.error("Erro:", error); }
}
testarConexao();