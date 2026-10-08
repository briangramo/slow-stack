/** Deploy-time site settings. Both are inlined at build time. */

/** Path prefix the app is served under, e.g. "/slow-stack". Empty at the domain root. */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(
  /\/$/,
  ""
);

/** Public origin plus base path, no trailing slash. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://briangramo.github.io/slow-stack"
).replace(/\/$/, "");

/** Prefix a root-relative public asset path with the base path. */
export function withBase(path: string): string {
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
