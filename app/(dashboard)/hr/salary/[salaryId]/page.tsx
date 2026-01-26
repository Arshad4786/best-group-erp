import prisma from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PrintButton from "@/components/print-button";

interface PageProps {
  params: Promise<{ salaryId: string }>;
}

export default async function SalaryDetailsPage({ params }: PageProps) {
  const { salaryId } = await params;

  // Fetch Salary with Employee AND Company details
  const salary = await prisma.salary.findUnique({
    where: { id: salaryId },
    include: {
      employee: {
        include: {
          company: true,
          project: true,
        },
      },
    },
  });

  if (!salary) return notFound();

  const emp = salary.employee;
  const company = emp.company;

  const formatMoney = (amount: any) => {
    return Number(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-GB");

  const basic = Number(salary.basicSalary);
  const perDay = basic / 30;
  const earnedBasic = perDay * salary.workingDays;
  const otAmount = salary.overtimeHours * Number(salary.overtimeRate);
  const gross = earnedBasic + otAmount;
  const totalDeductions =
    Number(salary.advance) + Number(salary.deductions);

  return (
    // ⬇️ relative needed for watermark positioning
    <div className="relative max-w-4xl mx-auto space-y-8 pb-12 print:p-0 print:max-w-none">

      {/* --- LOGO WATERMARK (PRINT ONLY) --- */}
      {company?.logoUrl && (
        <div className="pointer-events-none absolute inset-0 hidden print:flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={company.logoUrl}
            alt="Watermark"
            className="
              w-[400px]
              opacity-10
              select-none
              object-contain
              print:opacity-10
            "
          />
        </div>
      )}

      {/* --- SCREEN ONLY HEADER --- */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Link
            href="/hr/salary"
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Salary Slip</h1>
            <p className="text-sm text-slate-500">
              View and print monthly salary slip
            </p>
          </div>
        </div>
        <PrintButton />
      </div>

      {/* --- PRINTABLE SALARY SLIP --- */}
      <div className="bg-white border border-slate-200 shadow-sm print:shadow-none print:border-none p-8 print:p-0">

        {/* SLIP HEADER */}
        <div className="flex flex-col items-start justify-center border-b border-slate-900 pb-6 mb-6">
          <div className="h-0 overflow-hidden print:h-auto print:overflow-visible flex justify-center mb-0 print:mb-4">
            {company?.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={company.logoUrl}
                alt={company.name}
                className="h-20 object-contain"
                loading="eager"
              />
            ) : (
              <h2 className="text-2xl font-bold uppercase">
                {company?.name}
              </h2>
            )}
          </div>


          <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900">
            Payslip
          </h1>
          <p className="text-slate-500 font-medium">
            For the month of:{" "}
            {new Date(salary.date).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* EMPLOYEE DETAILS */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-8 text-sm">
          <div className="space-y-1">
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Employee Name:</span>
              <span className="font-bold text-slate-900 uppercase">
                {emp.fullName}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Designation:</span>
              <span className="font-medium text-slate-900">
                {emp.category || "-"}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Employee ID:</span>
              <span className="font-medium text-slate-900">
                {emp.employeeId}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Bank Account:</span>
              <span className="font-medium text-slate-900">
                {emp.accountNumber || "-"}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Working Days:</span>
              <span className="font-medium text-slate-900">
                {salary.workingDays} Days
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Invoice Date:</span>
              <span className="font-medium text-slate-900">
                {formatDate(salary.date)}
              </span>
            </div>
          </div>
        </div>

        {/* SALARY TABLE */}
        <div className="border border-slate-900 mb-8">
          <div className="grid grid-cols-2 bg-slate-100 border-b border-slate-900 font-bold text-sm">
            <div className="p-2 border-r border-slate-900 text-center">
              EARNINGS
            </div>
            <div className="p-2 text-center">DEDUCTIONS</div>
          </div>

          <div className="grid grid-cols-2 text-sm">
            <div className="border-r border-slate-900">
              <div className="flex justify-between p-2 border-b border-slate-200">
                <span>Basic Salary</span>
                <span>{formatMoney(basic)}</span>
              </div>
              <div className="flex justify-between p-2 border-b border-slate-200">
                <span>Earned ({salary.workingDays} days)</span>
                <span>{formatMoney(earnedBasic)}</span>
              </div>
              <div className="flex justify-between p-2 border-b border-slate-200">
                <span>
                  Overtime ({salary.overtimeHours} hrs @{" "}
                  {Number(salary.overtimeRate)})
                </span>
                <span>{formatMoney(otAmount)}</span>
              </div>
              <div className="p-2 h-12"></div>
            </div>

            <div>
              <div className="flex justify-between p-2 border-b border-slate-200">
                <span>Advance</span>
                <span>{formatMoney(salary.advance)}</span>
              </div>
              <div className="flex justify-between p-2 border-b border-slate-200">
                <span>Other Deductions</span>
                <span>{formatMoney(salary.deductions)}</span>
              </div>
              <div className="p-2 h-12"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 border-t border-slate-900 font-bold text-sm bg-slate-50">
            <div className="flex justify-between p-2 border-r border-slate-900">
              <span>Total Earnings</span>
              <span>{formatMoney(gross)}</span>
            </div>
            <div className="flex justify-between p-2">
              <span>Total Deductions</span>
              <span>{formatMoney(totalDeductions)}</span>
            </div>
          </div>
        </div>

        {/* NET PAY */}
        <div className="flex justify-end mb-12">
          <div className="bg-slate-900 text-white px-8 py-3 rounded-l-full print:rounded-none print:border print:border-slate-900 print:bg-transparent print:text-slate-900">
            <span className="font-medium mr-4">NET SALARY PAYABLE:</span>
            <span className="text-xl font-bold">
              {formatMoney(salary.totalAmount)} SAR
            </span>
          </div>
        </div>

        {/* SIGNATURES */}
        <div className="grid grid-cols-2 gap-20 pt-12 mt-12">
          <div className="text-center">
            <div className="border-t border-slate-400 w-3/4 mx-auto pt-2">
              <p className="text-xs font-bold text-slate-500 uppercase">
                Employee Signature
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-slate-400 w-3/4 mx-auto pt-2">
              <p className="text-xs font-bold text-slate-500 uppercase">
                Authorized Signatory
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-12 text-center text-[10px] text-slate-400">
          <p>
            This is a computer-generated document and does not require a
            physical signature.
          </p>
          <p>Printed on {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
