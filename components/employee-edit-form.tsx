"use client";

import { updateEmployee } from "@/app/actions/hr";
import { Save, User, Briefcase } from "lucide-react";
import Link from "next/link";

// Define Types
interface Company {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
}

interface EmployeeData {
  id: string;
  fullName: string;
  employeeId: string;
  gender: string | null;
  dateOfBirth: Date | null;
  mobileNumber: string | null;
  nationality: string | null;
  companyId: string | null;
  projectId: string | null;
  category: string | null;
  basicSalary: number | null;
  entryDate: Date | null;
  workShift: string | null;
  leavePolicy: string | null;
  referenceRL: string | null;
  molId: string | null;
  passportNumber: string | null;
  accountNumber: string | null;
  remarks: string | null;
  iqamaNumber: string | null;      
  iqamaExpiryDate: Date | null;
}

interface Props {
  employee: EmployeeData;
  companies: Company[];
  projects: Project[];
}

export default function EmployeeEditForm({ employee, companies, projects }: Props) {
  // Bind the ID to the server action
  const updateAction = updateEmployee.bind(null, employee.id);

  // Helper to format date for input (YYYY-MM-DD)
  const formatDate = (d: Date | null | undefined) => 
    d ? new Date(d).toISOString().split('T')[0] : "";

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <form action={updateAction} className="p-8 space-y-8">
        
        {/* SECTION 1: PERSONAL DETAILS */}
        <div>
          <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-lg">Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* --- READ ONLY FIELDS (Greyed Out) --- */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500">Full Name (Read Only)</label>
              <input 
                disabled 
                defaultValue={employee.fullName} 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500">Employee ID (Read Only)</label>
              <input 
                disabled 
                defaultValue={employee.employeeId} 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none" 
              />
            </div>

            {/* --- EDITABLE FIELDS --- */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Mobile Number <span className="text-red-500">*</span> </label>
              <input 
                name="mobileNumber" 
                defaultValue={employee.mobileNumber || ""}
                required 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500">Gender (Read Only)</label>
              <input 
                disabled 
                defaultValue={employee.gender || ""} 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Nationality <span className="text-red-500">*</span></label>
              <select 
                name="nationality" 
                defaultValue={employee.nationality || ""}
                required 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
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
              <label className="text-sm font-semibold text-slate-500">Date of Birth (Read Only)</label>
              <input 
                type="date" 
                disabled 
                defaultValue={formatDate(employee.dateOfBirth)} 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none" 
              />
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
              <select 
                name="companyId" 
                defaultValue={employee.companyId || ""}
                required 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Company</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Project Name <span className="text-red-500">*</span></label>
              <select 
                name="projectId" 
                defaultValue={employee.projectId || ""}
                required 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Category / Designation</label>
              <input 
                name="category" 
                defaultValue={employee.category || ""}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Basic Salary</label>
              <input 
                type="number" 
                step="0.01" 
                name="basicSalary" 
                defaultValue={employee.basicSalary || ""}
                placeholder="0.00" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Entry Date</label>
              <input 
                type="date" 
                name="entryDate" 
                defaultValue={formatDate(employee.entryDate)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Work Shift</label>
              <input 
                name="workShift" 
                defaultValue={employee.workShift || ""}
                placeholder="e.g. Day Shift" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Leave Policy</label>
              <input 
                name="leavePolicy"  
                defaultValue={employee.leavePolicy || ""}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Reference / RL</label>
              <input 
                name="referenceRL" 
                defaultValue={employee.referenceRL || ""}
                placeholder="Optional" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
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
              <input 
                name="molId" 
                defaultValue={employee.molId || ""}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Passport Number</label>
              <input 
                name="passportNumber" 
                defaultValue={employee.passportNumber || ""}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
              <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Iqama Number</label>
              <input 
                name="iqamaNumber" 
                defaultValue={employee.iqamaNumber || ""}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Iqama Expiry Date</label>
              <input 
                type="date"
                name="iqamaExpiryDate" 
                defaultValue={formatDate(employee.iqamaExpiryDate)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Bank Account Number</label>
              <input 
                name="accountNumber" 
                defaultValue={employee.accountNumber || ""}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Remarks / Notes</label>
              <input 
                name="remarks" 
                defaultValue={employee.remarks || ""}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
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
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>

      </form>
    </div>
  );
}