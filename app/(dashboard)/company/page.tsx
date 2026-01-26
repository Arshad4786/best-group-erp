export const dynamic = "force-dynamic";

import Link from "next/link";
import prisma from "@/lib/db";
import CompanyActions from "@/components/company-actions";
import { 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Plus 
} from "lucide-react";

export default async function CompanyManagement() {
  // 1. FETCH DATA
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // 2. PROCESS DATA (Separate Master from Subs)
  const masterCompanies = companies.filter(c => c.isMaster);
  const subCompanies = companies.filter(c => !c.isMaster);
  
  // Calculate Stats
  const totalMaster = masterCompanies.length;
  const totalSub = subCompanies.length;
  const uniqueLocations = new Set(companies.map(c => c.location)).size;

  return (
    <div className="space-y-8">
      
      {/* 1. HEADER BANNER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Building2 className="w-8 h-8" />
            Company Management
          </h1>
          <p className="text-blue-100 text-base opacity-90">
            Manage master company and sub-companies
          </p>
        </div>
        <Link 
          href="/company/new" 
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors border border-white/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Company
        </Link>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1: Master */}
        <div className="bg-blue-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-blue-100 text-sm font-medium mb-1">Master Company</p>
            <h3 className="text-3xl font-bold">{totalMaster}</h3>
          </div>
          <div className="absolute right-4 bottom-4 p-2 bg-white/20 rounded-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
        </div>
        
        {/* Card 2: Subs */}
        <div className="bg-emerald-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-emerald-100 text-sm font-medium mb-1">Sub Companies</p>
            <h3 className="text-3xl font-bold">{totalSub}</h3>
          </div>
          <div className="absolute right-4 bottom-4 p-2 bg-white/20 rounded-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Card 3: Locations */}
        <div className="bg-orange-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-orange-100 text-sm font-medium mb-1">Total Locations</p>
            <h3 className="text-3xl font-bold">{uniqueLocations}</h3>
          </div>
          <div className="absolute right-4 bottom-4 p-2 bg-white/20 rounded-lg">
            <MapPin className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Card 4: Status */}
        <div className="bg-purple-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-purple-100 text-sm font-medium mb-1">System Status</p>
            <h3 className="text-2xl font-bold">Active</h3>
          </div>
          <div className="absolute right-4 bottom-4 p-2 bg-white/20 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* 3. MASTER COMPANY TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Master Company
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Company Name</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {masterCompanies.length === 0 ? (
                <tr><td colSpan={4} className="p-6 text-center text-slate-400">No Master Company Set</td></tr>
              ) : (
                masterCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{company.name}</td>
                    <td className="px-6 py-4 text-slate-500 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {company.location}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <CompanyActions id={company.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. SUB COMPANIES TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            Sub Companies
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Company Name</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {subCompanies.length === 0 ? (
                <tr><td colSpan={4} className="p-6 text-center text-slate-400">No Sub-Companies Found</td></tr>
              ) : (
                subCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{company.name}</td>
                    <td className="px-6 py-4 text-slate-500 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {company.location}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <CompanyActions id={company.id} />
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