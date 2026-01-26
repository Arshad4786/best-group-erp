import prisma from "@/lib/db";
import Link from "next/link";
import ProjectActions from "@/components/project-actions"; 
import { 
  FolderKanban, 
  Plus, 
  Target, 
  Clock,
  CheckCircle2,
  Briefcase
} from "lucide-react";

export default async function ProjectManagement() {
  // 1. FETCH DATA
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  // 2. KPI CALCULATIONS
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === "Active").length;
  const completedProjects = projects.filter(p => p.status === "Completed").length;
  const onTargetPercentage = "94%";

  return (
    <div className="space-y-8">

      {/* 1. HEADER BANNER (RESTORED: Your Exact Blue/Indigo Theme) */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <FolderKanban className="w-8 h-8" />
            Project Management
          </h1>
          <p className="text-blue-100 opacity-90">
            Track lifecycle and delivery of active contracts
          </p>
        </div>

        <Link
          href="/projects/new"
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm transition border border-white/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* 2. KPI OVERVIEW (RESTORED: Your Exact Colored Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Projects", val: totalProjects, icon: FolderKanban, bg: "bg-blue-500" },
          { label: "In Progress", val: activeProjects, icon: Clock, bg: "bg-amber-500" },
          { label: "Completed", val: completedProjects, icon: CheckCircle2, bg: "bg-emerald-500" },
          { label: "On Target", val: onTargetPercentage, icon: Target, bg: "bg-indigo-500" },
        ].map((kpi, i) => (
          <div
            key={i}
            className={`${kpi.bg} rounded-xl p-6 text-white shadow-lg relative overflow-hidden`}
          >
            <div className="relative z-10">
              <p className="text-white/80 text-sm font-medium mb-1">
                {kpi.label}
              </p>
              <h3 className="text-3xl font-bold">{kpi.val}</h3>
            </div>
            <div className="absolute right-4 bottom-4 p-2 bg-white/20 rounded-lg">
              <kpi.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. PROJECT TABLE (UPDATED: Columns match your Screenshot Requirement) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Table Title Bar */}
        <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-blue-600" />
            Active Project Portfolio
          </h3>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer">
              Filter
            </span>
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer">
              Sort
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {projects.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              No projects found. Create one to get started!
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Project Name</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Engineer</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Manpower</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-slate-50/50 transition">
                    
                    {/* Project Name */}
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {proj.name}
                    </td>

                    {/* Client */}
                    <td className="px-6 py-4 text-slate-600">
                      {proj.clientName}
                    </td>

                    {/* Engineer */}
                    <td className="px-6 py-4 text-slate-600">
                      engineer-1
                    </td>

                    {/* Duration (New Column) */}
                    <td className="px-6 py-4 text-slate-600">
                      {proj.duration || "N/A"}
                    </td>

                    {/* Manpower (New Column) */}
                    <td className="px-6 py-4 text-slate-600">
                      {proj.requiredManpower}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                       <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                         proj.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 
                         proj.status === 'Completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                         'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {proj.status}
                      </span>
                    </td>

                    {/* ACTIONS: Your Custom Component */}
                    <td className="px-6 py-4 text-center">
                      <ProjectActions 
                        project={{
                          ...proj,
                          value: Number(proj.value)
                        }} 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}