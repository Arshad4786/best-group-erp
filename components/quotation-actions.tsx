"use client";

import { useState } from "react";
import { Pencil, Trash2, X, Save, Printer } from "lucide-react"; // Added Printer
import { updateQuotation, deleteQuotation } from "@/app/actions/quotation";

interface Quotation {
  id: string;
  project: string;
  client: string;
  engineer: string;
  manpower: number;
  amount: number;
  status: string;
}

export default function QuotationActions({ quote }: { quote: Quotation }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle Delete with Confirmation
  async function handleDelete() {
    if (confirm("Are you sure you want to delete this quotation?")) {
      setIsDeleting(true);
      const formData = new FormData();
      formData.append("id", quote.id);
      await deleteQuotation(formData);
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        
        {/* 1. PRINT BUTTON (NEW) */}
        <a 
          href={`/quotations/${quote.id}/print`} 
          target="_blank"
          className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors"
          title="Print Document"
        >
          <Printer className="w-4 h-4" />
        </a>

        {/* 2. EDIT BUTTON */}
        <button 
          onClick={() => setIsEditOpen(true)}
          className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors"
          title="Edit Quotation"
        >
          <Pencil className="w-4 h-4" />
        </button>

        {/* 3. DELETE BUTTON */}
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          title="Delete Quotation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* 4. EDIT MODAL (Unchanged) */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">Edit Quotation</h3>
              <button 
                onClick={() => setIsEditOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={async (formData) => {
              await updateQuotation(formData);
              setIsEditOpen(false);
            }} className="p-6 space-y-4">
              
              <input type="hidden" name="id" value={quote.id} />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Project</label>
                  <input 
                    name="project"
                    defaultValue={quote.project}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Client</label>
                  <input 
                    name="client"
                    defaultValue={quote.client}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Lead Engineer</label>
                <select 
                  name="engineer" 
                  defaultValue={quote.engineer}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="Ahmed Al-Farsi">Ahmed Al-Farsi</option>
                  <option value="Sarah Johnson">Sarah Johnson</option>
                  <option value="Michael Davis">Michael Davis</option>
                  <option value="John Smith">John Smith</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Manpower</label>
                  <input 
                    name="manpower"
                    type="number"
                    defaultValue={quote.manpower}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Amount (SAR)</label>
                  <input 
                    name="amount"
                    type="number"
                    defaultValue={quote.amount}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                <select 
                  name="status" 
                  defaultValue={quote.status}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
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