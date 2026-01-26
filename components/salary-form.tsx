"use client";

import { useState } from "react";
import { Calculator, Save } from "lucide-react";
import Link from "next/link";
import { createSalary } from "@/app/actions/salary"; // Import the action

interface Employee {
  id: string;
  fullName: string;
  basicSalary: number;
}

export default function SalaryForm({ employees }: { employees: Employee[] }) {
  // State for calculation
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [basicSalary, setBasicSalary] = useState(0);
  
  const [workingDays, setWorkingDays] = useState<number>(30); 
  const [overtimeHours, setOvertimeHours] = useState<number>(0);
  const [overtimeRate, setOvertimeRate] = useState<number>(0);
  const [advance, setAdvance] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);
  
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const empId = e.target.value;
    setSelectedEmpId(empId);
    const emp = employees.find(e => e.id === empId);
    setBasicSalary(emp ? emp.basicSalary : 0);
  };

  const handleCalculate = () => {
    const perDay = basicSalary / 30;
    const salaryForDays = perDay * workingDays;
    const otAmount = overtimeHours * overtimeRate;
    const total = salaryForDays + otAmount - advance - deductions;
    setTotalAmount(parseFloat(total.toFixed(2)));
  };

  return (
    <form action={createSalary} className="p-8 space-y-8">
        
      <div className="space-y-6">
        
        {/* HIDDEN INPUT: Send Basic Salary to server even if disabled */}
        <input type="hidden" name="basicSalary" value={basicSalary} />

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Select Employee <span className="text-red-500">*</span></label>
                <select 
                    name="employeeId" // Required for Server Action
                    required
                    value={selectedEmpId}
                    onChange={handleEmployeeChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Month of Salary <span className="text-red-500">*</span></label>
                <input 
                    type="date" 
                    name="date" // Required
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
            </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Total Working Days <span className="text-red-500">*</span></label>
                <input 
                    type="number" 
                    name="workingDays" // Required
                    value={workingDays}
                    onChange={(e) => setWorkingDays(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
            </div>

             <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Overtime Hours <span className="text-red-500">*</span></label>
                <input 
                    type="number" 
                    name="overtimeHours" // Required
                    value={overtimeHours}
                    onChange={(e) => setOvertimeHours(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
            </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Overtime Cost/hr <span className="text-red-500">*</span></label>
                <input 
                    type="number" 
                    name="overtimeRate" // Required
                    step="0.01"
                    value={overtimeRate}
                    onChange={(e) => setOvertimeRate(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
            </div>

             <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Advance Amount <span className="text-red-500">*</span></label>
                <input 
                    type="number" 
                    name="advance" // Required
                    step="0.01"
                    value={advance}
                    onChange={(e) => setAdvance(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
            </div>
        </div>

        {/* Row 4 */}
        <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Deductions <span className="text-red-500">*</span></label>
            <input 
                type="number" 
                name="deductions" // Required
                step="0.01"
                value={deductions}
                onChange={(e) => setDeductions(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
        </div>

        {/* CALCULATION AREA */}
        <div className="flex items-center gap-4 pt-4">
             <button 
                type="button"
                onClick={handleCalculate}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-blue-100 shadow-lg"
             >
                <Calculator className="w-4 h-4" /> Calculate Salary
             </button>
             
             <div className="text-lg font-bold text-slate-800">
                Total Salary Amount: <span className="text-blue-600">{totalAmount.toLocaleString()}</span>
             </div>
        </div>

      </div>

      {/* FOOTER ACTIONS */}
      <div className="pt-6 flex justify-end gap-4 border-t border-slate-100">
        <Link 
          href="/hr/salary" 
          className="px-8 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </Link>
        <button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center gap-2 transition-all active:scale-95"
        >
          <Save className="w-5 h-5" />
          Save
        </button>
      </div>

    </form>
  );
}