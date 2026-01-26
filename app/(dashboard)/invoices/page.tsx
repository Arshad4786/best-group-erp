import Link from "next/link";
import prisma from "@/lib/db";
import { Plus, Trash2, Pencil, Eye } from "lucide-react";
import { deleteInvoice } from "@/app/actions/invoice";

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: 'desc' },
    include: { company: true } 
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Invoice List</h1>
           <p className="text-sm text-slate-500">Manage all generated invoices</p>
        </div>
        <Link href="/invoices/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Add Invoice
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Invoice No</th>
              <th className="px-6 py-4">Business/Company</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount (SAR)</th>
              <th className="px-6 py-4">VAT (SAR)</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.length === 0 ? (
               <tr><td colSpan={6} className="p-8 text-center text-slate-400">No invoices found</td></tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 font-mono">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 text-slate-600">{inv.company?.name}</td>
                  <td className="px-6 py-4 text-slate-500">{new Date(inv.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{Number(inv.totalAmount).toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-500">{Number(inv.vatAmount).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                        <Link href={`/invoices/${inv.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-medium flex items-center gap-1">
                             Details
                        </Link>
                        <form action={deleteInvoice.bind(null, inv.id)}>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium flex items-center gap-1">
                                 Delete
                            </button>
                        </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}