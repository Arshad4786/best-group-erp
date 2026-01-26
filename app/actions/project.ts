"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. CREATE ACTION
export async function createProject(formData: FormData) {
  const name = formData.get("name") as string;
  const clientName = formData.get("clientName") as string;
  const value = parseFloat(formData.get("value") as string);
  
  // New Fields
  const duration = formData.get("duration") as string;
  const requiredManpower = parseInt(formData.get("requiredManpower") as string) || 0;

  await prisma.project.create({
    data: {
      name,
      clientName,
      value,
      duration,
      requiredManpower,
      status: "Active",
    },
  });

  revalidatePath("/projects");
  redirect("/projects");
}

// 2. UPDATE ACTION (For the Edit Modal)
export async function updateProject(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const clientName = formData.get("clientName") as string;
  const duration = formData.get("duration") as string;
  const requiredManpower = parseInt(formData.get("requiredManpower") as string) || 0;
  const status = formData.get("status") as string;

  await prisma.project.update({
    where: { id },
    data: {
      name,
      clientName,
      duration,
      requiredManpower,
      status,
    },
  });

  revalidatePath("/projects");
}

export async function deleteProject(formData: FormData) {
  const id = formData.get("id") as string;

  // 1. Delete related records first (Cascading delete manually)
  await prisma.expense.deleteMany({ where: { projectId: id } });
  await prisma.labor.deleteMany({ where: { projectId: id } });
  
  // 2. Delete the project
  await prisma.project.delete({
    where: { id },
  });

  revalidatePath("/projects");
}