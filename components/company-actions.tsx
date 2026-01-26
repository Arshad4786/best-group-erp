"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteCompany } from "@/app/actions/company"; // We will create this later if needed, but safe to include for UI

export default function CompanyActions({ id }: { id: string }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Link 
        href={`/company/${id}/edit`}
        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
        title="Edit Company"
      >
        <Pencil className="w-4 h-4" />
      </Link>
      <button 
        onClick={() => alert("Delete functionality coming next!")} // Placeholder for now
        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete Company"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}