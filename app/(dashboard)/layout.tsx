export const dynamic = "force-dynamic";

import { Inter } from "next/font/google";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Building2, 
  Users, // Used for Labor & Employees
  FolderKanban, 
  FileText, 
  ShoppingCart, 
  Wallet, 
  Receipt,
  LogOut,
  Banknote // For Salary
} from "lucide-react";
import { logout } from "@/app/actions/auth";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`flex h-screen bg-gray-50 text-slate-900 ${inter.className} print:block`}>
      
      {/* --- SIDEBAR START --- */}
      <aside className="w-72 bg-white border-r border-gray-200 hidden md:flex flex-col flex-shrink-0 z-50 print:hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Best Group</h1>
              <span className="text-xs text-slate-500 font-medium">ERP System</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-2">
            Main Menu
          </p>
          
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all font-medium group">
            <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Dashboard
          </Link>

          <Link href="/company" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all font-medium group">
            <Building2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Company Management
          </Link>

          <Link href="/labor" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all font-medium group">
            <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Labor Management
          </Link>

          <Link href="/projects" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all font-medium group">
            <FolderKanban className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Project Management
          </Link>

          <Link href="/clients" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all font-medium group">
            <FolderKanban className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Clients
          </Link>    

          <Link href="/invoices" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all font-medium group">
            <FolderKanban className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Invoices
          </Link>       
          
          <Link href="/quotations" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all font-medium group">
            <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Quotation Management
          </Link>

          {/* <Link href="/purchase-orders" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all font-medium group">
            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Purchase Orders
          </Link> */}

          {/* <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-6">
            Finance
          </p> */}

          {/* <Link href="/commissions" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all font-medium group">
            <Wallet className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Commission Management
          </Link> */}

          {/* <Link href="/expenses" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all font-medium group">
            <Receipt className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Expense Management
          </Link> */}

          {/* --- HR SECTION --- */}
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-6">
            HR
          </p>

          <Link href="/hr/employees" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all font-medium group">
            <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Employees
          </Link>

          <Link href="/hr/salary" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all font-medium group">
            <Banknote className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Salary
          </Link>

        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-slate-50 rounded-xl p-4 mb-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold">
                N
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Super Admin</p>
                <p className="text-xs text-slate-500">admin@bestgroup.com</p>
              </div>
            </div>
            <form action={logout}>
              <button className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-red-600 transition-colors w-full">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </form>
          </div>
        </div>
      </aside>
      {/* --- SIDEBAR END --- */}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-8 print:w-full print:p-0 print:overflow-visible">
        {children}
      </main>

    </div>
  );
}