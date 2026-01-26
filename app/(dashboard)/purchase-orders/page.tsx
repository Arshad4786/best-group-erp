import { 
  ShoppingCart, 
  Plus, 
  Pencil, 
  Trash2, 
  FileText,
  Calendar
} from "lucide-react";

export default function PurchaseOrders() {
  return (
    <div className="space-y-8">
      
      {/* 1. PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Purchase Order Management</h1>
        <p className="text-slate-500 text-base">Manage all purchase orders</p>
      </div>

      {/* 2. MAIN CARD WITH TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Card Header */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800">All Purchase Orders</h2>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium shadow-lg shadow-slate-200">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-xs text-slate-500 uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">PO Number</th>
                <th className="px-6 py-4">Project Name</th>
                <th className="px-6 py-4">Quotation ID</th>
                <th className="px-6 py-4">PO Value</th>
                <th className="px-6 py-4">Timeline</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { 
                  po: "PO001", 
                  proj: "Dubai Mall Renovation", 
                  qid: "Q001", 
                  val: "SAR 145,000", 
                  time: "3 months", 
                  status: "Active", 
                  date: "2024-01-18" 
                },
                { 
                  po: "PO002", 
                  proj: "Riyadh Tower Construction", 
                  qid: "Q002", 
                  val: "SAR 270,000", 
                  time: "6 months", 
                  status: "Active", 
                  date: "2024-01-25" 
                },
                { 
                  po: "PO003", 
                  proj: "Cairo Hotel Refurbishment", 
                  qid: "Q003", 
                  val: "SAR 92,000", 
                  time: "2 months", 
                  status: "Completed", 
                  date: "2024-02-05" 
                },
              ].map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-5 font-medium text-slate-900">{item.po}</td>
                  <td className="px-6 py-5 text-slate-600">{item.proj}</td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200">
                      <FileText className="w-3 h-3" /> {item.qid}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-bold text-slate-700">{item.val}</td>
                  <td className="px-6 py-5 text-slate-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {item.time}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                      item.status === "Active" 
                        ? "bg-green-50 text-green-700 border-green-200" 
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-slate-500">{item.date}</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Empty State / Pagination Placeholder */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500">
            <span>Showing 3 of 3 orders</span>
            <div className="flex gap-2">
              <button disabled className="px-3 py-1 border rounded bg-white opacity-50">Previous</button>
              <button disabled className="px-3 py-1 border rounded bg-white opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}