"use client";

import { useRouter } from "next/navigation";
import {
  TestimonialForm,
  type TestimonialFormValues,
} from "@/components/TestimonialForm";
import { apiFetch } from "@/lib/api";

export default function NewTestimonialPage() {
  const router = useRouter();

  async function handleSubmit(values: TestimonialFormValues) {
    await apiFetch("/api/v1/admin/testimonials", {
      method: "POST",
      body: values,
    });
    router.push("/testimonials");
  }

  return (
    <div>
      <h1 className="text-lg font-semibold text-ink">New testimonial</h1>
      <div className="mt-6">
        <TestimonialForm
          onSubmit={handleSubmit}
          submitLabel="Create testimonial"
        />
      </div>
    </div>
  );
}
