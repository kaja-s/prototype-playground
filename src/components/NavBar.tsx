"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import NewPrototypeButton from "./NewPrototypeButton";
import FlaskIcon from "../icons/FlaskIcon";

const tabs = [
  { href: "/", label: "Prototypes" },
  { href: "/templates", label: "Templates" },
  { href: "/design-system", label: "Design System" },
];

export default function NavBar() {
  const pathname = usePathname();
  const activeIndex = tabs.findIndex((tab) => tab.href === pathname);

  const navRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ x: 0, scale: 0 });

  useEffect(() => {
    function measure() {
      const navEl = navRef.current;
      const tabEl = tabRefs.current[activeIndex];
      if (!navEl || !tabEl) return;
      setIndicator({
        x: tabEl.offsetLeft,
        scale: tabEl.offsetWidth / navEl.offsetWidth,
      });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeIndex]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
          <FlaskIcon className="text-black" />
          Prototype Playground
        </h1>
        <NewPrototypeButton />
      </div>

      <nav
        ref={navRef}
        aria-label="Sections"
        className="relative mt-6 flex gap-6 border-b border-border"
      >
        {tabs.map((tab, i) => {
          const active = i === activeIndex;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              aria-current={active ? "page" : undefined}
              className={`-mb-px rounded-sm pb-3 text-sm font-medium transition-colors duration-150 ease-[var(--ease-out)] active:scale-[0.98] motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left bg-primary transition-transform duration-200 ease-[var(--ease-in-out)] motion-reduce:transition-none"
          style={{ transform: `translateX(${indicator.x}px) scaleX(${indicator.scale})` }}
        />
      </nav>
    </div>
  );
}
