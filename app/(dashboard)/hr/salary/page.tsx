import Link from "next/link";
import prisma from "@/lib/db";
import { Plus, Search, Trash2, Printer } from "lucide-react"; // Added Printer
import { deleteSalary } from "@/app/actions/salary";

export default async function SalaryPage() {
  // FETCH REAL DATA
  const salaries = await prisma.salary.findMany({
    include: { employee: true },
    orderBy: { date: 'desc' }
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Salaries</h1>
           <p className="text-sm text-slate-500">Find all the list of salaries here</p>
        </div>
        <Link 
          href="/hr/salary/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Salary
        </Link>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
            <label className="text-sm font-medium text-slate-600">Enter Employee Name:</label>
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    placeholder="Enter employee full-name here" 
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                />
            </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Employee Name</th>
              <th className="px-6 py-4">Invoice Date</th>
              <th className="px-6 py-4">Basic Salary</th>
              <th className="px-6 py-4">Total Amount</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {salaries.length === 0 ? (
               <tr><td colSpan={5} className="p-8 text-center text-slate-400">No salary records found</td></tr>
            ) : (
              salaries.map((salary) => (
                <tr key={salary.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 uppercase">{salary.employee?.fullName}</td>
                  {/* Format Date */}
                  <td className="px-6 py-4 text-slate-500">{new Date(salary.date).toLocaleDateString()}</td>
                  {/* Format Decimals to Numbers */}
                  <td className="px-6 py-4 text-slate-500">{Number(salary.basicSalary).toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{Number(salary.totalAmount).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        
                        {/* 1. PRINT BUTTON (Replaces "Details") */}
                        <Link 
                            href={`/hr/salary/${salary.id}`}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View & Print Slip"
                        >
                            <Printer className="w-4 h-4" />
                        </Link>
                        
                        {/* 2. DELETE BUTTON */}
                        <form action={deleteSalary.bind(null, salary.id)}>
                            <button 
                                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Record"
                            >
                                <Trash2 className="w-4 h-4" /> 
                            </button>
                        </form>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}