import Link from "next/link";
import prisma from "@/lib/db";
import LaborActions from "@/components/labor-actions"; 
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MapPin, 
  HardHat, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

export default async function LaborManagement() {
  // 1. FETCH REAL LABOR DATA
  const laborList = await prisma.labor.findMany({
    include: {
      project: true 
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // 2. FETCH PROJECTS (For the Edit Dropdown)
  const projects = await prisma.project.findMany({
    where: { status: "Active" },
    select: { id: true, name: true }
  });

  // 3. CALCULATE REAL STATS
  const totalLabor = laborList.length;
  const deployed = laborList.filter(l => l.status === "Deployed").length;
  const available = laborList.filter(l => l.status === "Available").length;
  const onLeave = laborList.filter(l => l.status === "On Leave").length;

  // Helper to calculate percentage for progress bars
  const getPercent = (val: number) => totalLabor > 0 ? (val / totalLabor) * 100 : 0;

  return (
    <div className="space-y-8">
      
      {/* 1. HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            Labor Management
          </h1>
          <p className="text-slate-300 text-base opacity-90">
            Track workforce deployment, status, and manpower solutions
          </p>
        </div>
        <Link 
          href="/labor/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add Worker
        </Link>
      </div>

      {/* 2. LABOR STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Total Labor</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalLabor}</h3>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-full"></div>
          </div>
        </div>
        {/* Deployed Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Deployed</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">{deployed}</h3>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${getPercent(deployed)}%` }}></div>
          </div>
        </div>
        {/* Available Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Available</p>
          <h3 className="text-2xl font-bold text-blue-600 mt-1">{available}</h3>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${getPercent(available)}%` }}></div>
          </div>
        </div>
        {/* On Leave Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">On Leave</p>
          <h3 className="text-2xl font-bold text-orange-500 mt-1">{onLeave}</h3>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500" style={{ width: `${getPercent(onLeave)}%` }}></div>
          </div>
        </div>
      </div>

      {/* 3. SEARCH & FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 text-black">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by worker name, ID, or project..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* 4. LABOR TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Worker Details</th>
                <th className="px-6 py-4">Trade / Category</th>
                <th className="px-6 py-4">Current Project</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Added Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {laborList.length === 0 ? (
                 <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">No workers found in database.</td>
                 </tr>
              ) : (
                laborList.map((worker) => (
                  <tr key={worker.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Worker Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
                          <HardHat className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{worker.workerName}</p>
                          <p className="text-[11px] text-slate-400 font-mono uppercase">{worker.workerId}</p>
                        </div>
                      </div>
                    </td>

                    {/* Trade */}
                    <td className="px-6 py-4">
                      <span className="text-slate-600 font-medium">{worker.trade}</span>
                    </td>

                    {/* Project */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {worker.project ? worker.project.name : "Unassigned"}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        worker.status === "Deployed" ? "bg-emerald-50 text-emerald-700" :
                        worker.status === "On Leave" ? "bg-orange-50 text-orange-700" :
                        "bg-blue-50 text-blue-700"
                      }`}>
                        {worker.status === "Deployed" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {worker.status === "On Leave" && <AlertCircle className="w-3 h-3 mr-1" />}
                        {worker.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                      {new Date(worker.createdAt).toLocaleDateString()}
                    </td>

                    {/* ACTIONS (Fixed to handle serialization) */}
                    <td className="px-6 py-4 text-right">
                      <LaborActions 
                        // Serialize the worker data to plain objects
                        worker={{
                          ...worker,
                          createdAt: worker.createdAt.toISOString(), // Convert Date to string
                          // Convert any Decimal types in the related project (if any) to numbers or remove them if unused by the component
                          project: worker.project ? {
                             ...worker.project,
                             value: Number(worker.project.value),
                             createdAt: worker.project.createdAt.toISOString()
                          } : null,
                          // Convert the worker's own decimals if any (none in this schema, but good practice)
                        }} 
                        projects={projects} 
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}