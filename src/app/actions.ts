"use server";

import { auth } from "@/lib/auth";
import { generateNutritionPlan } from "@/lib/ai-consultant";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function createDietAction(formData: FormData) {
  // 1. Verifica login
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Você precisa estar logado.");
  }

  // 2. Pega dados do formulário
  const userData = {
    height: Number(formData.get("height")),
    weight: Number(formData.get("weight")),
    age: Number(formData.get("age")),
    goal: formData.get("goal") as string,
    restrictions: formData.get("restrictions") as string,
  };

  console.log("🚀 Iniciando geração de dieta para:", userData.goal);

  // 3. Atualiza perfil do usuário
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      height: userData.height,
      weight: userData.weight,
      age: userData.age,
      goal: userData.goal,
      restrictions: userData.restrictions,
    },
  });

  // 4. Chama o Gemini (Pode demorar uns 10-15s)
  const dietJson = await generateNutritionPlan(userData);

  // 5. Salva no banco
  await prisma.dietPlan.create({
    data: {
      userId: session.user.id,
      title: `Plano: ${userData.goal}`,
      content: JSON.stringify(dietJson),
    },
  });

  // 6. Redireciona
  redirect("/dashboard");
}