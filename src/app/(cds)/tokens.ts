/*
 * Mirrors src/app/(cds)/tokens.css — keep both in sync if the Figma
 * "Theme" variable collection changes. This file exists so the design
 * system page can render swatches without parsing CSS at runtime.
 */

export type ColorToken = {
  name: string;
  light: string;
  dark: string;
};

export type ColorTokenGroup = {
  title: string;
  tokens: ColorToken[];
};

export const colorTokenGroups: ColorTokenGroup[] = [
  {
    title: "Surfaces",
    tokens: [
      { name: "background", light: "#fcfbf8", dark: "#0f0f0f" },
      { name: "foreground", light: "#0f0f0f", dark: "#ffffff" },
      { name: "card", light: "#fcfbf8", dark: "#121212" },
      { name: "card-foreground", light: "#0f0f0f", dark: "#ffffff" },
      { name: "popover", light: "#ffffff", dark: "#363635" },
      { name: "popover-foreground", light: "#0f0f0f", dark: "#ffffff" },
    ],
  },
  {
    title: "Brand",
    tokens: [
      { name: "primary", light: "#e0ff6e", dark: "#e0ff6e" },
      { name: "primary-foreground", light: "#0f0f0f", dark: "#0f0f0f" },
      { name: "primary-hover", light: "#b4cc58", dark: "#b4cc58" },
      { name: "accent", light: "#e0ff6e", dark: "#e0ff6e" },
      { name: "accent-foreground", light: "#0f0f0f", dark: "#0f0f0f" },
      { name: "ring", light: "#e0ff6e", dark: "#e0ff6e" },
    ],
  },
  {
    title: "Secondary & muted",
    tokens: [
      { name: "secondary", light: "#f7f4ed", dark: "#1a1a1a" },
      { name: "secondary-foreground", light: "#0f0f0f", dark: "#ffffff" },
      { name: "muted", light: "#f7f4ed", dark: "#121212" },
      { name: "muted-foreground", light: "#666666", dark: "#808080" },
    ],
  },
  {
    title: "Borders",
    tokens: [
      { name: "border", light: "#eceae4", dark: "#333333" },
      { name: "input", light: "#eceae4", dark: "#333333" },
    ],
  },
  {
    title: "Destructive",
    tokens: [
      { name: "destructive", light: "#d00505", dark: "#d00505" },
      { name: "destructive-foreground", light: "#ffffff", dark: "#ffffff" },
      { name: "destructive-hover", light: "#a00404", dark: "#a00404" },
    ],
  },
  {
    title: "Status — error",
    tokens: [
      { name: "error", light: "#d00505", dark: "#f57177" },
      { name: "error-foreground", light: "#d00505", dark: "#f57177" },
      { name: "error-background", light: "#fef2f2", dark: "#42090a" },
      { name: "error-border", light: "#fca5a5", dark: "#6d0f15" },
    ],
  },
  {
    title: "Status — warning",
    tokens: [
      { name: "warning", light: "#78350f", dark: "#fbbf24" },
      { name: "warning-foreground", light: "#78350f", dark: "#fbbf24" },
      { name: "warning-background", light: "#fffbeb", dark: "#451a03" },
      { name: "warning-border", light: "#fde68a", dark: "#78350f" },
    ],
  },
  {
    title: "Status — success",
    tokens: [
      { name: "success", light: "#0f0f0f", dark: "#ffffff" },
      { name: "success-foreground", light: "#0f0f0f", dark: "#ffffff" },
      { name: "success-background", light: "#f7f4ed", dark: "#1a1a1a" },
      { name: "success-border", light: "#eceae4", dark: "#4f4f4e" },
    ],
  },
  {
    title: "Sidebar",
    tokens: [
      { name: "sidebar", light: "#fcfbf8", dark: "#0f0f0f" },
      { name: "sidebar-foreground", light: "#666666", dark: "#808080" },
      { name: "sidebar-primary", light: "#e0ff6e", dark: "#e0ff6e" },
      { name: "sidebar-primary-foreground", light: "#0f0f0f", dark: "#0f0f0f" },
      { name: "sidebar-accent", light: "#f7f4ed", dark: "#1a1a1a" },
      { name: "sidebar-accent-foreground", light: "#0f0f0f", dark: "#ffffff" },
      { name: "sidebar-border", light: "#eceae4", dark: "#333333" },
      { name: "sidebar-ring", light: "#e0ff6e", dark: "#e0ff6e" },
    ],
  },
];

export const radiusTokens = [
  { name: "radius-sm", value: "4px" },
  { name: "radius-md", value: "6px" },
  { name: "radius-lg", value: "8px" },
  { name: "radius-xl", value: "12px" },
  { name: "radius-full", value: "9999px" },
];
