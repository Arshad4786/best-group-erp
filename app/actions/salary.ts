"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSalary(formData: FormData) {
  
  // Helper to parse numbers safely
  const getNum = (key: string) => {
    const val = formData.get(key);
    return val ? parseFloat(val.toString()) : 0;
  };

  const employeeId = formData.get("employeeId") as string;
  const dateRaw = formData.get("date") as string;
  
  // Recalculate Total on Server for security (or just trust the client)
  // Let's grab the values submitted
  const basicSalary = getNum("basicSalary");
  const workingDays = getNum("workingDays");
  const overtimeHours = getNum("overtimeHours");
  const overtimeRate = getNum("overtimeRate");
  const advance = getNum("advance");
  const deductions = getNum("deductions");

  // Formula: (Basic / 30 * Days) + (OT * Rate) - Advance - Deductions
  const perDay = basicSalary / 30;
  const salaryForDays = perDay * workingDays;
  const otAmount = overtimeHours * overtimeRate;
  const totalAmount = salaryForDays + otAmount - advance - deductions;

  await prisma.salary.create({
    data: {
      employeeId,
      date: new Date(dateRaw),
      workingDays, // Int
      overtimeHours, // Int
      overtimeRate,
      advance,
      deductions,
      basicSalary,
      totalAmount,
    },
  });

  revalidatePath("/hr/salary");
  redirect("/hr/salary");
}

export async function deleteSalary(id: string) {
  try {
    await prisma.salary.delete({ where: { id } });
    revalidatePath("/hr/salary");
  } catch (error) {
    console.error("Delete failed:", error);
  }
}