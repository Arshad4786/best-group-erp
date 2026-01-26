"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createClient(formData: FormData) {
  
  const getStr = (key: string) => {
    const val = formData.get(key);
    return val && val.toString().trim() !== "" ? val.toString() : null;
  };

  const companyName = formData.get("companyName") as string;

  await prisma.client.create({
    data: {
      companyName,
      vatNumber: getStr("vatNumber"),
      contactPerson: getStr("contactPerson"),
      contactDetails: getStr("contactDetails"),
      address: getStr("address"),
    },
  });

  revalidatePath("/clients");
  redirect("/clients");
}

export async function deleteClient(id: string) {
  try {
    await prisma.client.delete({ where: { id } });
    revalidatePath("/clients");
  } catch (error) {
    console.error("Failed to delete client:", error);
  }
}

export async function updateClient(id: string, formData: FormData) {
  const getStr = (key: string) => {
    const val = formData.get(key);
    return val && val.toString().trim() !== "" ? val.toString() : null;
  };

  await prisma.client.update({
    where: { id },
    data: {
      companyName: formData.get("companyName") as string,
      vatNumber: getStr("vatNumber"),
      contactPerson: getStr("contactPerson"),
      contactDetails: getStr("contactDetails"),
      address: getStr("address"),
    },
  });

  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
  redirect("/clients");
}