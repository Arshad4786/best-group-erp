import prisma from "@/lib/db";
import SalaryForm from "@/components/salary-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewSalaryPage() {
  // 1. Fetch raw data
  const employeesRaw = await prisma.employee.findMany({
    select: { id: true, fullName: true, basicSalary: true },
    orderBy: { fullName: 'asc' }
  });

  // 2. CONVERT DECIMAL TO NUMBER (The Fix)
  // We map over the list and convert 'basicSalary' to a plain number
  const employees = employeesRaw.map(emp => ({
    ...emp,
    basicSalary: emp.basicSalary ? Number(emp.basicSalary) : 0
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link 
          href="/hr/salary" 
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add Salary</h1>
          <p className="text-sm text-slate-500">Calculate and save employee monthly salary</p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Now passing plain numbers, so no error */}
        <SalaryForm employees={employees} />
      </div>
    </div>
  );
}