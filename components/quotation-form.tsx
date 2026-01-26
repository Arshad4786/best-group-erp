"use client";

import { useState } from "react";
import { createQuotationV2 } from "@/app/actions/quotation";
import { Save, Plus, Trash2, Printer, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuotationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dynamic Items State
  const [items, setItems] = useState([{ description: "", rate: "" }]);

  const addItem = () => setItems([...items, { description: "", rate: "" }]);
  
  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (index: number, field: "description" | "rate", value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(event.currentTarget);
    
    // Construct the data object
    const payload = {
      quotationFor: formData.get("quotationFor") as string,
      attention: formData.get("attention") as string,
      location: formData.get("location") as string,
      issueDate: new Date(formData.get("issueDate") as string),
      project: formData.get("project") as string,
      workingHours: formData.get("workingHours") as string,
      specialArticle: formData.get("specialArticle") as string,
      rateType: formData.get("rateType") as string,
      firstParty: formData.get("firstParty") as string,
      duration: formData.get("duration") as string,
      invoiceDays: formData.get("invoiceDays") as string,
      quotationBy: formData.get("quotationBy") as string,
      contactNo: formData.get("contactNo") as string,
      contactEmail: formData.get("contactEmail") as string,
      items: items.map(i => ({ 
        description: i.description, 
        rate: parseFloat(i.rate) || 0 
      }))
    };

    await createQuotationV2(payload);
    
    router.push("/quotations"); // Redirect to list
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-8">
      
      {/* SECTION 1: CLIENT & LOCATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Quotation For *</label>
          <input name="quotationFor" required placeholder="Client Name" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Attention *</label>
          <input name="attention" required placeholder="Person Name" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Location *</label>
          <input name="location" required placeholder="Project Location" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Issue Date</label>
          <input type="date" name="issueDate" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* SECTION 2: TERMS VARIABLES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Working Hours & Days *</label>
          <input name="workingHours" required placeholder="e.g. 10 hours / 6 days" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Contract Duration *</label>
          <input name="duration" required placeholder="e.g. 6 Months" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Invoice Payment Days *</label>
          <input name="invoiceDays" required placeholder="e.g. 30 Days" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">First Party Name (Us) *</label>
          <input name="firstParty" defaultValue="Best Group LLC" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Subject / Project Name *</label>
        <input name="project" required placeholder="Quotation for..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>

       <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Special Article / Notes</label>
          <input name="specialArticle" placeholder="Additional notes..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>

      <hr className="border-slate-100" />

      {/* SECTION 3: ENGINEER INFO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Quotation By *</label>
          <input name="quotationBy" required placeholder="Engineer Name" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Contact No.</label>
          <input name="contactNo" placeholder="+966..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Email</label>
          <input name="contactEmail" placeholder="email@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* SECTION 4: ITEMS */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">Add Items</h3>
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-slate-700">Rate Unit:</label>
            <select name="rateType" className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-sm font-medium">
              <option value="HOUR">Per Hour</option>
              <option value="MONTH">Per Month</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1">
                <input 
                  placeholder="Description (e.g. Skilled Electrician)"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="w-48">
                <input 
                  type="number"
                  placeholder="Rate"
                  value={item.rate}
                  onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <button 
                type="button" 
                onClick={() => removeItem(index)}
                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <button 
          type="button" 
          onClick={addItem}
          className="mt-4 flex items-center gap-2 text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Another Item
        </button>
      </div>

      {/* SUBMIT */}
      <div className="pt-6 flex items-center justify-between border-t border-slate-100">
        <p className="text-sm text-slate-500">
          * Saving will create a new draft quotation
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70"
        >
          {isSubmitting ? 'Saving...' : (
            <>
              <Save className="w-5 h-5" />
              Save Quotation
            </>
          )}
        </button>
      </div>
    </form>
  );
}