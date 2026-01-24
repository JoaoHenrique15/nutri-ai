import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma"; // <--- MUDOU AQUI (Importe do arquivo que criamos)
import { redirect } from "next/navigation";
import { deleteDiet, toggleUserRole } from "./actions";

export default async function AdminDashboard() {
  const session = await auth();
  
  if (!session?.user?.id) redirect("/");

  // Verifica se quem está acessando é ADMIN
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (currentUser?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-600 font-bold">
        🛑 Acesso Negado.
      </div>
    );
  }

  // BUSCA DADOS DO BANCO
  // 1. Todas as dietas
  const allDiets = await prisma.dietPlan.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  // 2. Todos os usuários (para a gestão de equipe)
  const allUsers = await prisma.user.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Painel do Nutricionista</h1>
            <p className="text-slate-500">Gerencie dietas e permissões de acesso.</p>
          </div>
          <div className="flex gap-4 items-center">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Admin Logado
            </span>
            <a href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">Voltar ao Site →</a>
          </div>
        </header>

        {/* --- SEÇÃO 1: GERENCIAR USUÁRIOS E PERMISSÕES --- */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              👥 Gestão de Equipe e Usuários
            </h2>
            <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
              {allUsers.length} cadastrados
            </span>
          </div>
          
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
              <tr>
                <th className="p-4">Usuário</th>
                <th className="p-4">Email</th>
                <th className="p-4">Cargo Atual</th>
                <th className="p-4">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 flex items-center gap-3">
                    {user.image ? (
                      <img src={user.image} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                    )}
                    <span className="font-medium text-slate-700">{user.name}</span>
                  </td>
                  <td className="p-4 text-slate-500 text-sm">{user.email}</td>
                  <td className="p-4">
                    {user.role === "ADMIN" ? (
                      <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">
                        🛡️ ADMIN
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">
                        👤 CLIENTE
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {/* Não permite mudar o próprio cargo para não se trancar fora */}
                    {user.id !== currentUser.id && (
                      <form action={toggleUserRole.bind(null, user.id, user.role)}>
                        <button className={`text-xs font-bold px-3 py-2 rounded transition ${
                          user.role === "ADMIN" 
                            ? "bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600" 
                            : "bg-purple-600 text-white hover:bg-purple-700"
                        }`}>
                          {user.role === "ADMIN" ? "Rebaixar" : "Promover a Admin"}
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* --- SEÇÃO 2: GERENCIAR DIETAS (O QUE JÁ TÍNHAMOS) --- */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h2 className="font-bold text-lg text-slate-800">🥗 Dietas Geradas Recentemente</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
              <tr>
                <th className="p-4">Data</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Plano</th>
                <th className="p-4">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allDiets.map((diet) => (
                <tr key={diet.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 text-slate-500 text-xs">
                    {new Date(diet.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-700">
                    {diet.user.name}
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {diet.title}
                  </td>
                  <td className="p-4">
                    <form action={deleteDiet.bind(null, diet.id)}>
                      <button className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded text-xs font-bold transition">
                        Excluir
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

      </div>
    </div>
  );
}