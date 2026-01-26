import prisma from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PrintButton from "@/components/print-button";

// --- Helper Component ---
function DetailRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="grid grid-cols-[40%_60%] sm:grid-cols-[35%_65%] w-full break-inside-avoid border-b border-slate-200">
      <div className="bg-slate-50 p-3 text-sm font-bold text-slate-700 border-r border-slate-200 flex items-center print:bg-gray-100 print:text-[10px] print:p-1 print:leading-tight">
        {label}
      </div>
      <div className="p-3 text-sm text-slate-900 font-medium border-r border-slate-200 flex items-center break-words print:text-[10px] print:p-1 print:leading-tight">
        {value || "-"}
      </div>
    </div>
  );
}

interface PageProps {
  params: Promise<{
    employeeId: string;
  }>;
}

export default async function EmployeeDetailsPage({ params }: PageProps) {
  const { employeeId } = await params;

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: { company: true, project: true },
  });

  if (!employee) return notFound();

  const formatDate = (date: Date | null) =>
    date ? new Date(date).toLocaleDateString("en-GB") : "-";

  return (
    // ⬇️ relative needed for watermark positioning
    <div className="relative max-w-7xl mx-auto space-y-6 pb-12 print:p-0 print:max-w-none print:space-y-2">

      {/* --- PRINT HEADER --- */}
      <div className="h-0 overflow-hidden print:h-auto print:overflow-visible flex flex-col items-start justify-center mb-0 print:mb-2 border-b-0 print:border-b border-slate-900 pb-0 print:pb-2">
        {employee.company?.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={employee.company.logoUrl}
            alt={employee.company.name}
            className="h-24 print:h-16 object-contain mb-4 print:mb-1"
            loading="eager"
          />
        ) : (
          <h2 className="text-3xl print:text-xl font-bold uppercase mb-2">
            {employee.company?.name}
          </h2>
        )}
        <h1 className="text-xl print:text-lg font-bold uppercase tracking-wide">
          Employee Information Sheet
        </h1>
      </div>

      {/* --- LOGO WATERMARK (PRINT ONLY) --- */}
      {employee.company?.logoUrl && (
        <div className="pointer-events-none absolute inset-0 hidden print:flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={employee.company.logoUrl}
            alt="Watermark"
            className="
              w-75
              opacity-10
              select-none
              object-contain
              print:opacity-10
            "
          />
        </div>
      )}

      {/* --- SCREEN HEADER (Hidden on Print) --- */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Link
            href="/hr/employees"
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Employee details</h1>
            <p className="text-sm text-slate-500">
              View and print employee information
            </p>
          </div>
        </div>

        {/* --- PRINT BUTTON --- */}
        <PrintButton />
      </div>

      {/* --- DETAILS GRID --- */}
      <div className="bg-white border-t border-l border-slate-200 shadow-sm print:shadow-none print:border-slate-300">
        <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 print:gap-x-2">

          {/* LEFT COLUMN */}
          <div className="flex flex-col">
            <DetailRow label="Employee ID" value={employee.employeeId} />
            <DetailRow label="Gender" value={employee.gender} />
            <DetailRow label="Date of birth" value={formatDate(employee.dateOfBirth)} />
            <DetailRow label="Project Name" value={employee.project?.name} />
            <DetailRow
              label="Basic salary"
              value={employee.basicSalary ? Number(employee.basicSalary) : "-"}
            />
            <DetailRow label="Work Shift" value={employee.workShift} />
            <DetailRow label="Border Number" value={employee.employeeId} />
            <DetailRow label="Iqama Number" value={employee.iqamaNumber} />
            <DetailRow label="References" value={employee.referenceRL} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col">
            <DetailRow label="Employee Name" value={employee.fullName} />
            <DetailRow label="Company Name" value={employee.company?.name} />
            <DetailRow label="Nationality" value={employee.nationality} />
            <DetailRow label="Passport Number" value={employee.passportNumber} />
            <DetailRow label="MOL ID" value={employee.molId} />
            <DetailRow label="Experience" value={employee.experience} />
            <DetailRow label="Leave policy" value={employee.leavePolicy} />
            <DetailRow label="KSA Entry date" value={formatDate(employee.entryDate)} />
            {/* FIXED: Connected real database value here */}
            <DetailRow label="Iqama Expiry date" value={formatDate(employee.iqamaExpiryDate)} />
            <DetailRow label="Remarks" value={employee.remarks} />
          </div>

        </div>
      </div>

      {/* --- FOOTER (PRINT ONLY) --- */}
      <div className="hidden print:block text-[10px] text-center text-slate-400 mt-4">
        Printed on {new Date().toLocaleDateString()}
      </div>
    </div>
  );
}