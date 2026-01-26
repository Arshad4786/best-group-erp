import { createCompany } from "@/app/actions/company";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import FormImageUpload from "@/components/form-image-upload"; // <--- IMPORT THE NEW COMPONENT

export default function NewCompanyPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link 
          href="/company" 
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add New Subcompany</h1>
          <p className="text-sm text-slate-500">Enter business and banking details</p>
        </div>
      </div>

      <form action={createCompany} className="space-y-8">
        
        {/* SECTION 1: SUBCOMPANY DETAILS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
            Subcompany Details
          </h2>
          
          <div className="grid grid-cols-1 gap-y-6">
            
            {/* Row 1 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Subcompany Name: *</label>
              <input 
                name="name" 
                required 
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">VAT Number: *</label>
              <input 
                name="vatNumber" 
                required 
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            {/* Row 2 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Email Address:</label>
              <input 
                name="email" 
                type="email"
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Phone Number:</label>
              <input 
                name="phone" 
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            {/* Row 3 - UPDATED UPLOAD COMPONENT */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Upload logo:</label>
              {/* This component handles upload and provides the hidden input 'logoUrl' */}
              <FormImageUpload />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Office Address (Location):</label>
              <input 
                name="location" 
                required 
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            {/* Hidden Field for Type */}
            <input type="hidden" name="type" value="Sub" />

          </div>
        </div>

        {/* SECTION 2: BANK DETAILS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
            Bank Details
          </h2>
          
          <div className="grid grid-cols-1 gap-y-6">
             
             <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">IBAN Number: *</label>
              <input 
                name="iban" 
                required 
                placeholder="IBAN Number"
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Account Name: *</label>
              <input 
                name="accountName" 
                required 
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Bank Name: *</label>
              <input 
                name="bankName" 
                required 
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Account Number: *</label>
              <input 
                name="accountNumber" 
                required 
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end gap-4">
            <Link 
              href="/company"
              className="px-6 py-2.5 border border-slate-300 rounded-lg font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-200 flex items-center gap-2 transition-all active:scale-95"
            >
              <Save className="w-5 h-5" />
              Add Subcompany
            </button>
        </div>

      </form>
    </div>
  );
}