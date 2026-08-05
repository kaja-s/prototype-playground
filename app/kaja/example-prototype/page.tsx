import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Example Prototype",
  description: "",
};

const data = {
  name: "Example Prototype",
  description: "",
} as const;

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16 opacity-100 transition-opacity duration-300 ease-out starting:opacity-0 motion-reduce:transition-none">
      <Link
        href="/"
        className="text-sm text-gray-400 transition-colors duration-150 ease-[var(--ease-out)] hover:text-gray-600 hover:underline dark:text-gray-500 dark:hover:text-gray-300"
      >
        ← Prototype Playground
      </Link>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
        {data.name}
      </h1>
      {data.description && (
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
          {data.description}
        </p>
      )}

      <div className="mt-10 rounded-lg border border-dashed border-gray-300 p-10 text-center text-sm text-gray-400 dark:border-gray-700 dark:text-gray-500">
        Start building your prototype here.
      </div>
    </div>
  );
}
