"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
      vatNumber,
      email,
      phone,
      logoUrl, // <--- Saving it here
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

export async function deleteCompany(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("ID is required to delete a company");
  }

  await prisma.company.delete({
    where: { id },
  });

  revalidatePath("/company"); // Update this path if your page is named differently (e.g. "/companies")
}