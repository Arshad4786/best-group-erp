import { createProject } from "@/app/actions/project";
import { FolderKanban, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/db";

// Force dynamic because we are fetching companies from DB
export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  // Fetch Active Sub-Companies for the dropdown
  const companies = await prisma.company.findMany({
    where: { 
      isActive: true,
      // If you ONLY want subcompanies (not master), uncomment below:
      // isMaster: false 
    },
    orderBy: { name: "asc" }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <Link 
          href="/projects" 
          className="inline-flex items-center gap-2 text-blue-100 hover:text-white text-sm font-medium mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FolderKanban className="w-8 h-8" />
          Add Project
        </h1>
      </div>

      {/* FORM MATCHING SCREENSHOT */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <form action={createProject} className="p-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex gap-1">
                   Project Name: <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex gap-1">
                   Select Company: <span className="text-red-500">*</span>
                </label>
                <select
                  name="companyId"
                  required
                  defaultValue=""
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="" disabled>Select Company</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.isMaster ? "(Master)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Project Location:</label>
                <input
                  name="projectLocation"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">VAT Number:</label>
                <input
                  name="vatNumber"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

               {/* Original Fields kept for logic */}
               <div className="pt-4 border-t border-slate-100 mt-4">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-3">Internal Details</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Contract Value (SAR)</label>
                        <input name="value" type="number" step="0.01" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Manpower</label>
                        <input name="requiredManpower" type="number" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900" />
                    </div>
                  </div>
               </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Contact Person:</label>
                <input
                  name="contactPerson"
                  placeholder="Enter contact person name"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">CR Number:</label>
                <input
                  name="crNumber"
                  placeholder="Enter CR Number here"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Address:</label>
                <textarea
                  name="address"
                  rows={4}
                  placeholder="Enter Office Address"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
              
               <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Duration:</label>
                 <input
                  name="duration"
                   placeholder="e.g. 12 Months"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

            </div>

          </div>

          <div className="pt-8 mt-6 border-t border-slate-100">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-blue-200 flex items-center gap-2 transition-all active:scale-95"
            >
              <Save className="w-5 h-5" />
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}