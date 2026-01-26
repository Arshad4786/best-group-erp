import Link from "next/link";
import prisma from "@/lib/db";
import { Plus, Search, Trash2, Pencil, Eye,Printer } from "lucide-react";
import { deleteClient } from "@/app/actions/client";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Client List</h1>
           <p className="text-sm text-slate-500">Manage your business clients and partners</p>
        </div>
        <Link 
          href="/clients/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Client
        </Link>
      </div>

      {/* FILTER */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
            <label className="text-sm font-medium text-slate-600">Filter by Company Name:</label>
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    placeholder="Enter company name here..." 
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                />
            </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Company Name</th>
              <th className="px-6 py-4">VAT Number</th>
              <th className="px-6 py-4">Contact Details</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clients.length === 0 ? (
               <tr><td colSpan={4} className="p-8 text-center text-slate-400">No clients found</td></tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{client.companyName}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono">{client.vatNumber || "-"}</td>
                  <td className="px-6 py-4 text-slate-500">
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-700">{client.contactPerson}</span>
                        <span className="text-xs">{client.contactDetails}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* VIEW (Placeholder Link) */}
                        <Link href={`/clients/${client.id}`} className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-medium flex items-center gap-1">
                             <Eye className="w-4 h-4" />
                        </Link>
                        {/* EDIT (Placeholder Link) */}
                        <Link href={`/clients/${client.id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-medium flex items-center gap-1">
                             Edit
                        </Link>
                        
                        {/* DELETE */}
                        <form action={deleteClient.bind(null, client.id)}>
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