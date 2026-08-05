import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getUsername } from "./username";

export type CreatePrototypeInput = {
  name: string;
  description?: string;
  username?: string;
  cwd?: string;
};

export type CreatePrototypeResult = {
  slug: string;
  pageFilePath: string;
};

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

async function uniqueSlug(userDir: string, base: string) {
  let candidate = base;
  let i = 2;
  while (await pathExists(path.join(userDir, candidate))) {
    candidate = `${base}-${i}`;
    i++;
  }
  return candidate;
}

function pageTemplate(name: string, description: string, filePath: string) {
  return `import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: ${JSON.stringify(name)},
  description: ${JSON.stringify(description)},
};

const data = {
  name: ${JSON.stringify(name)},
  description: ${JSON.stringify(description)},
  filePath: ${JSON.stringify(filePath)},
} as const;

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 opacity-100 transition-opacity duration-300 ease-out starting:opacity-0 motion-reduce:transition-none dark:bg-black">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          {data.name}
        </h1>
        {data.description && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{data.description}</p>
        )}

        <div className="mt-6 flex items-center justify-center gap-2">
          <Link
            href="/"
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors duration-150 ease-[var(--ease-out)] hover:bg-gray-200 active:scale-[0.97] motion-reduce:transform-none dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Go Back
          </Link>
          <a
            href={\`cursor://file\${data.filePath}\`}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 ease-[var(--ease-out)] hover:bg-blue-600 active:scale-[0.97] motion-reduce:transform-none dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Open in Cursor
          </a>
        </div>
      </div>
    </div>
  );
}
`;
}

function starterPrototypesFile() {
  return `export type Prototype = {
  slug: string;
  title: string;
  description?: string;
  date: string;
};

export const prototypes: Prototype[] = [
];
`;
}

export async function createPrototype({
  name,
  description = "",
  username = getUsername(),
  cwd = process.cwd(),
}: CreatePrototypeInput): Promise<CreatePrototypeResult> {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error("Name is required");
  }

  const userDir = path.join(cwd, "src", "app", username);
  const dataFilePath = path.join(userDir, "prototypes.ts");

  await fs.mkdir(userDir, { recursive: true });
  if (!(await pathExists(dataFilePath))) {
    await fs.writeFile(dataFilePath, starterPrototypesFile(), "utf8");
  }

  const slug = await uniqueSlug(userDir, slugify(trimmedName));
  const prototypeDir = path.join(userDir, slug);

  await fs.mkdir(prototypeDir, { recursive: true });
  const pageFilePath = path.join(prototypeDir, "page.tsx");
  await fs.writeFile(
    pageFilePath,
    pageTemplate(trimmedName, description.trim(), pageFilePath),
    "utf8"
  );

  const dataFile = await fs.readFile(dataFilePath, "utf8");
  const date = new Date().toISOString().slice(0, 10);
  const entry = `  {
    slug: ${JSON.stringify(slug)},
    title: ${JSON.stringify(trimmedName)},
    description: ${JSON.stringify(description.trim())},
    date: ${JSON.stringify(date)},
  },\n`;
  const updated = dataFile.replace(
    /export const prototypes: Prototype\[\] = \[\s*\n/,
    (match) => `${match}${entry}`
  );
  await fs.writeFile(dataFilePath, updated, "utf8");

  return { slug, pageFilePath };
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
  const args = process.argv.slice(2);
  const getArg = (flag: string) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : undefined;
  };

  const name = getArg("--name");
  const description = getArg("--description") ?? "";
  const username = getArg("--username");

  if (!name) {
    console.error(
      'Usage: bun scripts/create-prototype.ts --name "Prototype Name" [--description "..."] [--username "..."]'
    );
    process.exit(1);
  }

  createPrototype({ name, description, username })
    .then(({ slug, pageFilePath }) => {
      console.log(JSON.stringify({ slug, pageFilePath }));
    })
    .catch((err) => {
      console.error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    });
}
