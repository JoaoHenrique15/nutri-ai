import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User as UserIcon, Activity, Ruler, Weight, ShieldCheck } from "lucide-react";

export default async function PerfilPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  // Busca os dados do usuário no banco
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) redirect("/");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-slate-200 transition-colors duration-300">
      
      {/* Header simplificado para o Perfil */}
      <header className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" /> Voltar ao Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
          
          {/* Cabeçalho do Perfil */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-10 pb-10 border-b border-slate-100 dark:border-white/10">
            {user.image ? (
              <img src={user.image} alt="Foto de Perfil" className="w-24 h-24 rounded-full border-4 border-cyan-100 dark:border-cyan-500/30" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 border-4 border-cyan-200 dark:border-cyan-500/30">
                <UserIcon className="w-10 h-10" />
              </div>
            )}
            
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{user.name}</h1>
              <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
              {user.role === "ADMIN" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 mt-3 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" /> Administrador
                </span>
              )}
            </div>
          </div>

          {/* Dados Físicos */}
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Suas Informações Corporais</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 p-5 rounded-2xl flex flex-col items-center text-center">
              <Weight className="w-8 h-8 text-cyan-500 mb-3" />
              <span className="text-sm text-slate-500 dark:text-slate-400 mb-1">Peso Atual</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">{user.weight ? `${user.weight} kg` : "Não informado"}</span>
            </div>

            <div className="bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 p-5 rounded-2xl flex flex-col items-center text-center">
              <Ruler className="w-8 h-8 text-cyan-500 mb-3" />
              <span className="text-sm text-slate-500 dark:text-slate-400 mb-1">Altura</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">{user.height ? `${user.height} cm` : "Não informada"}</span>
            </div>

            <div className="bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 p-5 rounded-2xl flex flex-col items-center text-center">
              <Activity className="w-8 h-8 text-cyan-500 mb-3" />
              <span className="text-sm text-slate-500 dark:text-slate-400 mb-1">Objetivo</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">{user.goal || "Não definido"}</span>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}