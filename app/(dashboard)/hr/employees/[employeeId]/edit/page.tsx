import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import EmployeeEditForm from "@/components/employee-edit-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ employeeId: string }>;
}

export default async function EditEmployeePage({ params }: PageProps) {
  const { employeeId } = await params;

  // 1. Fetch Employee
  const employeeRaw = await prisma.employee.findUnique({
    where: { id: employeeId },
  });

  if (!employeeRaw) return notFound();

  // Convert Decimal to number for the form (Fixing basicSalary)
  const employee = {
    ...employeeRaw,
    basicSalary: employeeRaw.basicSalary ? employeeRaw.basicSalary.toNumber() : null,
  };

  // 2. Fetch Lists for Dropdowns (Companies & Projects)
  // --- THE FIX: USE 'select' to fetch ONLY id and name ---
  // This avoids fetching Decimal fields (like project value) that crash the client
  const companies = await prisma.company.findMany({ 
    orderBy: { name: 'asc' },
    select: { id: true, name: true } 
  });

  const projects = await prisma.project.findMany({ 
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link 
          href="/hr/employees" 
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Employee</h1>
          <p className="text-sm text-slate-500">Update employee details below</p>
        </div>
      </div>

      {/* FORM COMPONENT */}
      <EmployeeEditForm 
        employee={employee} 
        companies={companies} 
        projects={projects} 
      />
    </div>
  );
}