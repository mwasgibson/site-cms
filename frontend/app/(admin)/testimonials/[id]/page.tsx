"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  TestimonialForm,
  type TestimonialFormValues,
} from "@/components/TestimonialForm";
import { apiFetch } from "@/lib/api";

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [initialValues, setInitialValues] =
    useState<TestimonialFormValues | null>(null);

  useEffect(() => {
    apiFetch<TestimonialFormValues>(
      `/api/v1/admin/testimonials/${params.id}`,
    ).then(setInitialValues);
  }, [params.id]);

  async function handleSubmit(values: TestimonialFormValues) {
    await apiFetch(`/api/v1/admin/testimonials/${params.id}`, {
      method: "PUT",
      body: values,
    });
    router.push("/testimonials");
  }

  return (
    <div>
      <h1 className="text-lg font-semibold text-slate-900">Edit testimonial</h1>
      <div className="mt-6">
        {initialValues ? (
          <TestimonialForm
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
