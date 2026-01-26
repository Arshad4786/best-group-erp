import QuotationForm from "@/components/quotation-form"; // Import the form
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

export default function NewQuotationPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* HEADER BANNER (Exact UI from your request) */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <Link 
          href="/quotations" 
          className="inline-flex items-center gap-2 text-blue-100 hover:text-white text-sm font-medium mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to List
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FileText className="w-8 h-8" />
          Create New Quotation
        </h1>
        <p className="text-blue-100 opacity-90 mt-2">
          Fill in the details below to generate a formal proposal document
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Render the Client Component Form here */}
        <QuotationForm />
      </div>

    </div>
  );
}