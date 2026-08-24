"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  BlogPostForm,
  type BlogPostFormValues,
} from "@/components/BlogPostForm";
import { apiFetch } from "@/lib/api";
interface BlogPostApiShape {
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  cover_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
}
function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [initialValues, setInitialValues] = useState<BlogPostFormValues | null>(
    null,
  );
  useEffect(() => {
    apiFetch<BlogPostApiShape>(`/api/v1/admin/blog-posts/${params.id}`).then(
      (post) => {
        setInitialValues({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          body: post.body,
          cover_image_url: post.cover_image_url,
          seo_title: post.seo_title ?? "",
          seo_description: post.seo_description ?? "",
          published_at: toDatetimeLocal(post.published_at),
        });
      },
    );
  }, [params.id]);
  async function handleSubmit(values: BlogPostFormValues) {
    await apiFetch(`/api/v1/admin/blog-posts/${params.id}`, {
      method: "PUT",
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
      <h1 className="text-lg font-semibold text-ink">Edit blog post</h1>
      <div className="mt-6">
        {initialValues ? (
          <BlogPostForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            submitLabel="Save changes"
          />
        ) : (
          <p className="field-hint">Loading…</p>
        )}
      </div>
    </div>
  );
}
