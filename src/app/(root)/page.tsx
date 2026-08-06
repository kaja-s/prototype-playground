import Link from "next/link";
import { allPrototypes, groupByMonth } from "../registry";

export default function Home() {
  const groups = groupByMonth(allPrototypes);

  return (
    <div className="space-y-8">
      {groups.length === 0 && (
        <p className="text-sm text-muted-foreground">No prototypes yet.</p>
      )}

      {groups.map(([month, items]) => (
        <section key={month}>
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {month}
          </h2>
          <ul className="mt-3 space-y-1">
            {items.map((prototype) => (
              <li key={prototype.href}>
                <Link
                  href={prototype.href}
                  className="group -mx-2 flex items-baseline gap-2 rounded-md px-2 py-1.5 transition-colors duration-150 ease-[var(--ease-out)] hover:bg-muted active:scale-[0.99] motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <span className="font-medium text-foreground decoration-muted-foreground/50 underline-offset-2 group-hover:underline">
                    {prototype.title}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {prototype.author}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
