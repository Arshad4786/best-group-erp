"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- 1. NEW CREATE FUNCTION (For the new form) ---
interface QuotationItemData {
  description: string;
  rate: number;
}

export async function createQuotationV2(data: {
  quotationFor: string;
  attention: string;
  location: string;
  issueDate: Date;
  project: string;
  workingHours: string;
  specialArticle: string;
  rateType: string;
  firstParty: string;
  duration: string;
  invoiceDays: string;
  quotationBy: string;
  contactNo: string;
  contactEmail: string;
  items: QuotationItemData[];
}) {
  const quoteNumber = `Q-${Date.now().toString().slice(-6)}`;

  // Calculate generic totals for the dashboard
  const manpower = data.items.length; 
  const totalAmount = data.items.reduce((sum, item) => sum + item.rate, 0);

  const newQuote = await prisma.quotation.create({
    data: {
      quoteNumber,
      quotationFor: data.quotationFor,
      attention: data.attention,
      location: data.location,
      issueDate: data.issueDate,
      project: data.project,
      workingHours: data.workingHours,
      specialArticle: data.specialArticle,
      rateType: data.rateType,
      firstParty: data.firstParty,
      duration: data.duration,
      invoiceDays: data.invoiceDays,
      quotationBy: data.quotationBy,
      contactNo: data.contactNo,
      contactEmail: data.contactEmail,
      manpower,
      totalAmount,
      status: "Pending",
      items: {
        create: data.items.map(item => ({
          description: item.description,
          rate: item.rate
        }))
      }
    },
  });

  revalidatePath("/quotations");
  return newQuote.id;
}

// --- 2. UPDATE FUNCTION (Restored & Mapped to New Schema) ---
export async function updateQuotation(formData: FormData) {
  const id = formData.get("id") as string;
  
  // Extract values from the Edit Modal
  const project = formData.get("project") as string;
  const client = formData.get("client") as string;       // Maps to 'quotationFor'
  const engineer = formData.get("engineer") as string;   // Maps to 'quotationBy'
  const status = formData.get("status") as string;
  
  // Handle numbers safely
  const manpower = parseInt(formData.get("manpower") as string) || 0;
  const amount = parseFloat(formData.get("amount") as string) || 0; // Maps to 'totalAmount'

  await prisma.quotation.update({
    where: { id },
    data: {
      project,
      quotationFor: client, // Map legacy form field to new DB field
      quotationBy: engineer,// Map legacy form field to new DB field
      manpower,
      totalAmount: amount,  // Map legacy form field to new DB field
      status,
    },
  });

  revalidatePath("/quotations");
}

// --- 3. DELETE FUNCTION ---
export async function deleteQuotation(formData: FormData) {
  const id = formData.get("id") as string;
  
  await prisma.quotation.delete({
    where: { id }
  });

  revalidatePath("/quotations");
}