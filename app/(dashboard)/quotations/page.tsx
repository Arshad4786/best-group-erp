import Link from "next/link";
import prisma from "@/lib/db";
import QuotationActions from "@/components/quotation-actions"; 
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Briefcase, 
  User, 
  Calendar 
} from "lucide-react";

export default async function QuotationManagement() {
  // 1. FETCH REAL DATA
  const quotations = await prisma.quotation.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  // 2. CALCULATE STATS
  const totalQuotes = quotations.length;
  const approved = quotations.filter(q => q.status === "Approved").length;
  const pending = quotations.filter(q => q.status === "Pending").length;
  const rejected = quotations.filter(q => q.status === "Rejected").length;

  return (
    <div className="space-y-8">
      
      {/* 1. HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <FileText className="w-8 h-8 text-emerald-200" />
            Quotation Management
          </h1>
          <p className="text-emerald-100 text-base opacity-90">
            Create, track, and manage client proposals and estimates
          </p>
        </div>
        <Link 
          href="/quotations/new" 
          className="bg-white text-emerald-700 hover:bg-emerald-50 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Quotation
        </Link>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Total Quotes</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalQuotes}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Approved</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">{approved}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Pending</p>
          <h3 className="text-2xl font-bold text-amber-500 mt-1">{pending}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Rejected</p>
          <h3 className="text-2xl font-bold text-red-500 mt-1">{rejected}</h3>
        </div>
      </div>

      {/* 3. SEARCH & FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by ID, client, or project..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* 4. QUOTATION TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Quotation ID</th>
                <th className="px-6 py-4">Project & Client</th>
                <th className="px-6 py-4">Engineer</th>
                <th className="px-6 py-4">Quoted Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotations.length === 0 ? (
                 <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">No quotations found.</td>
                 </tr>
              ) : (
                quotations.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* ID */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{quote.quoteNumber}</p>
                          <p className="text-[11px] text-slate-400 font-mono uppercase">
                            {new Date(quote.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Project & Client */}
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-700">
                          {quote.project}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Briefcase className="w-3 h-3" /> {quote.quotationFor}
                        </p>
                      </div>
                    </td>

                    {/* Engineer (Fixed: Uses quotationBy now) */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-blue-100 text-blue-600">
                          {quote.quotationBy ? quote.quotationBy.charAt(0) : "U"}
                        </div>
                        <span className="text-slate-600 font-medium">{quote.quotationBy}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">
                        SAR {Number(quote.totalAmount).toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400">
                        {quote.manpower} Items
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        quote.status === "Approved" ? "bg-emerald-50 text-emerald-700" :
                        quote.status === "Rejected" ? "bg-red-50 text-red-700" :
                        "bg-amber-50 text-amber-700"
                      }`}>
                        {quote.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <QuotationActions quote={{
                        id: quote.id,
                        project: quote.project,
                        client: quote.quotationFor, // Map new field
                        engineer: quote.quotationBy,// Map new field
                        manpower: quote.manpower,
                        amount: Number(quote.totalAmount),
                        status: quote.status
                      }} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}