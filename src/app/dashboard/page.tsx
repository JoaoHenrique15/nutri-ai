import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma"; // Importando a conexão correta
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient"; // Importa o visual futurista!

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  // 1. Busca a dieta
  const dietPlan = await prisma.dietPlan.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  // 2. Verifica as infos do usuário (buscamos nome, role e objetivo para a UI nova)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, role: true, goal: true }
  });
  
  const isAdmin = user?.role === "ADMIN";

  if (!dietPlan) redirect("/");

  let dietData;
  try {
    dietData = JSON.parse(dietPlan.content);
  } catch (e) {
    dietData = null;
  }

  // 3. Renderiza o Client Component passando as informações
  return (
    <DashboardClient 
      user={user} 
      dietData={dietData} 
      isAdmin={isAdmin} 
    />
  );
}