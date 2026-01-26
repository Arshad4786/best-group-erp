"use client";

import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { updateProject, deleteProject } from "@/app/actions/project"; // Import deleteProject

interface Project {
  id: string;
  name: string;
  clientName: string;
  value: number;
  status: string;
  duration?: string | null;          // Added to match new schema
  requiredManpower?: number | null;  // Added to match new schema
}

export default function ProjectActions({ project }: { project: Project }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      setIsDeleting(true);
      const formData = new FormData();
      formData.append("id", project.id);
      await deleteProject(formData);
      setIsDeleting(false);
    }
  }

  return (
    <>
      {/* 1. THE ACTION BUTTONS */}
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

      {/* 2. THE EDIT MODAL (Kept exactly as you designed) */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Edit Item</h3>
              <button 
                onClick={() => setIsEditOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form action={async (formData) => {
              await updateProject(formData);
              setIsEditOpen(false);
            }} className="p-6 space-y-4">
              
              <input type="hidden" name="id" value={project.id} />

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-900">Project Name</label>
                <input 
                  name="name"
                  defaultValue={project.name}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-900">Client Name</label>
                <input 
                  name="clientName"
                  defaultValue={project.clientName}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              {/* Added Duration & Manpower to Edit Form to match your new fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-900">Duration</label>
                  <input 
                    name="duration"
                    defaultValue={project.duration || ""}
                    placeholder="e.g. 6 months"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-900">Manpower</label>
                  <input 
                    name="requiredManpower"
                    type="number"
                    defaultValue={project.requiredManpower || 0}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-900">Status</label>
                <select 
                  name="status" 
                  defaultValue={project.status}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Planning">Planning</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-slate-800"
                >
                  Update Item
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}