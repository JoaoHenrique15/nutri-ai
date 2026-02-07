import { auth, signIn, signOut } from "@/lib/auth";
import { createDietAction } from "./actions";
import { prisma } from "@/lib/prisma";

// Função segura para buscar dados sem quebrar o site
async function getUserDiet(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { diets: { orderBy: { createdAt: 'desc' }, take: 1 } }
    });
    
    if (!user?.diets?.[0]) return null;
    
    const content = user.diets[0].content;
    return typeof content === 'string' ? JSON.parse(content) : content;
  } catch (e) {
    console.log("Banco de dados indisponível (Modo Leitura Offline)");
    return null;
  }
}

export default async function Home() {
  const session = await auth();
  const currentDiet = session?.user?.id ? await getUserDiet(session.user.id) : null;

  // --- TELA DA DIETA GERADA ---
  if (currentDiet && currentDiet.meals.length > 0) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2 text-xl font-bold text-green-700">
            <span>🥗</span> NutriAI
          </div>
          <div className="flex gap-4 items-center">
            <form action={async () => { 
              "use server"; 
              if (session?.user?.id) {
                // Tenta deletar, mas não quebra se falhar
                try { await prisma.dietPlan.deleteMany({ where: { userId: session.user.id }}); } catch(e){}
              }
            }}>
              <button className="text-sm font-semibold text-green-700 bg-green-50 px-4 py-2 rounded-full hover:bg-green-100 transition">
                Gerar Nova
              </button>
            </form>
            <form action={async () => { "use server"; await signOut(); }}>
              <button className="text-sm text-red-500 hover:text-red-700 font-medium">Sair</button>
            </form>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 mt-8">
          {/* Card Principal */}
          <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl mb-8 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-3">Seu Plano Alimentar</h2>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">{currentDiet.summary}</p>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-lg border border-white/10">
                <span className="text-yellow-400 font-bold">⚡ Meta Diária:</span>
                <span className="font-mono text-xl">{currentDiet.calories}</span>
              </div>
            </div>
          </div>

          {/* Grid de Refeições */}
          <div className="grid md:grid-cols-2 gap-6">
            {currentDiet.meals.map((meal: any, index: number) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-800 text-lg">{meal.name}</h3>
                  <span className="text-xs font-bold bg-green-100 text-green-800 px-3 py-1 rounded-full">{meal.time}</span>
                </div>
                <ul className="space-y-3">
                  {meal.foods.map((food: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0" />
                      {food}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // --- TELA DE FORMULÁRIO (HOME) ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="w-full bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shadow-sm">
        <div className="font-bold text-xl text-green-600 flex items-center gap-2"><span>🥗</span> NutriAI</div>
        {session && (
          <form action={async () => { "use server"; await signOut(); }}>
            <button className="text-sm font-medium text-red-500">Sair da conta</button>
          </form>
        )}
      </nav>

      <main className="max-w-2xl mx-auto pt-12 px-4 pb-20">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Gerador de Dietas Inteligente</h1>
          <p className="text-lg text-slate-500">Inteligência Artificial criando seu cardápio ideal em segundos.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
          {!session ? (
            <div className="text-center py-10">
              <div className="mb-6 bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl">🔒</div>
              <h3 className="text-xl font-bold mb-2">Faça login para começar</h3>
              <p className="text-slate-500 mb-6">Salve seu histórico e acesse de qualquer lugar.</p>
              <form action={async () => { "use server"; await signIn("google"); }}>
                <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition w-full shadow-lg">
                  Continuar com Google
                </button>
              </form>
            </div>
          ) : (
            <form action={createDietAction} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Altura (cm)</label>
                  <input name="height" type="number" placeholder="175" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Peso (kg)</label>
                  <input name="weight" type="number" placeholder="80" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Idade</label>
                <input name="age" type="number" placeholder="25" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Objetivo</label>
                <select name="goal" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition cursor-pointer">
                  <option value="Emagrecer">Queimar Gordura</option>
                  <option value="Hipertrofia">Ganhar Massa Muscular</option>
                  <option value="Saúde">Reeducação Alimentar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nível de Atividade</label>
                <select name="activityLevel" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition cursor-pointer">
                  <option value="Sedentário">Sedentário (Trabalho de escritório)</option>
                  <option value="Leve">Leve (Exercício 1-2x/semana)</option>
                  <option value="Moderado">Moderado (Exercício 3-5x/semana)</option>
                  <option value="Intenso">Intenso (Atleta/Todo dia)</option>
                </select>
              </div>
              
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Restrições ou Alergias</label>
                 <textarea name="restrictions" placeholder="Ex: Sou diabético, não como carne de porco..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition h-24 resize-none"></textarea>
              </div>

              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition shadow-xl shadow-green-200 active:scale-[0.98]">
                ✨ Gerar Dieta Personalizada
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}