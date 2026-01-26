import prisma from "@/lib/db";
import { createEmployee } from "@/app/actions/hr";
import { ArrowLeft, UserPlus, Briefcase, User } from "lucide-react";
import Link from "next/link";

export default async function NewEmployeePage() {
const companies = await prisma.company.findMany({
    where: { 
      isActive: true, // <--- THIS FILTERS OUT INACTIVE COMPANIES
      // isMaster: false // Optional: If you only want sub-companies
    },
    orderBy: { name: "asc" }
  });
  const projects = await prisma.project.findMany();

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* 1. SIMPLE HEADER */}
      <div className="flex items-center gap-4">
        <Link 
          href="/hr/employees" 
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add New Employee</h1>
          <p className="text-sm text-slate-500">Enter employee details below</p>
        </div>
      </div>

      {/* 2. FORM CARD */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <form action={createEmployee} className="p-8 space-y-8">
          
          {/* SECTION 1: PERSONAL DETAILS */}
          <div>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-lg">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ">Full Name <span className="text-red-500">*</span></label>
                <input name="fullName" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Employee ID / Border No <span className="text-red-500">*</span></label>
                <input name="employeeId" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Mobile Number <span className="text-red-500">*</span> </label>
                <input name="mobileNumber" required placeholder="050 123 4567" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Gender <span className="text-red-500">*</span></label>
                <select name="gender" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Nationality <span className="text-red-500">*</span></label>
                <select name="nationality" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Select Nationality</option>
                  <option value="Saudi">Saudi</option>
                  <option value="Indian">Indian</option>
                  <option value="Pakistani">Pakistani</option>
                  <option value="Bangladeshi">Bangladeshi</option>
                  <option value="Filipino">Filipino</option>
                  <option value="Egyptian">Egyptian</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Date of Birth <span className="text-red-500">*</span></label>
                <input type="date" required name="dateOfBirth" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* SECTION 2: WORK DETAILS */}
          <div>
             <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-lg">Work Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Company Name <span className="text-red-500">*</span> </label>
                <select name="companyId" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Select Company</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Project Name <span className="text-red-500">*</span></label>
                <select name="projectId" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Select Project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Category / Designation</label>
                <input name="category" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Basic Salary</label>
                <input type="number" step="0.01" name="basicSalary" placeholder="0.00" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Entry Date</label>
                <input type="date" name="entryDate" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Work Shift</label>
                <input name="workShift" placeholder="e.g. Day Shift" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              {/* Leave Policy & Reference RL (Matching your Backend) */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Leave Policy</label>
                <input name="leavePolicy"  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Reference / RL</label>
                <input name="referenceRL" placeholder="Optional" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

            </div>
          </div>

          <hr className="border-slate-100" />

          {/* SECTION 3: LEGAL & OTHER */}
          <div>
            <h3 className="font-bold text-slate-800 text-lg mb-6 pb-2 border-b border-slate-100">Other Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">MOL ID</label>
                <input name="molId" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Passport Number</label>
                <input name="passportNumber" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              
              <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Iqama Number</label>
                  <input name="iqamaNumber" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Iqama Expiry Date</label>
                  <input type="date" name="iqamaExpiryDate" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Bank Account Number</label>
                <input name="accountNumber" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Remarks / Notes</label>
                <input name="remarks" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-6 flex justify-end gap-4 border-t border-slate-100">
            <Link 
              href="/hr/employees" 
              className="px-8 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center gap-2 transition-all active:scale-95"
            >
              <UserPlus className="w-5 h-5" />
              Save Employee
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}