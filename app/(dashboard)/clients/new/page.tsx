import { createClient } from "@/app/actions/client";
import { ArrowLeft, Building2, Save, User } from "lucide-react";
import Link from "next/link";

export default function NewClientPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link 
          href="/clients" 
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add New Client</h1>
          <p className="text-sm text-slate-500">Enter client business details</p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <form action={createClient} className="p-8 space-y-8">
          
          {/* SECTION: COMPANY INFO */}
          <div>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-lg">Company Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Company Name <span className="text-red-500">*</span></label>
                <input 
                  name="companyName" 
                  required 
                  placeholder="e.g. Al Bahar Al Alami Ltd"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">VAT Number</label>
                <input 
                  name="vatNumber" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>

              {/* Full Width Address */}
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-slate-700">Office Address</label>
                <textarea 
                  name="address" 
                  rows={3}
                  placeholder="Enter full office address here..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
                />
              </div>

            </div>
          </div>

          <hr className="border-slate-100" />

          {/* SECTION: CONTACT PERSON */}
          <div>
             <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-lg">Contact Person</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Contact Person Name</label>
                <input 
                  name="contactPerson" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Contact Details (Phone/Email)</label>
                <input 
                  name="contactDetails" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="pt-6 flex justify-end gap-4 border-t border-slate-100">
            <Link 
              href="/clients" 
              className="px-8 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center gap-2 transition-all active:scale-95"
            >
              <Save className="w-5 h-5" />
              Save Client
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}