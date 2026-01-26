import prisma from "@/lib/db"; 
import { 
  Folder, 
  FileText, 
  Building2, 
  Users,
  Briefcase
} from "lucide-react";

export default async function Dashboard() {
  
  // 1. DATA FETCHING (Parallel Fetching for Speed)
  const [
    clientCount,
    projectCount,
    invoiceCount,
    employeeCount,
    recentProjects,
    recentEmployees
  ] = await Promise.all([
    prisma.client.count(),
    prisma.project.count(),
    prisma.invoice.count(),
    prisma.employee.count(),
    prisma.project.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { client: true }
    }),
    prisma.employee.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { 
        id: true, 
        fullName: true, 
        category: true, // Designation/Role
        employeeId: true 
      }
    })
  ]);

  // Helper to determine status color
  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'active') return 'bg-emerald-50 text-emerald-700 border-emerald-200'; // Green
    if (s === 'planning') return 'bg-amber-50 text-amber-700 border-amber-200';     // Orange/Amber
    if (s === 'completed') return 'bg-blue-50 text-blue-700 border-blue-200';       // Blue
    return 'bg-slate-100 text-slate-600 border-slate-200';                          // Default Gray
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Overview Dashboard</h1>
        <p className="text-slate-300 text-base opacity-90">
          Welcome back. Here is the latest data from your ERP system.
        </p>
      </div>

      {/* 2. STATS CARDS (Counts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Clients Count */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Clients</p>
              <h3 className="text-3xl font-bold text-slate-900">{clientCount}</h3>
              <p className="text-emerald-600 text-xs mt-2 font-medium bg-emerald-50 px-2 py-1 rounded-full w-fit">
                 Active Partners
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Projects Count */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Projects</p>
              <h3 className="text-3xl font-bold text-slate-900">{projectCount}</h3>
              <p className="text-blue-600 text-xs mt-2 font-medium bg-blue-50 px-2 py-1 rounded-full w-fit">
                 In Progress & Done
              </p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Folder className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Invoices Count */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Invoices</p>
              <h3 className="text-3xl font-bold text-slate-900">{invoiceCount}</h3>
              <p className="text-orange-600 text-xs mt-2 font-medium bg-orange-50 px-2 py-1 rounded-full w-fit">
                 Generated Records
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Employees Count */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Employees</p>
              <h3 className="text-3xl font-bold text-slate-900">{employeeCount}</h3>
              <p className="text-purple-600 text-xs mt-2 font-medium bg-purple-50 px-2 py-1 rounded-full w-fit">
                 Active Workforce
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

      </div>

      {/* 3. DATA TABLES */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Recent Employees Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" /> Recently Added Employees
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Role/Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentEmployees.length === 0 ? (
                    <tr><td colSpan={3} className="p-6 text-center text-slate-400">No employees found</td></tr>
                ) : (
                    recentEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-700">{emp.fullName}</td>
                        <td className="px-6 py-4 font-mono text-slate-500 text-xs">{emp.employeeId}</td>
                        <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">
                            {emp.category || "General"}
                        </span>
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Projects Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-500" /> Recent Projects
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Project Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Client</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentProjects.length === 0 ? (
                    <tr><td colSpan={3} className="p-6 text-center text-slate-400">No projects found</td></tr>
                ) : (
                    recentProjects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-700">{proj.name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(proj.status)}`}>
                            {proj.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs">
                           {proj.client ? proj.client.companyName : "Internal"}
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}