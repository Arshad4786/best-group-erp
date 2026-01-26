"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


// 2. UPDATE ACTION (For the Edit Modal)
export async function updateProject(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const companyId = formData.get("companyId") as string; // <--- Get ID
  
  const duration = formData.get("duration") as string;
  const requiredManpower = parseInt(formData.get("requiredManpower") as string) || 0;
  const status = formData.get("status") as string;

  // Fetch company details to keep legacy "clientName" in sync
  let clientName = "Unknown";
  if (companyId) {
    const company = await prisma.company.findUnique({ where: { id: companyId }});
    if (company) clientName = company.name;
  } else {
    // Fallback if they manually typed a client name (optional, if you want to keep that logic)
    clientName = formData.get("clientName") as string; 
  }

  await prisma.project.update({
    where: { id },
    data: {
      name,
      companyId: companyId || null, // Update the relation
      clientName, // Sync the string field
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


// 1. CREATE ACTION
export async function createProject(formData: FormData) {
  const name = formData.get("name") as string;
  const companyId = formData.get("companyId") as string;
  
  // New Fields from Screenshot
  const contactPerson = formData.get("contactPerson") as string;
  const crNumber = formData.get("crNumber") as string;
  const projectLocation = formData.get("projectLocation") as string;
  const address = formData.get("address") as string;
  const vatNumber = formData.get("vatNumber") as string;
  
  // Existing Fields
  const value = parseFloat(formData.get("value") as string) || 0;
  const duration = formData.get("duration") as string;
  const requiredManpower = parseInt(formData.get("requiredManpower") as string) || 0;

  // Fetch the company name to fill the legacy "clientName" field automatically
  const selectedCompany = await prisma.company.findUnique({
    where: { id: companyId }
  });

  await prisma.project.create({
    data: {
      name,
      // Map Relation
      companyId,
      // Auto-fill legacy field for display purposes
      clientName: selectedCompany ? selectedCompany.name : "Unknown", 
      
      // New Fields
      contactPerson,
      crNumber,
      projectLocation,
      address,
      vatNumber,

      // Financials
      value,
      duration,
      requiredManpower,
      status: "Active",
    },
  });

  revalidatePath("/projects");
  redirect("/projects");
}