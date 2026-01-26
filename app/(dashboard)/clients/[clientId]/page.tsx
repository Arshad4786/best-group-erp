import prisma from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PrintButton from "@/components/print-button";

// --- Helper Component (Standard "Shrink & Fit" Row) ---
function DetailRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="grid grid-cols-[40%_60%] sm:grid-cols-[35%_65%] w-full break-inside-avoid border-b border-slate-200">
      <div className="bg-slate-50 p-3 text-sm font-bold text-slate-700 border-r border-slate-200 flex items-center print:bg-gray-100 print:text-[10px] print:p-1 print:leading-tight">
        {label}
      </div>
      <div className="p-3 text-sm text-slate-900 font-medium border-r border-slate-200 flex items-center break-words print:text-[10px] print:p-1 print:leading-tight">
        {value || "-"}
      </div>
    </div>
  );
}

interface PageProps {
  params: Promise<{ clientId: string }>;
}

export default async function ClientDetailsPage({ params }: PageProps) {
  const { clientId } = await params;

  const client = await prisma.client.findUnique({
    where: { id: clientId },
  });

  if (!client) return notFound();

  const formatDate = (date: Date) => new Date(date).toLocaleDateString('en-GB');

  return (
    <div className="relative max-w-5xl mx-auto space-y-6 pb-12 print:p-0 print:max-w-none print:space-y-2">

      {/* --- PRINT HEADER --- */}
      <div className="h-0 overflow-hidden print:h-auto print:overflow-visible flex flex-col items-center justify-center mb-0 print:mb-4 border-b-0 print:border-b border-slate-900 pb-0 print:pb-2">
         {/* Since this is a Client, we don't have a "Company Logo" relation to show. 
             We display a standard professional title instead. */}
        <h1 className="text-xl print:text-2xl font-bold uppercase tracking-wide mb-2">
            Client Information Sheet
        </h1>
        <p className="text-sm text-slate-500">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      {/* --- SCREEN HEADER (Hidden on Print) --- */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/clients" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Client Details</h1>
            <p className="text-sm text-slate-500">View and print client information</p>
          </div>
        </div>
        
        {/* --- PRINT BUTTON --- */}
        <PrintButton />
      </div>

      {/* --- DETAILS GRID --- */}
      <div className="bg-white border-t border-l border-slate-200 shadow-sm print:shadow-none print:border-slate-300">
        
        {/* Force 2 Columns on Print */}
        <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 print:gap-x-2">
          
          {/* LEFT COLUMN */}
          <div className="flex flex-col border-r border-slate-200 print:border-r">
             <DetailRow label="Company Name" value={client.companyName} />
             <DetailRow label="VAT Number" value={client.vatNumber} />
             <DetailRow label="Contact Person" value={client.contactPerson} />
             <DetailRow label="Contact Details" value={client.contactDetails} />
             <DetailRow label="Date Added" value={formatDate(client.createdAt)} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col">
            <DetailRow label="Office Address" value={client.address} />
            {/* Placeholders for future fields so the column isn't empty */}
            <DetailRow label="Client ID" value={client.id.slice(0, 8).toUpperCase()} />
            <DetailRow label="Status" value="Active" />
            <DetailRow label="Last Updated" value={formatDate(client.updatedAt)} />
          </div>

        </div>
      </div>
      
      {/* --- FOOTER (PRINT ONLY) --- */}
      <div className="hidden print:block text-[10px] text-center text-slate-400 mt-4">
        Best Group ERP System - {new Date().toLocaleDateString()}
      </div>

    </div>
  );
}