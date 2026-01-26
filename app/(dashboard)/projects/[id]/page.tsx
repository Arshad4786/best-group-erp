import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  DollarSign,
  Receipt,
  TrendingUp,
  Calendar,
  Plus,
  Briefcase,
  Target
} from "lucide-react";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params;

  // 1. FETCH LOGIC
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      // FIX: Sort by 'date' to prevent the "Unknown Argument" error
      expenses: { orderBy: { date: "desc" } }
    }
  });

  if (!project) return notFound();

  // 2. MATH LOGIC (Handle Prisma Decimals)
  const projectValue = Number(project.value);
  const totalExpenses = project.expenses.reduce((s, e) => s + Number(e.amount), 0);
  const profit = projectValue - totalExpenses;
  const margin = projectValue > 0 ? (profit / projectValue) * 100 : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* HEADER BANNER (ERP STYLE) */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl flex justify-between items-center">
        <div>
          <Link
            href="/projects"
            className="text-blue-100 flex items-center gap-2 text-sm font-medium mb-2 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>

          <h1 className="text-3xl font-bold flex items-center gap-3">
            {project.name}
            <span className={`text-xs px-3 py-1 rounded-full uppercase tracking-wide border ${
              project.status === "Active"
                ? "bg-white/20 border-white/30"
                : "bg-white/10 border-white/20"
            }`}>
              {project.status}
            </span>
          </h1>

          <p className="text-blue-100 mt-1 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            {project.clientName}
          </p>
        </div>

        <Link
          href={`/projects/${id}/expenses/new`}
          className="bg-white/20 hover:bg-white/30 px-5 py-3 rounded-xl font-semibold backdrop-blur-sm border border-white/30 flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          Add Expense
        </Link>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Contract Value",
            value: `SAR ${projectValue.toLocaleString()}`,
            icon: DollarSign,
            bg: "bg-blue-500"
          },
          {
            label: "Total Expenses",
            value: `SAR ${totalExpenses.toLocaleString()}`,
            icon: Receipt,
            bg: "bg-amber-500"
          },
          {
            label: "Net Profit",
            value: `SAR ${profit.toLocaleString()}`,
            icon: TrendingUp,
            bg: profit >= 0 ? "bg-emerald-500" : "bg-red-500"
          },
          {
            label: "Progress",
            value: `${project.progress}%`,
            icon: Target,
            bg: "bg-indigo-500"
          }
        ].map((kpi, i) => (
          <div
            key={i}
            className={`${kpi.bg} rounded-xl p-6 text-white shadow-lg relative overflow-hidden`}
          >
            <p className="text-white/80 text-sm font-medium mb-1">
              {kpi.label}
            </p>
            <h3 className="text-2xl font-bold">{kpi.value}</h3>

            <div className="absolute right-4 bottom-4 p-2 bg-white/20 rounded-lg">
              <kpi.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* PROJECT PROGRESS */}
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="font-bold text-slate-800">Project Completion</h3>
            <p className="text-sm text-slate-500">Engineering milestone progress</p>
          </div>
          <span className="text-2xl font-black text-blue-600">
            {project.progress}%
          </span>
        </div>

        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* EXPENSE LEDGER */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/40 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-slate-400" />
            Expense Ledger
          </h2>
          <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded border">
            Newest First
          </span>
        </div>

        <div className="overflow-x-auto">
          {project.expenses.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No expenses recorded yet.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-white text-slate-400 uppercase text-[11px] tracking-widest font-bold border-b">
                <tr>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {project.expenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {exp.description || "General Expense"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {/* FIX: Use 'date' instead of 'createdAt' */}
                      {new Date(exp.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-semibold text-slate-700">
                      {/* FIX: Convert Decimal to Number for display */}
                      - SAR {Number(exp.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}