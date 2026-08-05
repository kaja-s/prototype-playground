import { prototypes as kajaPrototypes } from "./kaja/prototypes";

export type Prototype = {
  slug: string;
  title: string;
  author: string;
  date: string;
  href: string;
};

// Add your person folder here: create `app/<you>/prototypes.ts` exporting
// a `prototypes` array (see app/kaja/prototypes.ts), then register it below.
const authors = [{ author: "kaja", prototypes: kajaPrototypes }];

export const allPrototypes: Prototype[] = authors.flatMap(({ author, prototypes }) =>
  prototypes.map((p) => ({
    ...p,
    author,
    href: `/${author}/${p.slug}`,
  }))
);

export function groupByMonth(items: Prototype[]) {
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date));
  const groups = new Map<string, Prototype[]>();

  for (const item of sorted) {
    const label = new Date(item.date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(item);
  }

  return Array.from(groups.entries());
}
