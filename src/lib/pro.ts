/** Client-side Slow Stack Pro unlock helpers. Never store the fallback code in plaintext. */

const FALLBACK_HASH =
  "10ccd086c2aa5b10e449f5b875c39841da4c254fbfbc4467b6ace0f7acf15b41";

export const GUMROAD_BUY_URL = "https://valvoflow.gumroad.com/l/slowstackpro";

export async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Accept static fallback code via SHA-256 of trimmed uppercase input. */
export async function matchesFallbackCode(raw: string): Promise<boolean> {
  const normalized = raw.trim().toUpperCase();
  if (!normalized) return false;
  const hash = await sha256Hex(normalized);
  return hash === FALLBACK_HASH;
}

interface GumroadVerifyResponse {
  success?: boolean;
  purchase?: {
    refunded?: boolean;
    chargebacked?: boolean;
  };
}

/**
 * Verify a Gumroad license key against product_id from env.
 * Returns true only when success && !refunded && !chargebacked.
 * Skips (returns null) when NEXT_PUBLIC_GUMROAD_PRODUCT_ID is empty.
 */
export async function verifyGumroadLicense(
  licenseKey: string
): Promise<boolean | null> {
  const productId = (
    process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_ID ?? ""
  ).trim();
  if (!productId) return null;

  const body = new URLSearchParams();
  body.set("product_id", productId);
  body.set("license_key", licenseKey.trim());
  body.set("increment_uses_count", "false");

  const res = await fetch("https://api.gumroad.com/v2/licenses/verify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) return false;
  const data = (await res.json()) as GumroadVerifyResponse;
  if (!data.success) return false;
  const purchase = data.purchase ?? {};
  if (purchase.refunded || purchase.chargebacked) return false;
  return true;
}

export type UnlockResult =
  | { ok: true; method: "gumroad" | "fallback" }
  | { ok: false; error: string };

export async function tryUnlockPro(code: string): Promise<UnlockResult> {
  const trimmed = code.trim();
  if (!trimmed) {
    return { ok: false, error: "Paste a license key or unlock code." };
  }

  try {
    if (await matchesFallbackCode(trimmed)) {
      return { ok: true, method: "fallback" };
    }
  } catch {
    /* crypto unavailable, continue to Gumroad */
  }

  try {
    const gumroad = await verifyGumroadLicense(trimmed);
    if (gumroad === true) return { ok: true, method: "gumroad" };
    if (gumroad === false) {
      return {
        ok: false,
        error: "That license key did not verify. Double-check and try again.",
      };
    }
  } catch {
    return {
      ok: false,
      error: "Could not reach Gumroad. Check your connection and try again.",
    };
  }

  return {
    ok: false,
    error: "That code did not match. Check and try again.",
  };
}
