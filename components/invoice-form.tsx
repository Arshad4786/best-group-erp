"use client";

import { useState } from "react";
import { createInvoice } from "@/app/actions/invoice";
import { Plus, Save, X } from "lucide-react"; // Import X for delete
import Link from "next/link";

interface Props {
  projects: { id: string; name: string }[];
  companies: { id: string; name: string }[];
  newInvoiceNumber: string;
}

interface InvoiceItem {
  id: number;
  description: string;
  price: number;
  quantity: number;
  subtotal: number;
  vat: number;
  totalWithVat: number;
  isTaxable: boolean;
}

export default function InvoiceForm({ projects, companies, newInvoiceNumber }: Props) {
  
  const [items, setItems] = useState<InvoiceItem[]>([]);
  
  // Item Inputs State
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [qty, setQty] = useState<number | "">("");

  // Live Calculation for the Input Row
  const currentSubtotal = (Number(price) || 0) * (Number(qty) || 0);
  // Default view assumes VAT, but we calculate strictly on Add
  
  // --- ADD ITEM LOGIC ---
  const addItem = (withVat: boolean) => {
    if (!desc || !price || !qty) return;
    
    const sub = Number(price) * Number(qty);
    const tax = withVat ? sub * 0.15 : 0;

    const newItem: InvoiceItem = {
      id: Date.now(),
      description: desc,
      price: Number(price),
      quantity: Number(qty),
      subtotal: sub,
      vat: tax,
      totalWithVat: sub + tax,
      isTaxable: withVat
    };

    setItems([...items, newItem]);
    
    // Reset inputs
    setDesc("");
    setPrice("");
    setQty("");
  };

  const removeItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  // --- TOTALS CALCULATION ---
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalBeforeVat = items.reduce((sum, item) => sum + item.subtotal, 0);
  const totalVat = items.reduce((sum, item) => sum + item.vat, 0);
  const grandTotal = totalBeforeVat + totalVat;

  return (
    <form action={createInvoice} className="p-8 space-y-8">
      
      <input type="hidden" name="items" value={JSON.stringify(items)} />
      <input type="hidden" name="invoiceNumber" value={newInvoiceNumber} />

      {/* --- TOP SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="space-y-4">
           <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Select Project <span className="text-red-500">*</span></label>
              <select name="projectId" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
           </div>
           
           <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Select Business/Subcompany <span className="text-red-500">*</span></label>
              <select name="companyId" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Business</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
           </div>

           <div className="pt-2">
              <span className="text-sm font-bold text-slate-500">Invoice Number: </span>
              <span className="text-lg font-mono font-bold text-slate-900">{newInvoiceNumber}</span>
           </div>
           
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <input name="contactLabel" placeholder="Contact Label" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                    <input name="contactDetail" placeholder="Contact details" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Company Name</label>
                <input name="companyName" placeholder="Company Name" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
             </div>

             <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Invoice Date <span className="text-red-500">*</span></label>
                <input type="date" name="date" required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
             <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Invoice Start Date</label>
                <input type="date" name="startDate" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
             <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Invoice End Date</label>
                <input type="date" name="endDate" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
        </div>
      </div>

      {/* --- BILINGUAL TABLE SECTION --- */}
      <div className="border border-slate-300">
         
         {/* Table Header (Gray Background) */}
         <div className="grid grid-cols-12 bg-gray-300 border-b border-slate-300 text-center font-bold text-slate-800 text-sm">
            <div className="col-span-1 p-2 border-r border-slate-300 flex flex-col justify-center">
                <span>البند</span>
                <span>item</span>
            </div>
            <div className="col-span-4 p-2 border-r border-slate-300 flex flex-col justify-center">
                <span>الوصف</span>
                <span>Description</span>
            </div>
            <div className="col-span-2 p-2 border-r border-slate-300 flex flex-col justify-center">
                <span>السعر</span>
                <span>Price</span>
            </div>
            <div className="col-span-1 p-2 border-r border-slate-300 flex flex-col justify-center">
                <span>الكمية</span>
                <span>Quantity</span>
            </div>
            <div className="col-span-2 p-2 border-r border-slate-300 flex flex-col justify-center">
                 <span>قيمة الضريبة</span>
                 <span>Total Amount</span>
                 {/* Note: In your screenshot this column seems to be Subtotal based on math, but labeled Total Amount */}
            </div>
            <div className="col-span-2 p-2 flex flex-col justify-center">
                <span>الاجمالي مع الضريبة</span>
                <span>Total with VAT</span>
            </div>
         </div>

         {/* Added Items List */}
         {items.map((item, index) => (
             <div key={item.id} className="grid grid-cols-12 border-b border-slate-300 text-center text-sm items-center bg-white">
                <div className="col-span-1 p-3 border-r border-slate-300">{index + 1}</div>
                <div className="col-span-4 p-3 border-r border-slate-300">{item.description}</div>
                <div className="col-span-2 p-3 border-r border-slate-300">{item.price.toFixed(2)}</div>
                <div className="col-span-1 p-3 border-r border-slate-300">{item.quantity}</div>
                <div className="col-span-2 p-3 border-r border-slate-300">{item.subtotal.toFixed(2)}</div>
                <div className="col-span-2 p-3 flex justify-between items-center px-4 relative group">
                    <span className="font-bold">{item.totalWithVat.toFixed(2)}</span>
                    <button 
                        type="button" 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 border border-red-200 rounded-full p-1"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
             </div>
         ))}

         {/* Input Row (White Background) */}
         <div className="grid grid-cols-12 border-b border-slate-300 bg-white items-center">
            <div className="col-span-1 p-2 border-r border-slate-300 text-center text-slate-400 font-mono">
               {items.length + 1}
            </div>
            <div className="col-span-4 p-2 border-r border-slate-300">
               <input 
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Item description"
                  className="w-full px-2 py-1 outline-none text-sm placeholder:text-slate-300"
               />
            </div>
            <div className="col-span-2 p-2 border-r border-slate-300">
               <input 
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="Price"
                  className="w-full px-2 py-1 outline-none text-sm placeholder:text-slate-300"
               />
            </div>
            <div className="col-span-1 p-2 border-r border-slate-300">
               <input 
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  placeholder="Qty"
                  className="w-full px-2 py-1 outline-none text-sm placeholder:text-slate-300"
               />
            </div>
            <div className="col-span-2 p-2 border-r border-slate-300 text-center text-sm text-slate-500">
                {currentSubtotal > 0 ? currentSubtotal.toFixed(2) : "NaN"}
            </div>
            <div className="col-span-2 p-2 flex gap-2 justify-center">
                <button 
                    type="button" 
                    onClick={() => addItem(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                >
                    <Plus className="w-3 h-3" /> Add
                </button>
                <button 
                    type="button" 
                    onClick={() => addItem(false)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                >
                    <Plus className="w-3 h-3" /> Add without Vat
                </button>
            </div>
         </div>

         {/* Footer Summary Section */}
         <div className="grid grid-cols-12 bg-white">
             {/* Left side empty space */}
             <div className="col-span-8 border-r border-slate-300"></div>
             
             {/* Right side Summary */}
             <div className="col-span-4">
                 
                 {/* Total Quantity */}
                 <div className="flex justify-between items-center p-2 border-b border-slate-300">
                     <div className="text-center w-full">
                         <div className="font-bold text-slate-800 text-xs">الكمية الإجمالية</div>
                         <div className="font-bold text-slate-800 text-xs">Total Quantity:</div>
                     </div>
                     <div className="font-bold text-slate-900 w-24 text-center">{totalQty}</div>
                 </div>

                 {/* Total Before VAT */}
                 <div className="flex justify-between items-center p-2 border-b border-slate-300">
                     <div className="text-center w-full">
                         <div className="font-bold text-slate-800 text-xs">الاجمالي قبل الضريبة</div>
                         <div className="font-bold text-slate-800 text-xs">Total before VAT:</div>
                     </div>
                     <div className="font-medium text-slate-600 w-24 text-center text-xs">SR {totalBeforeVat.toFixed(2)}</div>
                 </div>

                 {/* Total VAT */}
                 <div className="flex justify-between items-center p-2 border-b border-slate-300">
                     <div className="text-center w-full">
                         <div className="font-bold text-slate-800 text-xs">الاجمالي بعد الضريبة</div>
                         <div className="font-bold text-slate-800 text-xs">Total VAT Amount:</div>
                     </div>
                     <div className="font-medium text-slate-600 w-24 text-center text-xs">SR {totalVat.toFixed(2)}</div>
                 </div>

                 {/* Due Amount */}
                 <div className="flex justify-between items-center p-2">
                     <div className="text-center w-full">
                         <div className="font-bold text-slate-800 text-xs">الرصيد المستحق</div>
                         <div className="font-bold text-slate-800 text-xs">Due Amount:</div>
                     </div>
                     <div className="font-bold text-slate-900 w-24 text-center text-xs">SR {grandTotal.toFixed(2)}</div>
                 </div>

             </div>
         </div>

      </div>

      {/* FOOTER ACTIONS */}
      <div className="pt-6 flex justify-start gap-4">
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded text-sm font-medium flex items-center gap-2 transition-all">
          <Save className="w-4 h-4" />
          Add Invoice
        </button>
      </div>

    </form>
  );
}