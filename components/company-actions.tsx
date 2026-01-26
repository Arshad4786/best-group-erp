"use client";

import { useState } from "react";
import { Pencil, Power, X, Save, AlertTriangle, Building2, CheckCircle2 } from "lucide-react";
import { toggleCompanyStatus, updateCompany } from "@/app/actions/company";
import FormImageUpload from "@/components/form-image-upload";
import { useRouter } from "next/navigation";

// Updated Interface
interface CompanyData {
  id: string;
  name: string;
  location: string;
  vatNumber?: string | null;
  email?: string | null;
  phone?: string | null;
  iban?: string | null;
  bankName?: string | null;
  accountName?: string | null;
  accountNumber?: string | null;
  logoUrl?: string | null;
  isMaster: boolean;
  isActive: boolean; // <--- Added this
  [key: string]: any;
}

export default function CompanyActions({ company }: { company: CompanyData }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleStatusToggle = async () => {
    setIsProcessing(true);
    setActionError(null);
    
    const formData = new FormData();
    formData.append("id", company.id);
    formData.append("currentStatus", String(company.isActive));

    const result = await toggleCompanyStatus(formData);

    if (result?.error) {
      setActionError(result.error);
      setIsProcessing(false);
    } else {
      setShowStatusModal(false);
      setIsProcessing(false);
      router.refresh(); 
    }
  };

  const handleUpdate = async (formData: FormData) => {
    await updateCompany(formData);
    setShowEditModal(false);
    router.refresh();
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        {/* Edit Button */}
        <button 
          onClick={() => setShowEditModal(true)}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
          title="Edit Company"
        >
          <Pencil className="w-4 h-4" />
        </button>

        {/* Activate/Deactivate Button */}
        <button 
          onClick={() => setShowStatusModal(true)}
          className={`p-2 rounded-lg transition-colors ${
            company.isActive 
              ? "text-slate-400 hover:text-red-600 hover:bg-red-50" // If Active, show option to turn off (Red)
              : "text-slate-400 hover:text-green-600 hover:bg-green-50" // If Inactive, show option to turn on (Green)
          }`}
          title={company.isActive ? "Deactivate Company" : "Activate Company"}
        >
          <Power className="w-4 h-4" />
        </button>
      </div>

      {/* EDIT MODAL (Kept exactly as before) */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           {/* ... (Same Edit Modal Code from previous answer) ... */}
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Edit Company</h3>
                <p className="text-sm text-slate-500">Update business and banking information</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form action={handleUpdate} className="p-6 space-y-6">
              <input type="hidden" name="id" value={company.id} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Basic Info */}
                 <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Company Name</label>
                  <input name="name" defaultValue={company.name} required className="w-full p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Location</label>
                  <input name="location" defaultValue={company.location} required className="w-full p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">VAT Number</label>
                  <input name="vatNumber" defaultValue={company.vatNumber || ""} className="w-full p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                 <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Phone</label>
                  <input name="phone" defaultValue={company.phone || ""} className="w-full p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                 <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                  <input name="email" defaultValue={company.email || ""} className="w-full p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="md:col-span-2 space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                    <label className="text-xs font-bold text-slate-500 uppercase">Company Logo</label>
                    <FormImageUpload />
                    {company.logoUrl && <p className="text-xs text-green-600 mt-1 font-medium">✓ Current logo is saved. Upload new one to replace.</p>}
                </div>
                <div className="md:col-span-2 pt-4 border-t border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" /> Bank Details
                    </h4>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Bank Name</label>
                  <input name="bankName" defaultValue={company.bankName || ""} className="w-full p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Account Name</label>
                  <input name="accountName" defaultValue={company.accountName || ""} className="w-full p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                 <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">IBAN</label>
                  <input name="iban" defaultValue={company.iban || ""} className="w-full p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Account Number</label>
                  <input name="accountNumber" defaultValue={company.accountNumber || ""} className="w-full p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-50 mt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-200">
                    <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
           </div>
        </div>
      )}

      {/* 3. TOGGLE STATUS MODAL */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className={`p-6 flex flex-col items-center text-center border-b ${company.isActive ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${company.isActive ? 'bg-red-100' : 'bg-green-100'}`}>
                    <Power className={`w-6 h-6 ${company.isActive ? 'text-red-600' : 'text-green-600'}`} />
                </div>
                <h3 className={`text-xl font-bold ${company.isActive ? 'text-red-900' : 'text-green-900'}`}>
                    {company.isActive ? "Deactivate Company?" : "Activate Company?"}
                </h3>
                <p className={`text-sm mt-1 ${company.isActive ? 'text-red-700' : 'text-green-700'}`}>
                    {company.isActive 
                        ? "This will hide the company from selection menus." 
                        : "This will make the company visible again."}
                </p>
            </div>

            <div className="p-6">
                {/* Error Message */}
                {actionError && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 animate-in fade-in slide-in-from-bottom-2">
                        <p className="text-slate-800 font-bold mb-2 flex items-center gap-2">
                            <X className="w-4 h-4 text-red-500" /> Action Blocked
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {actionError}
                        </p>
                    </div>
                )}

                <p className="text-slate-600 text-center mb-6">
                    Are you sure you want to change the status for <span className="font-bold text-slate-900">{company.name}</span>?
                </p>

                <div className="flex gap-3">
                    <button 
                        onClick={() => { setShowStatusModal(false); setActionError(null); }} 
                        className="flex-1 py-2.5 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                    >
                        {actionError ? "Close" : "Cancel"}
                    </button>
                    
                    {!actionError && (
                        <button 
                            onClick={handleStatusToggle}
                            disabled={isProcessing}
                            className={`flex-1 py-2.5 text-white rounded-lg font-medium transition-colors disabled:opacity-70 flex items-center justify-center gap-2 ${
                                company.isActive ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-green-600 hover:bg-green-700 shadow-green-200'
                            }`}
                        >
                            {isProcessing ? "Processing..." : (company.isActive ? "Yes, Deactivate" : "Yes, Activate")}
                        </button>
                    )}
                </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}