import Link from "next/link";
import prisma from "@/lib/db";
import { Plus, Printer, Pencil } from "lucide-react";
import DeleteEmployeeButton from "@/components/delete-employee-button"; // IMPORT THIS

export default async function EmployeesPage() {
  const employees = await prisma.employee.findMany({
    include: { project: true, company: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      {/* ... Header and Filters (Keep as is) ... */}
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Employees List</h1>
           <p className="text-sm text-slate-500">Find all the list of employees here</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors">
            Refresh
          </button>
          <Link 
            href="/hr/employees/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Employee
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <input placeholder="Enter employee full-name here" className="px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        <input placeholder="Enter employee id here" className="px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option>Select Project</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Employee Name</th>
              <th className="px-6 py-4">Reference Id</th>
              <th className="px-6 py-4">Border Number</th>
              <th className="px-6 py-4">Project</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.length === 0 ? (
               <tr><td colSpan={5} className="p-8 text-center text-slate-400">No employees found</td></tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 uppercase">{emp.fullName}</td>
                  <td className="px-6 py-4 text-slate-500">REF-{emp.employeeId.slice(-4)}</td>
                  <td className="px-6 py-4 text-slate-500">{emp.employeeId}</td>
                  <td className="px-6 py-4 text-slate-500">{emp.project?.name || "N/A"}</td>
                  <td className="px-6 py-4">
                    
                    <div className="flex items-center gap-2">
                      
                      {/* 1. Printer Icon */}
                      <Link 
                        href={`/hr/employees/${emp.id}`} 
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View & Print Details"
                      >
                        <Printer className="w-4 h-4" />
                      </Link>

                      {/* 2. Edit Icon (Functional) */}
                      <Link 
                        href={`/hr/employees/${emp.id}/edit`} 
                        className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Employee"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>

                      {/* 3. Delete Icon (Functional Component) */}
                      <DeleteEmployeeButton id={emp.id} />

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