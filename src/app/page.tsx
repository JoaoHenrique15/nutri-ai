import { auth, signIn, signOut } from "@/lib/auth";
import { createDietAction } from "./actions";

export default async function Home() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* LADO ESQUERDO: Visual */}
        <div className="md:w-1/2 bg-blue-600 p-10 text-white flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">NutriAI 🥗</h1>
          <p className="text-lg opacity-90 mb-6">
            Sua nutricionista pessoal com IA.
            Planos personalizados baseados no seu metabolismo.
          </p>
        </div>

        {/* LADO DIREITO: Interação */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          {!session ? (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Comece agora</h2>
              <form
                action={async () => {
                  "use server";
                  await signIn("google");
                }}
              >
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2">
                  Entrar com Google
                </button>
              </form>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  {session.user?.image && (
                    <img src={session.user.image} alt="Foto" className="w-8 h-8 rounded-full" />
                  )}
                  <span className="font-medium text-gray-700">Olá, {session.user?.name?.split(" ")[0]}</span>
                </div>
                <form action={async () => { "use server"; await signOut(); }}>
                  <button className="text-xs text-red-500 hover:underline">Sair</button>
                </form>
              </div>

              <h2 className="text-xl font-bold mb-4 text-gray-800">Gerar Nova Dieta</h2>
              
              <form action={createDietAction} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input name="height" type="number" placeholder="Altura (cm)" required className="p-3 border rounded-lg bg-gray-50" />
                  <input name="weight" type="number" placeholder="Peso (kg)" required className="p-3 border rounded-lg bg-gray-50" />
                </div>
                <input name="age" type="number" placeholder="Idade" required className="w-full p-3 border rounded-lg bg-gray-50" />
                <input name="goal" type="text" placeholder="Objetivo (ex: Perder peso)" required className="w-full p-3 border rounded-lg bg-gray-50" />
                <textarea name="restrictions" placeholder="Restrições/Alergias?" className="w-full p-3 border rounded-lg bg-gray-50 h-24"></textarea>
                
                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg">
                  ✨ Gerar Dieta com IA
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}