"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deleteEmployee } from "@/app/actions/hr";

export default function DeleteEmployeeButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this employee? This action cannot be undone.");
    if (!confirmed) return;

    setIsDeleting(true);
    const result = await deleteEmployee(id);
    
    if (!result.success) {
      alert("Error deleting employee");
      setIsDeleting(false);
    }
    // If success, server action revalidates path, UI updates automatically
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Delete Employee"
    >
      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}