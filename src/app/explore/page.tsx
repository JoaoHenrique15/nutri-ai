import { prisma } from "@/lib/prisma";
import Link from "next/link";

// Esta função permite que a página leia os parametros da URL (?search=musculo)
export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { search?: string; goal?: string }
}) {
  const search = searchParams.search || "";
  const goalFilter = searchParams.goal || "";

  // Busca no banco apenas as dietas PÚBLICAS
  const diets = await prisma.dietPlan.findMany({
    where: {
      isPublic: true, // OBRIGATÓRIO: Só mostra as públicas
      AND: [
        // Filtro de Texto (busca no titulo ou no conteudo JSON)
        search ? {
           OR: [
             { title: { contains: search } }, // SQLite não suporta mode: insensitive nativo facilmente no prisma, mas funciona bem para texto exato ou parcial simples
             { content: { contains: search } }
           ]
        } : {},
        // Filtro de Objetivo (Dropdown)
        goalFilter ? { content: { contains: goalFilter } } : {}
      ]
    },
    orderBy: { createdAt: "desc" },
    include: { user: true }
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      
      {/* NAVBAR SIMPLIFICADA */}
      <nav className="bg-white border-b border-slate-200 px-4 py-4 mb-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
           <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-800">
             <span className="text-2xl">🥗</span> NutriAI <span className="text-green-600 font-normal">Explore</span>
           </Link>
           <Link href="/" className="text-sm font-medium text-slate-500 hover:text-green-600">
             Criar minha dieta →
           </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4">
        
        {/* CABEÇALHO E PESQUISA */}
        <div className="text-center mb-12 space-y-4">
           <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
             Inspire-se com a Comunidade
           </h1>
           <p className="text-slate-600">Veja exemplos reais de dietas geradas pela nossa Inteligência Artificial.</p>
           
           {/* FORMULÁRIO DE PESQUISA (GET) */}
           <form className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 mt-8">
             <input 
               name="search"
               defaultValue={search}
               placeholder="Pesquisar ex: Frango, 2000kcal..." 
               className="flex-1 p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-500 outline-none"
             />
             <select 
               name="goal" 
               defaultValue={goalFilter}
               className="p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-500 outline-none bg-white"
             >
               <option value="">Todos os Objetivos</option>
               <option value="Perder gordura">Queimar Gordura</option>
               <option value="Ganhar massa">Ganhar Massa</option>
               <option value="Manter peso">Manter Peso</option>
             </select>
             <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition">
               Buscar
             </button>
           </form>
        </div>

        {/* GRID DE RESULTADOS */}
        {diets.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-4">🕵️‍♀️</p>
            <p>Nenhuma dieta encontrada com esses filtros.</p>
            {/* Se for o admin e não tiver nada publicado, avisa */}
            <p className="text-xs mt-2">Dica: Vá no painel Admin e torne algumas dietas públicas!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diets.map((diet) => {
              // Parse rápido do JSON para pegar dados chaves
              let data;
              try { data = JSON.parse(diet.content) } catch { return null }
              
              return (
                <div key={diet.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col h-full">
                  {/* Header do Card */}
                  <div className="p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                       {diet.user.image ? (
                         <img src={diet.user.image} className="w-8 h-8 rounded-full" alt="" />
                       ) : ( <div className="w-8 h-8 bg-slate-200 rounded-full"/> )}
                       <div className="text-xs">
                          <p className="font-bold text-slate-700">{diet.user.name}</p>
                          <p className="text-slate-400">{new Date(diet.createdAt).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <h3 className="font-bold text-slate-800 line-clamp-2 min-h-[3rem]">
                      {diet.title || "Plano Personalizado"}
                    </h3>
                  </div>

                  {/* Corpo do Card */}
                  <div className="p-5 flex-1 space-y-4">
                     <div className="flex gap-2 flex-wrap">
                        <span className="text-xs font-bold px-2 py-1 bg-green-50 text-green-700 rounded-md border border-green-100">
                          {data.calories || "?"} kcal
                        </span>
                        <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                           {data.meals?.length || 3} Refeições
                        </span>
                     </div>
                     <p className="text-sm text-slate-500 line-clamp-3">
                       {data.summary}
                     </p>
                  </div>
                  
                  {/* Footer do Card */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 mt-auto">
                    <div className="text-xs text-slate-400 text-center italic">
                       "Gerado via NutriAI"
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  );
}