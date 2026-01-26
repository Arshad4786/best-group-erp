import { createProject } from "@/app/actions/project";
import { LayoutGrid, ArrowLeft, Save, Clock, Users, FolderKanban } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* HEADER BANNER (Updated to match Blue Theme) */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <Link 
          href="/projects" 
          className="inline-flex items-center gap-2 text-blue-100 hover:text-white text-sm font-medium mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FolderKanban className="w-8 h-8" />
          Initialize New Project
        </h1>
        <p className="text-blue-100 opacity-90 mt-2">
          Create a new entry in the financial ledger
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        <form action={createProject} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Project Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Project Name</label>
              <input
                name="name"
                required
                placeholder="e.g. Neom City Phase 1"
                // Added text-slate-900 to ensure text is BLACK and visible
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Client Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Client Organization</label>
              <input
                name="clientName"
                required
                placeholder="e.g. Public Investment Fund"
                // Added text-slate-900
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Contract Value */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Total Contract Value (SAR)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">SAR</span>
                <input
                  name="value"
                  type="number"
                  required
                  placeholder="0.00"
                  // Added text-slate-900
                  className="w-full pl-14 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* NEW: Duration */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Project Duration</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="duration"
                  placeholder="e.g. 18 months"
                  // Added text-slate-900
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* NEW: Required Manpower */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Required Manpower</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="requiredManpower"
                  type="number"
                  placeholder="e.g. 50"
                  // Added text-slate-900
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center gap-2 transition-all active:scale-95"
            >
              <Save className="w-5 h-5" />
              Register Project
            </button>
          </div>
        </form>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <LayoutGrid className="w-5 h-5 text-blue-500 mt-0.5" />
        <p className="text-sm text-blue-700">
          <strong>System Note:</strong> Registering will initialize the financial ledger. Duration and Manpower estimates are for planning purposes only.
        </p>
      </div>
    </div>
  );
}