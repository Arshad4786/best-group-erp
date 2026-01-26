"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. CREATE
export async function createLabor(formData: FormData) {
  const workerName = formData.get("workerName") as string;
  const trade = formData.get("trade") as string;
  const status = formData.get("status") as string;
  const projectId = formData.get("projectId") as string;
  const workerId = `LAB-${Math.floor(1000 + Math.random() * 9000)}`;

  await prisma.labor.create({
    data: {
      workerName,
      workerId,
      trade,
      status,
      projectId: projectId === "Unassigned" ? null : projectId, 
    },
  });

  revalidatePath("/labor");
  redirect("/labor");
}

// 2. UPDATE (NEW)
export async function updateLabor(formData: FormData) {
  const id = formData.get("id") as string;
  const workerName = formData.get("workerName") as string;
  const trade = formData.get("trade") as string;
  const status = formData.get("status") as string;
  const projectId = formData.get("projectId") as string;

  await prisma.labor.update({
    where: { id },
    data: {
      workerName,
      trade,
      status,
      projectId: projectId === "Unassigned" ? null : projectId,
    },
  });

  revalidatePath("/labor");
}

// 3. DELETE (NEW)
export async function deleteLabor(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.labor.delete({ where: { id } });
  revalidatePath("/labor");
}