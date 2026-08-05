import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Example Prototype",
  description: "",
};

const data = {
  name: "Example Prototype",
  description: "",
  filePath:
    "/Users/kajaskerlj/Dev/personal/prototype-playground/src/app/kaja/example-prototype/page.tsx",
} as const;

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 opacity-100 transition-opacity duration-300 ease-out starting:opacity-0 motion-reduce:transition-none dark:bg-black">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          {data.name}
        </h1>
        {data.description && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {data.description}
          </p>
        )}

        <div className="mt-6 flex items-center justify-center gap-2">
          <Link
            href="/"
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors duration-150 ease-[var(--ease-out)] hover:bg-gray-200 active:scale-[0.97] motion-reduce:transform-none dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Go Back
          </Link>
          <a
            href={`cursor://file${data.filePath}`}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 ease-[var(--ease-out)] hover:bg-blue-600 active:scale-[0.97] motion-reduce:transform-none dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Open in Cursor
          </a>
        </div>
      </div>
    </div>
  );
}
