import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

function slugify(input: string) {
  const slug = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "prototype";
}

async function pathExists(target: string) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function uniqueSlug(kajaDir: string, base: string) {
  let candidate = base;
  let i = 2;
  while (await pathExists(path.join(kajaDir, candidate))) {
    candidate = `${base}-${i}`;
    i++;
  }
  return candidate;
}

function pageTemplate(name: string, description: string) {
  return `import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: ${JSON.stringify(name)},
  description: ${JSON.stringify(description)},
};

const data = {
  name: ${JSON.stringify(name)},
  description: ${JSON.stringify(description)},
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
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">{data.description}</p>
      )}

      <div className="mt-10 rounded-lg border border-dashed border-gray-300 p-10 text-center text-sm text-gray-400 dark:border-gray-700 dark:text-gray-500">
        Start building your prototype here.
      </div>
    </div>
  );
}
`;
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Creating prototypes is only available when running locally" },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const description =
    typeof body?.description === "string" ? body.description.trim() : "";

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const kajaDir = path.join(process.cwd(), "app", "kaja");
  const slug = await uniqueSlug(kajaDir, slugify(name));
  const prototypeDir = path.join(kajaDir, slug);

  await fs.mkdir(prototypeDir, { recursive: true });
  await fs.writeFile(
    path.join(prototypeDir, "page.tsx"),
    pageTemplate(name, description),
    "utf8"
  );

  const dataFilePath = path.join(kajaDir, "prototypes.ts");
  const dataFile = await fs.readFile(dataFilePath, "utf8");
  const date = new Date().toISOString().slice(0, 10);
  const entry = `  {
    slug: ${JSON.stringify(slug)},
    title: ${JSON.stringify(name)},
    description: ${JSON.stringify(description)},
    date: ${JSON.stringify(date)},
  },\n`;
  const updated = dataFile.replace(
    /export const prototypes: Prototype\[\] = \[\s*\n/,
    (match) => `${match}${entry}`
  );
  await fs.writeFile(dataFilePath, updated, "utf8");

  return NextResponse.json({ slug });
}
