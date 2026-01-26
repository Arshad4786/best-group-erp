import prisma from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PrintButton from "@/components/print-button";

interface PageProps {
  params: Promise<{ invoiceId: string }>;
}

export default async function InvoiceDetailsPage({ params }: PageProps) {
  const { invoiceId } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      project: true,
      company: true, // Contains the VAT Number
      items: true,
    },
  });

  if (!invoice) return notFound();

  // --- HELPER FUNCTIONS ---
  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Date(date).toISOString().split('T')[0]; 
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getMonthYear = (date: Date) => {
    return new Date(date)
      .toLocaleString("en-US", { month: "long", year: "numeric" })
      .toUpperCase();
  };

  // Determine if VAT exists
  const hasVat = Number(invoice.vatAmount) > 0;
  const totalQty = invoice.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 print:p-0 print:max-w-none">
      
      {/* =====================================================================================
          1. WEB VIEW (SCREEN ONLY) 
         ===================================================================================== */}
      <div className="print:hidden space-y-6">
          
          {/* HEADER */}
          <div className="flex items-center gap-4">
            <Link href="/invoices" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-500" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Invoice Details</h1>
              <p className="text-sm text-slate-500">Find the list of invoice details</p>
            </div>
          </div>

          {/* DETAILS GRID */}
          <div className="bg-white border border-slate-200 text-sm">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-200">
              <div className="grid grid-cols-[140px_1fr] border-b md:border-b-0 md:border-r border-slate-200">
                <div className="bg-slate-50 p-3 font-bold text-slate-800 flex items-center">Invoice Number</div>
                <div className="p-3 text-slate-600 flex items-center">{invoice.invoiceNumber}</div>
              </div>
              <div className="grid grid-cols-[140px_1fr]">
                <div className="bg-slate-50 p-3 font-bold text-slate-800 flex items-center">Project Name</div>
                <div className="p-3 text-slate-600 flex items-center">{invoice.project?.name}</div>
              </div>
            </div>
            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-200">
              <div className="grid grid-cols-[140px_1fr] border-b md:border-b-0 md:border-r border-slate-200">
                <div className="bg-slate-50 p-3 font-bold text-slate-800 flex items-center">Business Name</div>
                <div className="p-3 text-slate-600 flex items-center">{invoice.company?.name}</div>
              </div>
              <div className="grid grid-cols-[140px_1fr]">
                <div className="bg-slate-50 p-3 font-bold text-slate-800 flex items-center">Invoice Date</div>
                <div className="p-3 text-slate-600 flex items-center">{formatDate(invoice.date)}</div>
              </div>
            </div>
            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-200">
              <div className="grid grid-cols-[140px_1fr] border-b md:border-b-0 md:border-r border-slate-200">
                <div className="bg-slate-50 p-3 font-bold text-slate-800 flex items-center">Invoice Duration</div>
                <div className="p-3 text-slate-600 flex items-center">
                  {invoice.startDate && invoice.endDate ? `${formatDate(invoice.startDate)} - ${formatDate(invoice.endDate)}` : "-"}
                </div>
              </div>
              <div className="grid grid-cols-[140px_1fr]">
                <div className="bg-slate-50 p-3 font-bold text-slate-800 flex items-center uppercase">INVOICE FOR #</div>
                <div className="p-3 text-slate-600 flex items-center uppercase">MONTH OF {getMonthYear(invoice.date)}</div>
              </div>
            </div>
             {/* Row 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="grid grid-cols-[140px_1fr] border-b md:border-b-0 md:border-r border-slate-200 min-h-[48px]">
                <div className="bg-slate-50 p-3 font-bold text-slate-800 flex items-center">{invoice.contactLabel || "Contact"}</div>
                <div className="p-3 text-slate-600 flex items-center">{invoice.contactDetail || "-"}</div>
              </div>
              <div className="grid grid-cols-[140px_1fr]">
              </div>
            </div>
          </div>

          {/* WEB ITEMS TABLE */}
          <div className="border border-slate-400 mt-4">
             {/* ... Web Table Header & Body ... (Same logic as print, keeping clean for brevity) */}
            <div className="grid grid-cols-12 bg-gray-300 border-b border-slate-400 text-center font-bold text-slate-800 text-xs">
              <div className="col-span-1 p-3 border-r border-slate-400">#</div>
              <div className="col-span-4 p-3 border-r border-slate-400">Description</div>
              <div className="col-span-2 p-3 border-r border-slate-400">Price</div>
              <div className="col-span-1 p-3 border-r border-slate-400">Qty</div>
              <div className="col-span-2 p-3 border-r border-slate-400">Total</div>
              <div className="col-span-2 p-3">With VAT</div>
            </div>
             {invoice.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 border-b border-slate-400 text-center text-xs bg-white text-slate-700">
                    <div className="col-span-1 p-3 border-r border-slate-400">{index + 1}</div>
                    <div className="col-span-4 p-3 border-r border-slate-400 uppercase">{item.description}</div>
                    <div className="col-span-2 p-3 border-r border-slate-400">{Number(item.price).toFixed(0)}</div>
                    <div className="col-span-1 p-3 border-r border-slate-400">{item.quantity}</div>
                    <div className="col-span-2 p-3 border-r border-slate-400">{formatCurrency(Number(item.total))}</div>
                    <div className="col-span-2 p-3">{formatCurrency(Number(item.total) * (hasVat ? 1.15 : 1))}</div>
                </div>
             ))}
             <div className="grid grid-cols-12 bg-white font-bold text-xs p-3">
                 <div className="col-span-10 text-right pr-4">Due Amount:</div>
                 <div className="col-span-2 text-center">SR {formatCurrency(Number(invoice.totalAmount))}</div>
             </div>
          </div>

          <div className="flex justify-start">
             <PrintButton />
          </div>
      </div>

      {/* =====================================================================================
          2. PRINT VIEW (PRINT ONLY) 
         ===================================================================================== */}
      <div className="hidden print:block font-sans text-black">
        
        {/* CENTER TITLE */}
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold uppercase tracking-wide">TAX Invoice</h1>
            <h2 className="text-2xl font-bold font-serif mt-1">فاتورة ضريبة</h2>
        </div>

        {/* TOP DETAILS COLUMNS */}
        <div className="flex justify-between items-start mb-6">
            
            {/* LEFT COLUMN: Invoice Details + Contact Info */}
            <div className="w-[55%] space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Invoice Details</h3>
                
                <div className="text-xs font-bold text-slate-600">
                    Invoice Duration: <span className="text-slate-500 font-normal">
                       {invoice.startDate ? `${formatDate(invoice.startDate)} - ` : ""} 
                       {invoice.endDate ? formatDate(invoice.endDate) : ""}
                    </span>
                </div>

                <div className="space-y-1">
                    <div className="font-bold text-sm text-slate-800 text-right w-fit ml-0">رقم الفاتورة</div>
                    <div className="font-bold text-sm text-slate-800">
                        Invoice No: <span className="text-slate-600 font-medium">{invoice.invoiceNumber}</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="font-bold text-sm text-slate-800 text-right w-fit ml-0">تاريخ الفاتورة</div>
                    <div className="font-bold text-sm text-slate-800">
                        Invoice Date: <span className="text-slate-600 font-medium">{formatDate(invoice.date)}</span>
                    </div>
                </div>
                
                {invoice.contactLabel && (
                    <div className="pt-2 space-y-1 border-slate-200 mt-2">
                        <div className="font-bold text-sm text-slate-800 uppercase">
                            {invoice.contactLabel}: <span className="text-slate-600 font-medium normal-case">{invoice.contactDetail}</span>
                        </div>
                    </div>
                )}
                <div className="pt-2 text-xs font-bold text-slate-800 uppercase">
                    INVOICE FOR #: <span className="text-blue-900">MONTH OF {getMonthYear(invoice.date)}</span>
                </div>

                {/* Contact Info */}

            </div>

            {/* RIGHT COLUMN: Project Details & VAT */}
            <div className="w-[40%] space-y-4 text-right flex flex-col items-end">
                <h3 className="text-lg font-bold text-slate-800 w-full text-right">Project Details</h3>
                
                <div className="text-xs font-bold text-slate-800 w-full text-right">
                    Project Name: <span className="font-normal text-slate-600">{invoice.project?.name}</span>
                </div>

                {/* --- FIX: FETCHING DYNAMIC VAT NUMBER FROM COMPANY --- */}
                <div className="text-xs font-bold text-slate-800 w-full text-right mt-2">
                    VAT No: <span className="font-normal text-slate-500">{invoice.company?.vatNumber || "-"}</span>
                </div>
                
            </div>

        </div>

        {/* TABLE (Identical to previous step) */}
        <div className="border-2 border-slate-500 mb-0">
            <div className="grid grid-cols-12 bg-gray-300 border-b-2 border-slate-500 text-center font-bold text-slate-900 text-[10px] uppercase">
                <div className="col-span-1 p-2 border-r border-slate-500 flex flex-col justify-center">
                    <span>البند</span>
                    <span>Items</span>
                </div>
                <div className="col-span-4 p-2 border-r border-slate-500 flex flex-col justify-center">
                    <span>الوصف</span>
                    <span>Description</span>
                </div>
                <div className="col-span-1 p-2 border-r border-slate-500 flex flex-col justify-center">
                    <span>السعر</span>
                    <span>Price</span>
                </div>
                <div className="col-span-1 p-2 border-r border-slate-500 flex flex-col justify-center">
                    <span>الكمية</span>
                    <span>Quantity</span>
                </div>
                <div className="col-span-2 p-2 border-r border-slate-500 flex flex-col justify-center">
                    <span>قيمة الضريبة</span>
                    <span>Total Amount</span>
                </div>
                <div className="col-span-3 p-2 flex flex-col justify-center">
                    <span>الاجمالي مع الضريبة</span>
                    <span>Total Amount with VAT</span>
                </div>
            </div>

            {invoice.items.map((item, index) => {
                const lineSubtotal = Number(item.total);
                const lineVat = hasVat ? lineSubtotal * 0.15 : 0;
                const lineTotalWithVat = lineSubtotal + lineVat;

                return (
                    <div key={item.id} className="grid grid-cols-12 border-b border-slate-400 text-center text-[11px] font-bold text-slate-900">
                        <div className="col-span-1 p-2 border-r border-slate-400 py-3">{index + 1}</div>
                        <div className="col-span-4 p-2 border-r border-slate-400 py-3 uppercase">{item.description}</div>
                        <div className="col-span-1 p-2 border-r border-slate-400 py-3">{Number(item.price).toFixed(0)}</div>
                        <div className="col-span-1 p-2 border-r border-slate-400 py-3">{item.quantity}</div>
                        <div className="col-span-2 p-2 border-r border-slate-400 py-3">{formatCurrency(lineSubtotal)}</div>
                        <div className="col-span-3 p-2 py-3">{formatCurrency(lineTotalWithVat)}</div>
                    </div>
                );
            })}

            {/* --- FOOTER SUMMARY --- */}
            <div className="grid grid-cols-12 border-b border-slate-400">
                <div className="col-span-9 border-r border-slate-400 p-2 text-center">
                    <div className="font-bold text-slate-900 text-[11px]">الكمية الإجمالية</div>
                    <div className="font-bold text-slate-900 text-[11px]">Total Quantity:</div>
                </div>
                <div className="col-span-3 p-2 flex items-center justify-center font-bold text-slate-700 text-sm">
                    {totalQty}
                </div>
            </div>

            <div className="grid grid-cols-12 border-b border-slate-400">
                <div className="col-span-9 border-r border-slate-400 p-2 text-center">
                    <div className="font-bold text-slate-900 text-[11px]">الاجمالي قبل الضريبة</div>
                    <div className="font-bold text-slate-900 text-[11px]">Total before VAT:</div>
                </div>
                <div className="col-span-3 p-2 flex items-center justify-center font-bold text-slate-900 text-sm">
                    SR {formatCurrency(Number(invoice.totalBeforeVat))}
                </div>
            </div>

            <div className="grid grid-cols-12 border-b border-slate-400">
                <div className="col-span-9 border-r border-slate-400 p-2 text-center">
                    <div className="font-bold text-slate-900 text-[11px]">الاجمالي بعد الضريبة</div>
                    <div className="font-bold text-slate-900 text-[11px]">Total VAT Amount:</div>
                </div>
                <div className="col-span-3 p-2 flex items-center justify-center font-bold text-slate-900 text-sm">
                    SR {formatCurrency(Number(invoice.vatAmount))}
                </div>
            </div>

             <div className="grid grid-cols-12">
                <div className="col-span-9 border-r border-slate-400 p-2 text-center">
                    <div className="font-bold text-slate-900 text-[11px]">الرصيد المستحق</div>
                    <div className="font-bold text-slate-900 text-[11px]">Due Amount:</div>
                </div>
                <div className="col-span-3 p-2 flex items-center justify-center font-bold text-slate-900 text-sm">
                    SR {formatCurrency(Number(invoice.totalAmount))}
                </div>
            </div>
        </div>

      </div>

    </div>
  );
}