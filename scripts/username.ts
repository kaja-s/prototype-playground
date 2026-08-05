import { execSync } from "node:child_process";
import os from "node:os";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getUsername(): string {
  try {
    const gitName = execSync("git config user.name", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    const slug = slugify(gitName);
    if (slug) return slug;
  } catch {
    // no git config available, fall through to OS username
  }
  return slugify(os.userInfo().username) || "developer";
}
