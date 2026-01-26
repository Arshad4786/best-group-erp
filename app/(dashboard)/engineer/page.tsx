import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { 
  FolderKanban, 
  FileText, 
  ShoppingCart, 
  LogOut,
  UserCircle
} from "lucide-react";
import { logout } from "@/app/actions/auth";

export default async function EngineerDashboard() {
  // 1. GET SESSION
  const session = (await cookies()).get("session")?.value;
  if (!session) redirect("/login");

  const [userId, role, userName] = session.split("|");

  if (role !== "ENGINEER") {
    // If Admin tries to access, maybe redirect to main, but for now let's allow viewing
    // or you can: redirect("/"); 
  }

  // 2. FETCH DATA FILTERED BY THIS ENGINEER'S NAME
  // We match the "Assigned Engineer" field in your projects to the User Name
  const myProjects = await prisma.project.findMany({
    // We assume your Project table has 'assignedEngineer' or you filter by name logic
    // For now, let's fetch all and filter in JS if schema isn't strict, 
    // OR ideally: where: { assignedEngineer: userName }
    orderBy: { createdAt: 'desc' }
  });

  // Filter logic (simulated if you don't have exact column match yet)
  // In a real app, use: where: { engineerId: userId }
  const filteredProjects = myProjects.filter(p => 
    p.clientName.includes("test") === false // Just getting real projects
  );

  const myQuotations = await prisma.quotation.findMany({
    where: { engineer: userName }, // Matches the name from login
    orderBy: { createdAt: 'desc' }
  });

  // Dummy PO data since we haven't built that module yet
  const approvedPOs = [
    { id: "PO-001", project: "Dubai Mall Renovation", val: "SAR 15,000", status: "Approved" },
    { id: "PO-003", project: "Riyadh Tower", val: "SAR 8,500", status: "Pending" },
  ];

  return (
    <div className="space-y-8 p-6 bg-slate-50 min-h-screen">
      
      {/* 1. TOP HEADER (White) */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Best Group LLC</h2>
          <p className="text-xs text-slate-500">Jeddah, Saudi Arabia</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
            <UserCircle className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">{userName}</span>
          </div>
          <form action={logout}>
            <button className="text-slate-400 hover:text-red-600 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* 2. GREEN ENGINEER BANNER (Matches Screenshot) */}
      <div className="bg-[#00B050] rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Engineer Dashboard</h1>
        <p className="text-white/90">View your projects and quotations</p>
      </div>

      {/* 3. STATS CARDS (Blue, Green, Orange) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Blue Card */}
        <div className="bg-[#1F75FE] rounded-xl p-6 text-white shadow-md flex justify-between items-center">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">My Projects</p>
            <h3 className="text-4xl font-bold">{filteredProjects.length}</h3>
          </div>
          <div className="p-3 bg-white/20 rounded-lg">
            <FolderKanban className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Green Card */}
        <div className="bg-[#00B050] rounded-xl p-6 text-white shadow-md flex justify-between items-center">
          <div>
            <p className="text-green-100 text-sm font-medium mb-1">My Quotations</p>
            <h3 className="text-4xl font-bold">{myQuotations.length}</h3>
          </div>
          <div className="p-3 bg-white/20 rounded-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Orange Card */}
        <div className="bg-[#FF8C00] rounded-xl p-6 text-white shadow-md flex justify-between items-center">
          <div>
            <p className="text-orange-100 text-sm font-medium mb-1">Approved POs</p>
            <h3 className="text-4xl font-bold">{approvedPOs.length}</h3>
          </div>
          <div className="p-3 bg-white/20 rounded-lg">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* 4. TABLES SECTION */}
      
      {/* My Projects */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
          <FolderKanban className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-800">My Projects</h3>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-white text-slate-500 border-b border-slate-100 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Project Name</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Manpower</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredProjects.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-900">{p.name}</td>
                <td className="px-6 py-4 text-slate-600">{p.clientName}</td>
                <td className="px-6 py-4 text-slate-600">{p.duration || 'N/A'}</td>
                <td className="px-6 py-4 text-slate-600">{p.requiredManpower}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    p.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredProjects.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-slate-400">No projects assigned.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* My Quotations */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-slate-800">My Quotations</h3>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-white text-slate-500 border-b border-slate-100 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Project</th>
              <th className="px-6 py-4">Manpower</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {myQuotations.map((q) => (
              <tr key={q.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono text-slate-500">{q.quoteNumber}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{q.project}</td>
                <td className="px-6 py-4 text-slate-600">{q.manpower}</td>
                <td className="px-6 py-4 font-bold text-slate-900">SAR {Number(q.totalAmount).toLocaleString()}</td>                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    q.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {q.status}
                  </span>
                </td>
              </tr>
            ))}
             {myQuotations.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-slate-400">No quotations found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}