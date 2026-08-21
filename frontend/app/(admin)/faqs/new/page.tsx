"use client";

import { useRouter } from "next/navigation";
import { FaqForm, type FaqFormValues } from "@/components/FaqForm";
import { apiFetch } from "@/lib/api";

export default function NewFaqPage() {
  const router = useRouter();

  async function handleSubmit(values: FaqFormValues) {
    await apiFetch("/api/v1/admin/faqs", { method: "POST", body: values });
    router.push("/faqs");
  }

  return (
    <div>
      <h1 className="text-lg font-semibold text-slate-900">New FAQ</h1>
      <div className="mt-6">
        <FaqForm onSubmit={handleSubmit} submitLabel="Create FAQ" />
      </div>
    </div>
  );
}
