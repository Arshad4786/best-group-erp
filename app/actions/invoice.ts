"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createInvoice(formData: FormData) {
  
  const projectId = formData.get("projectId") as string;
  const companyId = formData.get("companyId") as string;
  const invoiceNumber = formData.get("invoiceNumber") as string;
  const dateRaw = formData.get("date") as string;
  const startDateRaw = formData.get("startDate") as string;
  const endDateRaw = formData.get("endDate") as string;
  const contactLabel = formData.get("contactLabel") as string;
  const contactDetail = formData.get("contactDetail") as string;

  const itemsJson = formData.get("items") as string;
  const items = JSON.parse(itemsJson); 

  // --- UPDATED CALCULATION LOGIC ---
  let totalBeforeVat = 0;
  let vatAmount = 0;

  items.forEach((item: any) => {
    const lineTotal = Number(item.price) * Number(item.quantity);
    totalBeforeVat += lineTotal;
    
    // Check if item is taxable (default to true if undefined)
    if (item.isTaxable) {
      vatAmount += lineTotal * 0.15;
    }
  });

  const totalAmount = totalBeforeVat + vatAmount;
  // ----------------------------------

  await prisma.invoice.create({
    data: {
      invoiceNumber,
      projectId,
      companyId,
      date: new Date(dateRaw),
      startDate: startDateRaw ? new Date(startDateRaw) : null,
      endDate: endDateRaw ? new Date(endDateRaw) : null,
      contactLabel,
      contactDetail,
      
      totalBeforeVat,
      vatAmount,
      totalAmount,

      items: {
        create: items.map((item: any) => ({
          description: item.description,
          price: Number(item.price),
          quantity: Number(item.quantity),
          total: Number(item.price) * Number(item.quantity) // Saving line subtotal
        }))
      }
    }
  });

  revalidatePath("/invoices");
  redirect("/invoices");
}

export async function deleteInvoice(id: string) {
  try {
    await prisma.invoice.delete({ where: { id } });
    revalidatePath("/invoices");
  } catch (error) {
    console.error("Delete failed:", error);
  }
}