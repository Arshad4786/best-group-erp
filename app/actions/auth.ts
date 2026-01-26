"use server";

import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.password !== password) {
    // In a real app, return an error state
    throw new Error("Invalid credentials");
  }

  // Set a simple cookie to remember the user
  // Format: "ID|ROLE|NAME"
  const sessionData = `${user.id}|${user.role}|${user.name}`;
  
  (await cookies()).set("session", sessionData, { 
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 // 1 day
  });

  if (user.role === "ADMIN") {
    redirect("/"); // Admin goes to main dashboard
  } else {
    redirect("/engineer"); // Engineer goes to their dashboard
  }
}

export async function logout() {
  (await cookies()).delete("session");
  redirect("/login");
}