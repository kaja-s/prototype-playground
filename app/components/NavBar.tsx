"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import NewPrototypeButton from "./NewPrototypeButton";

const tabs = [
  { href: "/", label: "Prototypes" },
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
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
          <span aria-hidden className="-translate-y-px">
            🧪
          </span>
          Prototype Playground
        </h1>
        <NewPrototypeButton />
      </div>

      <nav
        ref={navRef}
        aria-label="Sections"
        className="relative mt-6 flex gap-6 border-b border-gray-200 dark:border-gray-800"
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
              className={`-mb-px pb-3 text-sm font-medium transition-colors duration-150 ease-[var(--ease-out)] active:scale-[0.98] motion-reduce:transform-none ${
                active
                  ? "text-gray-900 dark:text-gray-50"
                  : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gray-900 transition-transform duration-200 ease-[var(--ease-in-out)] motion-reduce:transition-none dark:bg-gray-50"
          style={{ transform: `translateX(${indicator.x}px) scaleX(${indicator.scale})` }}
        />
      </nav>
    </div>
  );
}
