import { 
  Banknote, 
  Plus, 
  UserCheck, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  Search, 
  ExternalLink,
  Percent
} from "lucide-react";

export default function CommissionManagement() {
  return (
    <div className="space-y-8">
      
      {/* 1. HEADER BANNER */}
      <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center">
            <Banknote className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Commission Management</h1>
            <p className="text-slate-500 text-sm">Track and approve payouts for project agents</p>
          </div>
        </div>
        <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-bold text-sm shadow-xl shadow-slate-200">
          <Plus className="w-4 h-4" /> Add Commission
        </button>
      </div>

      {/* 2. COMMISSION KPI DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Owed", val: "SAR 11,210", icon: Wallet, color: "text-slate-600", bg: "bg-slate-50" },
          { label: "Paid to Date", val: "SAR 3,860", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Pending Approval", val: "SAR 7,350", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Active Agents", val: "12", icon: UserCheck, color: "text-blue-600", bg: "bg-blue-50" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group hover:border-blue-200 transition-all">
            <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center mb-4`}>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{kpi.label}</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">{kpi.val}</h3>
          </div>
        ))}
      </div>

      {/* 3. COMMISSION CALCULATION LOGIC (Visual Note for Boss) */}
      <div className="bg-blue-600 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-blue-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold">Standard Formula Applied</h4>
            <p className="text-blue-100 text-xs">Commissions are calculated as a percentage of Total Project Value.</p>
          </div>
        </div>
        <div className="text-sm font-mono bg-blue-700/50 px-4 py-2 rounded-lg border border-blue-400/30">
          Commission = Project Value × % Rate
        </div>
      </div>

      {/* 4. COMMISSION TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search agent or project..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-400 font-bold uppercase text-[10px] tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-5">Agent Name</th>
                <th className="px-6 py-5">Linked Project</th>
                <th className="px-6 py-5 text-center">Rate</th>
                <th className="px-6 py-5">Comm. Amount</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { agent: "Agent Ahmed", proj: "Dubai Mall Reno", val: "SAR 130,000", rate: "2%", amt: "SAR 2,600", status: "Paid" },
                { agent: "Agent Fatima", proj: "Riyadh Tower", val: "SAR 245,000", rate: "3%", amt: "SAR 7,350", status: "Pending" },
                { agent: "Agent John", proj: "Cairo Hotel", val: "SAR 84,000", rate: "1.5%", amt: "SAR 1,260", status: "Paid" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        {row.agent.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-bold text-slate-900">{row.agent}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-slate-600 font-medium">{row.proj}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Value: {row.val}</p>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-black text-slate-600">{row.rate}</span>
                  </td>
                  <td className="px-6 py-6 font-black text-slate-900">
                    {row.amt}
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                      row.status === "Paid" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}