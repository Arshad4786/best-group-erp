"use client";

import { useState } from "react";
import { Pencil, Trash2, X, Save } from "lucide-react";
import { updateLabor, deleteLabor } from "@/app/actions/labor";

interface Project {
  id: string;
  name: string;
}

interface Labor {
  id: string;
  workerName: string;
  trade: string;
  status: string;
  projectId: string | null;
}

export default function LaborActions({ worker, projects }: { worker: Labor, projects: Project[] }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (confirm("Are you sure you want to remove this worker?")) {
      setIsDeleting(true);
      const formData = new FormData();
      formData.append("id", worker.id);
      await deleteLabor(formData);
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <button 
          onClick={() => setIsEditOpen(true)}
          className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors"
          title="Edit Worker"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          title="Remove Worker"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* EDIT MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">Edit Worker Details</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={async (formData) => {
              await updateLabor(formData);
              setIsEditOpen(false);
            }} className="p-6 space-y-4">
              
              <input type="hidden" name="id" value={worker.id} />

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                <input 
                  name="workerName"
                  defaultValue={worker.workerName}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Trade</label>
                <select 
                  name="trade" 
                  defaultValue={worker.trade}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white"
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                  <select 
                    name="status" 
                    defaultValue={worker.status}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="Available">Available</option>
                    <option value="Deployed">Deployed</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Project</label>
                  <select 
                    name="projectId" 
                    defaultValue={worker.projectId || "Unassigned"}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="Unassigned">Unassigned</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-50">
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
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}