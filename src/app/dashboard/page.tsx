import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma"; // <--- Importando a conexão correta
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  // 1. Busca a dieta
  const dietPlan = await prisma.dietPlan.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  // 2. Verifica se é Admin (para mostrar o botão)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });
  const isAdmin = user?.role === "ADMIN";

  if (!dietPlan) redirect("/");

  let dietData;
  try {
    dietData = JSON.parse(dietPlan.content);
  } catch (e) {
    dietData = null;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* HEADER DO DASHBOARD */}
      <header className="bg-white border-b border-slate-200 p-4 mb-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-slate-800">🥗 Seu Plano NutriAI</h1>
            
            <div className="flex gap-4 items-center">
               {/* BOTÃO ADMIN AQUI TAMBÉM */}
               {isAdmin && (
                  <Link href="/admin" className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100 hover:bg-purple-100">
                    Admin 🛡️
                  </Link>
               )}

               <Link href="/" className="text-sm text-green-600 font-medium hover:underline">
                  ← Gerar Nova
               </Link>
            </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        
        {!dietData ? (
          <div className="text-center p-10 bg-red-50 text-red-600 rounded-xl">
            Ops! Houve um erro ao ler sua dieta. Tente gerar novamente.
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* RESUMO GERAL */}
            <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold mb-4">🎯 Estratégia do Dia</h2>
              <p className="text-slate-300 leading-relaxed text-lg mb-6">{dietData.summary}</p>
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <span className="text-yellow-400">⚡</span>
                <span className="font-semibold">Meta Calórica: {dietData.calories}</span>
              </div>
            </div>

            {/* REFEIÇÕES (GRID) */}
            <div className="grid md:grid-cols-2 gap-6">
              {dietData.meals?.map((meal: any, index: number) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800">{meal.name}</h3>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">Refeição {index + 1}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {meal.items?.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-slate-600 text-sm">
                        <span className="text-green-500 mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  {meal.macros && (
                    <div className="text-xs font-mono text-slate-400 bg-slate-50 p-2 rounded">
                      MACROS: {meal.macros}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* DICAS EXTRAS */}
            {dietData.tips && (
               <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-xl">
                 <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">💡 Dicas do Nutricionista</h3>
                 <ul className="list-disc list-inside space-y-2 text-yellow-900/80">
                    {dietData.tips.map((tip: string, i: number) => (
                      <li key={i}>{tip}</li>
                    ))}
                 </ul>
               </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}