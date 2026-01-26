import prisma from "@/lib/db";
import { createLabor } from "@/app/actions/labor";
import { ArrowLeft, Save, HardHat, Briefcase, User, MapPin } from "lucide-react";
import Link from "next/link";

export default async function NewLaborPage() {
  // Fetch projects to populate the "Assign to Project" dropdown
  const projects = await prisma.project.findMany({
    where: { status: "Active" },
    select: { id: true, name: true }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <Link 
          href="/labor" 
          className="inline-flex items-center gap-2 text-blue-100 hover:text-white text-sm font-medium mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to List
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <HardHat className="w-8 h-8" />
          Register New Worker
        </h1>
        <p className="text-blue-100 opacity-90 mt-2">
          Add personnel to the workforce database
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        <form action={createLabor} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Worker Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="workerName"
                  required
                  placeholder="e.g. John Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Trade / Skill */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Trade / Specialty</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select 
                  name="trade" 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none"
                >
                  <option value="General Labor">General Labor</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Mason">Mason</option>
                  <option value="Welder">Welder</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Current Status</label>
              <select 
                name="status" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="Available">Available (Bench)</option>
                <option value="Deployed">Deployed</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            {/* Assign Project */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Assign to Project</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select 
                  name="projectId" 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none"
                >
                  <option value="Unassigned">Unassigned</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center gap-2 transition-all active:scale-95"
            >
              <Save className="w-5 h-5" />
              Register Worker
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}  