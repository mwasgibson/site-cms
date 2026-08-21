"use client";
import { useRouter } from "next/navigation";
import {
  BlogPostForm,
  type BlogPostFormValues,
} from "@/components/BlogPostForm";
import { apiFetch } from "@/lib/api";

export default function NewBlogPostPage() {
  const router = useRouter();
  async function handleSubmit(values: BlogPostFormValues) {
    await apiFetch("/api/v1/admin/blog-posts", {
      method: "POST",
      body: {
        ...values,
        published_at: values.published_at
          ? new Date(values.published_at).toISOString()
          : null,
      },
    });
    router.push("/blog-posts");
  }
  return (
    <div>
      <h1 className="text-lg font-semibold text-slate-900">New blog post</h1>
      <div className="mt-6">
        <BlogPostForm onSubmit={handleSubmit} submitLabel="Create post" />
      </div>
    </div>
  );
}
