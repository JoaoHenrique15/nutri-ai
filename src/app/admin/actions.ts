"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma"; // <--- MUDOU AQUI
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Função para verificar se é admin
async function checkAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (user?.role !== "ADMIN") {
    throw new Error("Acesso negado. Apenas administradores.");
  }
}

export async function deleteDiet(dietId: string) {
  await checkAdmin();

  await prisma.dietPlan.delete({
    where: { id: dietId },
  });

  revalidatePath("/admin");
}

export async function toggleUserRole(userId: string, currentRole: string) {
  // 1. Verifica segurança (Só admin pode fazer isso)
  await checkAdmin();

  // 2. Define o novo papel (Se é ADMIN vira USER, se é USER vira ADMIN)
  const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";

  // 3. Atualiza no banco
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  // 4. Atualiza a tela
  revalidatePath("/admin");
}