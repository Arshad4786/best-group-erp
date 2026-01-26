import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import ClientEditForm from "@/components/client-edit-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ clientId: string }>;
}

export default async function EditClientPage({ params }: PageProps) {
  const { clientId } = await params;

  const client = await prisma.client.findUnique({
    where: { id: clientId },
  });

  if (!client) return notFound();

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link 
          href="/clients" 
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Client</h1>
          <p className="text-sm text-slate-500">Update client details</p>
        </div>
      </div>

      <ClientEditForm client={client} />
    </div>
  );
}