import { 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Wallet,
  Bus,
  Home,
  Utensils
} from "lucide-react";

export default function ExpenseManagement() {
  return (
    <div className="space-y-8">
      
      {/* 1. HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Expense Management</h1>
        <p className="text-slate-500 text-base">Manage project expenses by category</p>
      </div>

      {/* 2. PROJECT EXPENSE SUMMARY (Top Table) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Project Expense Summary</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-xs text-slate-500 uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Project Name</th>
                <th className="px-6 py-4">Number of Expenses</th>
                <th className="px-6 py-4 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { name: "Dubai Mall Renovation", count: 4, total: "SAR 80,000" },
                { name: "Riyadh Tower Construction", count: 4, total: "SAR 135,000" },
                { name: "Cairo Hotel Refurbishment", count: 4, total: "SAR 47,000" },
                { name: "Abu Dhabi Airport Extension", count: 0, total: "SAR 0" },
                { name: "Jeddah Port Development", count: 0, total: "SAR 0" },
              ].map((item, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5 font-medium text-slate-900">{item.name}</td>
                  <td className="px-6 py-5 text-slate-600">{item.count}</td>
                  <td className="px-6 py-5 text-right font-bold text-slate-800">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. ALL EXPENSES (Bottom Table) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header with Search and Add Button */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800">All Expenses</h2>
          <div className="flex items-center gap-3">
             <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium shadow-lg shadow-slate-200">
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-xs text-slate-500 uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Project Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { 
                  proj: "Dubai Mall Renovation", 
                  cat: "Salary", 
                  icon: Wallet,
                  color: "bg-blue-50 text-blue-700 border-blue-100",
                  amt: "SAR 45,000", 
                  desc: "Monthly salaries for 15 workers", 
                  date: "2024-01-30" 
                },
                { 
                  proj: "Dubai Mall Renovation", 
                  cat: "Accommodation", 
                  icon: Home,
                  color: "bg-emerald-50 text-emerald-700 border-emerald-100",
                  amt: "SAR 15,000", 
                  desc: "Worker accommodation for 3 months", 
                  date: "2024-01-30" 
                },
                { 
                  proj: "Dubai Mall Renovation", 
                  cat: "Food", 
                  icon: Utensils,
                  color: "bg-amber-50 text-amber-700 border-amber-100",
                  amt: "SAR 12,000", 
                  desc: "Food expenses for workers", 
                  date: "2024-01-30" 
                },
                { 
                  proj: "Dubai Mall Renovation", 
                  cat: "Transport", 
                  icon: Bus,
                  color: "bg-purple-50 text-purple-700 border-purple-100",
                  amt: "SAR 8,000", 
                  desc: "Transportation costs", 
                  date: "2024-01-30" 
                },
                 { 
                  proj: "Riyadh Tower Construction", 
                  cat: "Salary", 
                  icon: Wallet,
                  color: "bg-blue-50 text-blue-700 border-blue-100",
                  amt: "SAR 75,000", 
                  desc: "Monthly salaries for 25 workers", 
                  date: "2024-01-30" 
                },
              ].map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.proj}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${item.color}`}>
                      <item.icon className="w-3 h-3" />
                      {item.cat}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">{item.amt}</td>
                  <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{item.desc}</td>
                  <td className="px-6 py-4 text-right text-slate-500 tabular-nums">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}