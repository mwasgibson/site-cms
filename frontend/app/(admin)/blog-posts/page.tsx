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
        <h1 className="text-lg font-semibold text-slate-900">Blog posts</h1>
        <Link
          href="/blog-posts/new"
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white"
        >
          New post
        </Link>
      </div>

      {posts === null && (
        <p className="mt-6 text-sm text-slate-500">Loading…</p>
      )}
      {posts?.length === 0 && (
        <p className="mt-6 text-sm text-slate-500">No posts yet.</p>
      )}

      <ul className="mt-6 divide-y divide-slate-200 rounded-lg border bg-white">
        {posts?.map((post) => (
          <li
            key={post.id}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">
                {post.title}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                /{post.slug} · {post.published_at ? "published" : "draft"}
              </p>
            </div>
            <div className="flex shrink-0 gap-3 text-sm">
              <Link
                href={`/blog-posts/${post.id}`}
                className="text-slate-600 hover:underline"
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
