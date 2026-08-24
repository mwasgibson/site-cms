"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  published_at: string | null;
}

export default function BlogPostsPage() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);

  async function load() {
    setPosts(await apiFetch<BlogPost[]>("/api/v1/admin/blog-posts"));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Delete this post?")) return;
    await apiFetch(`/api/v1/admin/blog-posts/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-ink">Blog posts</h1>
        <Link
          href="/blog-posts/new"
          className="btn-primary"
        >
          New post
        </Link>
      </div>

      {posts === null && (
        <p className="mt-6 field-hint">Loading…</p>
      )}
      {posts?.length === 0 && (
        <p className="mt-6 field-hint">No posts yet.</p>
      )}

      <ul className="mt-6 divide-y divide-border panel">
        {posts?.map((post) => (
          <li
            key={post.id}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">
                {post.title}
              </p>
              <p className="mt-0.5 field-hint">
                /{post.slug} · {post.published_at ? "published" : "draft"}
              </p>
            </div>
            <div className="flex shrink-0 gap-3 text-sm">
              <Link
                href={`/blog-posts/${post.id}`}
                className="text-muted hover:text-ink hover:underline"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(post.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
