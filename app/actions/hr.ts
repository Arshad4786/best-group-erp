"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- 1. CREATE EMPLOYEE ---
export async function createEmployee(formData: FormData) {
  
  // Helper to get string or null safely
  const getStr = (key: string) => {
    const val = formData.get(key);
    return val && val.toString().trim() !== "" ? val.toString() : null;
  };

  const employeeId = formData.get("employeeId") as string;
  const fullName = formData.get("fullName") as string;

  // SAFETY CHECK: Does this Employee ID already exist?
  const existingEmployee = await prisma.employee.findUnique({
    where: { employeeId: employeeId }
  });

  if (existingEmployee) {
    throw new Error(`Employee with ID "${employeeId}" already exists. Please use a different ID.`);
  }

  const basicSalary = formData.get("basicSalary");

  await prisma.employee.create({
    data: {
      fullName,
      employeeId,
      mobileNumber: getStr("mobileNumber"),
      gender: getStr("gender"),
      nationality: getStr("nationality"),
      dateOfBirth: getStr("dateOfBirth") ? new Date(getStr("dateOfBirth")!) : null,
      
      molId: getStr("molId"),
      passportNumber: getStr("passportNumber"),
      experience: getStr("experience"),
      remarks: getStr("remarks"),
      
      companyId: getStr("companyId"),
      projectId: getStr("projectId"),
      category: getStr("category"),
      
      entryDate: getStr("entryDate") ? new Date(getStr("entryDate")!) : null,
      workShift: getStr("workShift"),
      leavePolicy: getStr("leavePolicy"),
      referenceRL: getStr("referenceRL"),
      
      accountNumber: getStr("accountNumber"),
      basicSalary: basicSalary ? parseFloat(basicSalary.toString()) : null,
    },
  });

  revalidatePath("/hr/employees");
  redirect("/hr/employees");
}

// --- 2. UPDATE EMPLOYEE ---
export async function updateEmployee(id: string, formData: FormData) {
  
  const getStr = (key: string) => {
    const val = formData.get(key);
    return val && val.toString().trim() !== "" ? val.toString() : null;
  };

  const basicSalary = formData.get("basicSalary");

  // NOTE: We intentionally DO NOT update:
  // fullName, employeeId, gender, dateOfBirth
  // This ensures they remain "Read Only" even if someone tries to hack the form.

  await prisma.employee.update({
    where: { id },
    data: {
      mobileNumber: getStr("mobileNumber"),
      nationality: getStr("nationality"),
      molId: getStr("molId"),
      passportNumber: getStr("passportNumber"),
      iqamaNumber: getStr("iqamaNumber"),
      iqamaExpiryDate: getStr("iqamaExpiryDate") ? new Date(getStr("iqamaExpiryDate")!) : null,
      experience: getStr("experience"),
      remarks: getStr("remarks"),
      
      companyId: getStr("companyId"),
      projectId: getStr("projectId"),
      category: getStr("category"),
      
      entryDate: getStr("entryDate") ? new Date(getStr("entryDate")!) : null,
      workShift: getStr("workShift"),
      leavePolicy: getStr("leavePolicy"),
      referenceRL: getStr("referenceRL"),
      
      accountNumber: getStr("accountNumber"),
      basicSalary: basicSalary ? parseFloat(basicSalary.toString()) : null,
    },
  });

  // Refresh both the list page and the specific details page
  revalidatePath("/hr/employees");
  revalidatePath(`/hr/employees/${id}`);
  
  redirect("/hr/employees");
}

// --- 3. DELETE EMPLOYEE ---
export async function deleteEmployee(id: string) {
  try {
    await prisma.employee.delete({
      where: { id },
    });
    
    revalidatePath("/hr/employees");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete employee:", error);
    return { success: false, error: "Failed to delete employee" };
  }
}