"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPrototypeButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) nameRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (process.env.NODE_ENV !== "development") return null;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/prototypes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setOpen(false);
      setName("");
      setDescription("");
      router.push(`/kaja/${data.slug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full bg-gray-900 px-3.5 py-1.5 text-sm font-medium text-white transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97] motion-reduce:transform-none dark:bg-gray-50 dark:text-gray-900"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M7 1v12M1 7h12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        New
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 opacity-100 transition-opacity duration-200 ease-out starting:opacity-0 motion-reduce:transition-none dark:bg-black/50"
            onClick={() => setOpen(false)}
          />
          <form
            onSubmit={handleCreate}
            className="relative w-full max-w-sm origin-center rounded-xl border border-gray-200 bg-white p-6 opacity-100 shadow-xl transition-[transform,opacity] duration-200 ease-[var(--ease-out)] starting:scale-95 starting:opacity-0 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900"
          >
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-50">
              New prototype
            </h2>

            <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
              <input
                ref={nameRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 outline-none transition-colors duration-150 focus:border-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50 dark:focus:border-gray-50"
                placeholder="Magic Dashboard"
              />
            </label>

            <label className="mt-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 w-full resize-none rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 outline-none transition-colors duration-150 focus:border-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50 dark:focus:border-gray-50"
                placeholder="What is this prototype exploring?"
              />
            </label>

            {error && (
              <p className="mt-3 text-sm text-red-500 dark:text-red-400">{error}</p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full px-3.5 py-1.5 text-sm font-medium text-gray-500 transition-colors duration-150 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-gray-900 px-3.5 py-1.5 text-sm font-medium text-white transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97] disabled:opacity-50 motion-reduce:transform-none dark:bg-gray-50 dark:text-gray-900"
              >
                {submitting ? "Creating…" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
