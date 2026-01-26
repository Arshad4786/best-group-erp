import prisma from "@/lib/db";
import InvoiceForm from "@/components/invoice-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewInvoicePage() {
  const projects = await prisma.project.findMany({ select: { id: true, name: true } });
  
  // FETCH COMPANIES (Subcompanies) INSTEAD OF CLIENTS
  const companies = await prisma.company.findMany({ select: { id: true, name: true } });
  
  const count = await prisma.invoice.count();
  const newInvoiceNumber = `BGTINV${70700 + count + 1}`;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/invoices" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add Invoice</h1>
          <p className="text-sm text-slate-500">Create a new invoice for client</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Pass companies prop */}
        <InvoiceForm projects={projects} companies={companies} newInvoiceNumber={newInvoiceNumber} />
      </div>
    </div>
  );
}