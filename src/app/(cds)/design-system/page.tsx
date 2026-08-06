import CopyChip from "../../../components/CopyChip";
import { colorTokenGroups, radiusTokens } from "../tokens";

const nameChipClass = "-ml-1 truncate px-1 py-0.5 text-left text-foreground hover:bg-muted";

const hexChipClass = "px-1 py-0.5 text-muted-foreground hover:bg-muted";

function Swatch({ color }: { color: string }) {
  return (
    <span
      className="h-4 w-4 shrink-0 rounded border border-black/10 dark:border-white/10"
      style={{ background: color }}
      aria-hidden
    />
  );
}

export default function DesignSystemPage() {
  return (
    <div className="space-y-10">
      <p className="text-sm text-muted-foreground">
        Color tokens imported from the codeplain design system Figma file.
        Click a name to copy its CSS variable, or a hex value to copy that
        color.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <th className="w-1/2 py-2 pr-4">Token</th>
              <th className="w-1/4 py-2 pr-4">Light</th>
              <th className="w-1/4 py-2">Dark</th>
            </tr>
          </thead>
          {colorTokenGroups.map((group) => (
            <tbody key={group.title}>
              <tr>
                <td
                  colSpan={3}
                  className="pt-6 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {group.title}
                </td>
              </tr>
              {group.tokens.map((token) => (
                <tr
                  key={token.name}
                  className="border-b border-border/60 transition-colors duration-150 ease-[var(--ease-out)] hover:bg-muted/60"
                >
                  <td className="py-1.5 pr-4">
                    <div className="flex items-center gap-2">
                      <Swatch color={`var(--${token.name})`} />
                      <CopyChip
                        value={`var(--${token.name})`}
                        label={token.name}
                        className={nameChipClass}
                      />
                    </div>
                  </td>
                  <td className="py-1.5 pr-4">
                    <div className="flex items-center gap-2">
                      <Swatch color={token.light} />
                      <CopyChip
                        value={token.light}
                        label={token.light}
                        className={`${hexChipClass} font-mono`}
                      />
                    </div>
                  </td>
                  <td className="py-1.5">
                    <div className="flex items-center gap-2">
                      <Swatch color={token.dark} />
                      <CopyChip
                        value={token.dark}
                        label={token.dark}
                        className={`${hexChipClass} font-mono`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>

      <section>
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Radius
        </h2>
        <div className="mt-3 flex flex-wrap gap-4">
          {radiusTokens.map((token) => (
            <div key={token.name} className="flex flex-col items-center gap-2">
              <div
                className="h-14 w-14 border border-border bg-muted"
                style={{ borderRadius: `var(--${token.name})` }}
                aria-hidden
              />
              <CopyChip
                value={`var(--${token.name})`}
                label={token.name}
                className="px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-muted"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
