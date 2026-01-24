import { auth, signIn, signOut } from "@/lib/auth";
import { createDietAction } from "./actions";
import { prisma } from "@/lib/prisma"; // Importando nosso gerenciador de banco
import Link from "next/link"; // Importando Link para navegação

export default async function Home() {
  const session = await auth();
  
  // Variável para saber se é admin
  let isAdmin = false;

  // Se tiver usuário logado, verifica no banco se é ADMIN
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true } // Só precisamos ler o cargo
    });
    if (user?.role === "ADMIN") isAdmin = true;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-green-100">
      
      {/* NAVBAR */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 fixed top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <span className="text-3xl">🥗</span>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
              NutriAI
            </span>
          </Link>

          {session && (
            <div className="flex items-center gap-4">
              
              {/* --- BOTÃO SECRETO DE ADMIN --- */}
              {isAdmin && (
                <Link 
                  href="/admin"
                  className="hidden md:flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-sm font-bold border border-purple-200 hover:bg-purple-200 transition"
                >
                  🛡️ Painel Admin
                </Link>
              )}
              {/* ----------------------------- */}

              <span className="hidden sm:block text-sm text-slate-600">
                Olá, {session.user?.name?.split(" ")[0]}
              </span>
              
               <form action={async () => { "use server"; await signOut(); }}>
                  <button className="text-sm font-medium text-red-500 hover:text-red-700 transition">Sair</button>
               </form>
               
               {session.user?.image && (
                 <img src={session.user.image} alt="Avatar" className="w-9 h-9 rounded-full border border-slate-200" />
               )}
            </div>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-700 text-xs font-bold tracking-wider uppercase mb-2">
              Inteligência Artificial & Nutrição
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Sua Dieta Perfeita, <br className="hidden md:block" />
              <span className="text-green-600">Gerada em Segundos.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              Abandone as dietas genéricas. Nossa IA analisa seu metabolismo e objetivos para criar um plano alimentar único para você.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            
            {/* LADO ESQUERDO: Vantagens */}
            <div className="space-y-8 mt-4">
              <div className="flex gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition">
                <div className="text-3xl bg-blue-50 w-12 h-12 flex items-center justify-center rounded-lg">⚡</div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Ultra Rápido</h3>
                  <p className="text-slate-500 text-sm">Receba seu cardápio completo em menos de 30 segundos.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition">
                <div className="text-3xl bg-green-50 w-12 h-12 flex items-center justify-center rounded-lg">🧬</div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">100% Personalizado</h3>
                  <p className="text-slate-500 text-sm">Consideramos sua idade, altura, peso e restrições alimentares.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition">
                <div className="text-3xl bg-purple-50 w-12 h-12 flex items-center justify-center rounded-lg">🧠</div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Powered by Gemini</h3>
                  <p className="text-slate-500 text-sm">Usamos a tecnologia mais avançada do Google para nutrição.</p>
                </div>
              </div>
            </div>

            {/* LADO DIREITO: O Formulário Poderoso */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
              
              {!session ? (
                <div className="text-center py-10">
                  <h2 className="text-2xl font-bold mb-4">Comece sua Jornada</h2>
                  <p className="text-slate-500 mb-8">Faça login para salvar seu histórico e gerar sua dieta.</p>
                  <form
                    action={async () => {
                      "use server";
                      await signIn("google");
                    }}
                  >
                    <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl transition flex items-center justify-center gap-3">
                       <span>G</span> Entrar com Google
                    </button>
                  </form>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                    Configurar Perfil
                  </h2>
                  
                  <form action={createDietAction} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Altura (cm)</label>
                        <input name="height" type="number" placeholder="ex: 175" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Peso (kg)</label>
                        <input name="weight" type="number" placeholder="ex: 80" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Idade</label>
                      <input name="age" type="number" placeholder="ex: 30" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Objetivo Principal</label>
                      <select name="goal" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition">
                        <option value="Perder gordura">🔥 Queimar gordura</option>
                        <option value="Ganhar massa muscular">💪 Ganhar massa muscular</option>
                        <option value="Manter peso e saúde">🥗 Manter peso e saúde</option>
                        <option value="Reeducação alimentar">🍎 Reeducação alimentar</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Restrições / Preferências</label>
                      <textarea name="restrictions" placeholder="Ex: Sou diabético, não gosto de brócolis, sou vegetariano..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition h-24 resize-none"></textarea>
                    </div>
                    
                    <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 hover:shadow-green-300 transform hover:-translate-y-0.5 transition duration-200 mt-2">
                      ✨ Gerar Minha Dieta com IA
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-2">Isso pode levar alguns segundos.</p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER SIMPLE */}
      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>&copy; 2024 NutriAI. Consultoria nutricional via IA.</p>
      </footer>
    </div>
  );
}