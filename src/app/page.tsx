import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Leaf, Sparkles, Activity, ArrowRight } from "lucide-react";

export default async function Home() {
  const session = await auth();

  // Se o usuário já estiver logado, manda direto para o dashboard
  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-green-200">
      {/* HEADER / NAVBAR */}
      <header className="absolute top-0 w-full p-6 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
        <div className="flex items-center gap-2 text-green-600 font-bold text-xl tracking-tight">
          <Leaf className="w-6 h-6" />
          Nutri AI
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center text-center min-h-screen justify-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" />
          <span>Inteligência Artificial para sua saúde</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 max-w-4xl">
          Sua dieta ideal, criada em <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">segundos.</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl">
          Esqueça as dietas genéricas. Nossa IA analisa seu perfil, seus objetivos e restrições para montar um plano alimentar perfeito e 100% focado em você.
        </p>

        {/* BOTÃO DE LOGIN / CADASTRO */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <form
            action={async () => {
              "use server";
              // Chama o provedor do Google configurado no seu auth.ts
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full text-lg font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Começar agora / Entrar
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* FEATURES (BENEFÍCIOS) */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 text-left border-t border-slate-200 pt-16">
          <div className="flex flex-col gap-3">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-2">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">100% Personalizado</h3>
            <p className="text-slate-600">Dietas baseadas no seu peso, altura, idade e objetivos reais.</p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-2">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Cálculo de Macros</h3>
            <p className="text-slate-600">Saiba exatamente a quantidade de carboidratos, proteínas e gorduras.</p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-2">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Ajustes Instantâneos</h3>
            <p className="text-slate-600">Não gostou de um alimento? Peça para a IA trocar em um clique.</p>
          </div>
        </div>

      </main>
    </div>
  );
}