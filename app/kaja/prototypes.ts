export type Prototype = {
  slug: string;
  title: string;
  description?: string;
  date: string;
};

export const prototypes: Prototype[] = [
  {
    slug: "new-test",
    title: "new-test",
    description: "test prototype",
    date: "2026-08-05",
  },
  {
    slug: "example-prototype",
    title: "Example Prototype",
    date: "2026-08-05",
  },
];
