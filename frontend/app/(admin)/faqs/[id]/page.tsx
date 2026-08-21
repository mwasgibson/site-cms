"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaqForm, type FaqFormValues } from "@/components/FaqForm";
import { apiFetch } from "@/lib/api";

export default function EditFaqPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [initialValues, setInitialValues] = useState<FaqFormValues | null>(
    null,
  );

  useEffect(() => {
    apiFetch<FaqFormValues>(`/api/v1/admin/faqs/${params.id}`).then(
      setInitialValues,
    );
  }, [params.id]);

  async function handleSubmit(values: FaqFormValues) {
    await apiFetch(`/api/v1/admin/faqs/${params.id}`, {
      method: "PUT",
      body: values,
    });
    router.push("/faqs");
  }

  return (
    <div>
      <h1 className="text-lg font-semibold text-slate-900">Edit FAQ</h1>
      <div className="mt-6">
        {initialValues ? (
          <FaqForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            submitLabel="Save changes"
          />
        ) : (
          <p className="text-sm text-slate-500">Loading…</p>
        )}
      </div>
    </div>
  );
}
