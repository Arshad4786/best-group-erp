import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react"; // Import ArrowLeft
import Link from "next/link"; // Import Link
import PrintButton from "@/components/print-button"; // Import the new button

export default async function PrintQuotationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const quote = await prisma.quotation.findUnique({
    where: { id },
    include: { items: true }
  });

  if (!quote) return notFound();

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      
      {/* ACTION BAR (Back + Print) */}
      <div className="w-full max-w-[210mm] mb-6 flex justify-between items-center print:hidden">
        <Link 
          href="/quotations" 
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to List
        </Link>
        
        {/* Use the new Client Component here */}
        <PrintButton />
      </div>

      {/* A4 PAPER CONTAINER */}
      <div className="bg-white w-full max-w-[210mm] min-h-[297mm] p-[15mm] shadow-2xl print:shadow-none print:w-full print:max-w-none text-black">
        
        {/* HEADER */}
        <div className="flex justify-between items-end mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Quotation</h1>
          <div className="text-right">
            <p className="font-bold">Date: {new Date(quote.issueDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* INFO BLOCK */}
        <div className="mb-6 space-y-1 text-sm">
          <div className="flex">
            <span className="font-bold w-24">To:</span>
            <span>{quote.quotationFor}</span>
          </div>
          <div className="flex">
            <span className="font-bold w-24">Attention:</span>
            <span>{quote.attention}</span>
          </div>
          <div className="flex">
            <span className="font-bold w-24">Location:</span>
            <span>{quote.location}</span>
          </div>
        </div>

        {/* SUBJECT */}
        <div className="mb-6">
          <p className="font-bold underline text-sm">Subject: {quote.project}</p>
        </div>

        {/* INTRO */}
        <p className="text-sm mb-6 text-justify leading-relaxed">
          We provide excellent services to various companies in Kingdom of Saudi Arabia with our skilled, semi-skilled, and non-skilled workers. We are pleased to quote our best and competitive price and wages per/{quote.rateType.toLowerCase()} mentioned as follow:
        </p>

        {/* TABLE */}
        <div className="mb-8 border border-gray-400">
          <div className="grid grid-cols-12 bg-gray-200 text-xs font-bold border-b border-gray-400 text-center">
            <div className="col-span-1 py-2 border-r border-gray-400">SL</div>
            <div className="col-span-7 py-2 border-r border-gray-400">DESCRIPTIONS</div>
            <div className="col-span-4 py-2">RATE OF PER {quote.rateType}</div>
          </div>
          {quote.items.map((item, i) => (
            <div key={item.id} className="grid grid-cols-12 text-xs border-b border-gray-400 last:border-b-0">
              <div className="col-span-1 py-2 border-r border-gray-400 text-center font-bold">{i + 1}</div>
              <div className="col-span-7 py-2 border-r border-gray-400 px-2 font-bold">{item.description}</div>
              <div className="col-span-4 py-2 text-center font-bold">{Number(item.rate).toFixed(2)}</div>
            </div>
          ))}
        </div>

        {/* TERMS */}
        <div className="mb-8">
          <h3 className="font-bold text-sm mb-2">Terms & Conditions</h3>
          <ol className="list-decimal list-inside text-xs space-y-1.5 leading-relaxed">
            <li>Daily basic duty will be <span className="font-bold">{quote.workingHours}</span>. Fridays, Government holidays or the exceeding duty hours will be charged as overtime, that is 1.5% (as per Saudi Labour Law) of the basic salary.</li>
            <li>Food, Accommodation & Transportation will be provided by <span className="font-bold">{quote.firstParty || '1st Party'}</span>.</li>
            <li>Safety gear, gate pass, ID and all other work-related equipment and materials will be provided by <span className="font-bold">{quote.quotationFor}</span>.</li>
            <li>The contract will be a minimum of <span className="font-bold">{quote.duration}</span> from the signature of both parties. Labor will move or transfer to any projects, anywhere in Saudi Arabia.</li>
            <li>After submission of invoice, payment must be made within <span className="font-bold">{quote.invoiceDays}</span> days.</li>
          </ol>
        </div>

        {/* SPECIAL ARTICLE */}
        {quote.specialArticle && (
          <div className="mb-8 text-center">
            <p className="font-bold text-xs uppercase">{quote.specialArticle}</p>
            <p className="text-xs mt-1">ALL OTHER FACILITIES AS SAUDI ARABIA LABOR LAW'S.</p>
          </div>
        )}

        <p className="text-xs mb-8">
          Looking forward to your approval & their mobilization to the project. If you have any questions or need of any clarification above the work, please feel free to contact us.
        </p>

        {/* FOOTER */}
        <div className="mt-auto">
          <p className="text-sm font-bold mb-1">Thank you & Best Regards,</p>
          <div className="mt-4">
            <p className="text-lg font-bold">{quote.quotationBy}</p>
            <p className="text-xs">{quote.contactNo}</p>
            <p className="text-xs">{quote.contactEmail}</p>
          </div>
        </div>

      </div>
    </div>
  );
}