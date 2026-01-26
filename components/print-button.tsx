"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:bg-blue-700 transition-colors print:hidden"
    >
      <Printer className="w-4 h-4" /> 
      Print Document
    </button>
  );
}