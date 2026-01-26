"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- 1. CREATE COMPANY (Unchanged) ---
export async function createCompany(formData: FormData) {
  // --- DEBUG LOGS ---
  const rawUrl = formData.get("logoUrl");
  console.log("------------------------------------------------");
  console.log("SERVER ACTION TRIGGERED");
  console.log("Form Data 'logoUrl' value:", rawUrl); 
  console.log("------------------------------------------------");

  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const type = formData.get("type") as string;
  const vatNumber = formData.get("vatNumber") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const iban = formData.get("iban") as string;
  const bankName = formData.get("bankName") as string;
  const accountName = formData.get("accountName") as string;
  const accountNumber = formData.get("accountNumber") as string;

  // Process the URL
  const logoUrlRaw = formData.get("logoUrl") as string;
  const logoUrl = logoUrlRaw && logoUrlRaw.trim() !== "" ? logoUrlRaw : null;

  // Master/Sub Logic
  let masterIdToConnect = null;
  const isMaster = type === "Master";

  if (!isMaster) {
    const master = await prisma.company.findFirst({
      where: { isMaster: true }
    });
    if (master) {
      masterIdToConnect = master.id;
    }
  }

  // Create
  await prisma.company.create({
    data: {
      name,
      location,
      isMaster,
      isActive: true, // Default to true
      vatNumber,
      email,
      phone,
      logoUrl, 
      iban,
      bankName,
      accountName,
      accountNumber,
      ...(masterIdToConnect ? { master: { connect: { id: masterIdToConnect } } } : {})
    },
  });

  revalidatePath("/company");
  redirect("/company");
}

// --- 2. UPDATE COMPANY (Unchanged) ---
export async function updateCompany(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const vatNumber = formData.get("vatNumber") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  
  // Bank Details
  const iban = formData.get("iban") as string;
  const bankName = formData.get("bankName") as string;
  const accountName = formData.get("accountName") as string;
  const accountNumber = formData.get("accountNumber") as string;

  // Process Logo
  const logoUrlRaw = formData.get("logoUrl") as string;
  const logoUrl = logoUrlRaw && logoUrlRaw.trim() !== "" ? logoUrlRaw : undefined;

  await prisma.company.update({
    where: { id },
    data: {
      name,
      location,
      vatNumber,
      email,
      phone,
      iban,
      bankName,
      accountName,
      accountNumber,
      ...(logoUrl ? { logoUrl } : {}), 
    },
  });

  revalidatePath("/company");
  return { success: true };
}

// --- 3. TOGGLE STATUS (Replaces Delete) ---
export async function toggleCompanyStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const currentStatusString = formData.get("currentStatus") as string;
  
  if (!id) return { error: "ID is required" };
  
  // Convert "true"/"false" string to boolean and flip it
  const isCurrentlyActive = currentStatusString === "true";
  const newStatus = !isCurrentlyActive; 

  // --- VALIDATION: Only run checks if we are trying to DEACTIVATE ---
  if (newStatus === false) {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            employees: true,
            projects: true, // We check projects now
            // We consciously IGNORE invoices here to allow soft-delete with history
          }
        }
      }
    });

    if (!company) return { error: "Company not found" };

    // Check 1: Employees
    if (company._count.employees > 0) {
      return { 
        error: `Cannot deactivate. There are ${company._count.employees} employees currently assigned to this company. Please reassign them first.` 
      };
    }

    // Check 2: Projects
    if (company._count.projects > 0) {
      return { 
        error: `Cannot deactivate. This company is assigned to ${company._count.projects} active projects. Please reassign or close the projects first.` 
      };
    }
  }

  // --- UPDATE STATUS ---
  await prisma.company.update({
    where: { id },
    data: { isActive: newStatus }
  });

  revalidatePath("/company");
  return { success: true };
}