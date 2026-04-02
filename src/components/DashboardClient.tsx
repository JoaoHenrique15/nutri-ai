"use client";

import { motion } from "framer-motion";
import { User, LogOut, Shield, Flame, Target, Clock, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
};

export default function DashboardClient({ user, dietData, isAdmin }: any) {
  return (
    // Note as classes "bg-slate-50 dark:bg-[#050505]" controlando as cores
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-slate-200 relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* ANIMAÇÃO DE FUNDO (Fica mais suave no tema claro) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-40 dark:opacity-100 transition-opacity duration-300">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-cyan-400 dark:bg-cyan-600 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] bg-indigo-400 dark:bg-indigo-600 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen"
        />
      </div>

      {/* HEADER */}
      <header className="relative z-10 border-b border-slate-200 dark:border-white/10 bg-white/60 dark:bg-black/20 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Zap className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-indigo-400">
              NutriAI
            </h1>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            {isAdmin && (
              <Link href="/admin" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/20 transition-all text-sm font-medium">
                <Shield className="w-4 h-4" /> Painel Admin
              </Link>
            )}
            
            <Link href="/perfil" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 transition-all text-sm font-medium shadow-sm dark:shadow-[0_0_10px_rgba(255,255,255,0.05)] text-slate-700 dark:text-slate-200">
              <User className="w-4 h-4 text-cyan-500 dark:text-cyan-400" /> <span className="hidden sm:inline">Meu Perfil</span>
            </Link>

            <Link href="/api/auth/signout" className="p-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent hover:bg-red-50 dark:hover:bg-red-500/20 text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-all shadow-sm">
              <LogOut className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <motion.div initial="hidden" animate="show" variants={containerVariants}>
          
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-indigo-400">{user?.name?.split(" ")[0] || "Visitante"}</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
              Sua matriz nutricional foi otimizada pela IA. Siga o protocolo abaixo para atingir seus objetivos com máxima eficiência.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden group shadow-sm dark:shadow-none">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 dark:from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-4 mb-2">
                <Target className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Seu Objetivo</h3>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white ml-10">{user?.goal || "Definição Muscular"}</p>
            </div>

            <div className="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden group shadow-sm dark:shadow-none">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 dark:from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-4 mb-2">
                <Flame className="w-6 h-6 text-orange-500 dark:text-orange-400" />
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Meta Diária</h3>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white ml-10">{dietData?.calories || "Calculando..."}</p>
            </div>
          </motion.div>

          {dietData?.summary && (
            <motion.div variants={itemVariants} className="mb-12 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 p-6 rounded-2xl backdrop-blur-md">
              <p className="text-indigo-800 dark:text-indigo-200 flex items-center gap-3">
                <Zap className="text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                <span className="italic">"{dietData.summary}"</span>
              </p>
            </motion.div>
          )}

          <motion.h3 variants={itemVariants} className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <CheckCircle2 className="text-cyan-600 dark:text-cyan-400" /> Protocolo Alimentar
          </motion.h3>

          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dietData?.meals?.map((meal: any, index: number) => (
              <motion.div key={index} variants={itemVariants} className="bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 backdrop-blur-md hover:border-cyan-500/30 transition-all hover:-translate-y-1 shadow-md dark:shadow-lg dark:hover:shadow-cyan-500/10 flex flex-col">
                
                <div className="flex justify-between items-start mb-6 border-b border-slate-100 dark:border-white/10 pb-4">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{meal.name}</h4>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300">
                      Refeição {index + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-full text-sm font-medium">
                    <Clock className="w-4 h-4" /> {meal.time || "Livre"}
                  </div>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {(meal.items || meal.foods)?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                      {item}
                    </li>
                  ))}
                </ul>

                {meal.macros && (
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/10">
                    <div className="text-xs font-mono text-cyan-800 dark:text-cyan-200/70 bg-cyan-50 dark:bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-200 dark:border-cyan-900/50">
                      ⚡ {meal.macros}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
}