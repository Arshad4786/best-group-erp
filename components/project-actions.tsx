"use client";

import { useState } from "react";
import { Pencil, Trash2, X, Save } from "lucide-react";
import { updateProject, deleteProject } from "@/app/actions/project";

interface CompanyOption {
  id: string;
  name: string;
  isMaster: boolean;
}

interface Project {
  id: string;
  name: string;
  clientName: string;
  companyId?: string | null; // Added field
  value: number;
  status: string;
  duration?: string | null;
  requiredManpower?: number | null;
  [key: string]: any; 
}

export default function ProjectActions({ 
  project, 
  companies 
}: { 
  project: Project; 
  companies: CompanyOption[]; // New Prop
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this project?")) {
      setIsDeleting(true);
      const formData = new FormData();
      formData.append("id", project.id);
      await deleteProject(formData);
      setIsDeleting(false);
    }
  }

  return (
    <>
      {/* 1. ACTION BUTTONS */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setIsEditOpen(true)}
          className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors"
          title="Edit"
        >
          <Pencil className="w-4 h-4" />
        </button>
        
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 border border-slate-200 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors disabled:opacity-50"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* 2. EDIT MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900">Edit Project</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={async (formData) => {
              await updateProject(formData);
              setIsEditOpen(false);
            }} className="p-6 space-y-4">
              
              <input type="hidden" name="id" value={project.id} />

              {/* Project Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Project Name</label>
                <input 
                  name="name"
                  defaultValue={project.name}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Company Selection Dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Company / Client</label>
                <select 
                  name="companyId"
                  defaultValue={project.companyId || ""}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="" disabled>Select Company</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.isMaster ? "(Master)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration & Manpower */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Duration</label>
                  <input 
                    name="duration"
                    defaultValue={project.duration || ""}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Manpower</label>
                  <input 
                    name="requiredManpower"
                    type="number"
                    defaultValue={project.requiredManpower || 0}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                <select 
                  name="status" 
                  defaultValue={project.status}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Planning">Planning</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Update Project
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}