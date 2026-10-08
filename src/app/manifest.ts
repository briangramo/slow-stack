import type { MetadataRoute } from "next";
import { withBase } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Slow Stack",
    short_name: "Slow Stack",
    description:
      "Motion snacks for your workday. Desk exercises and micro workouts, one small move at a time.",
    id: withBase("/"),
    start_url: withBase("/"),
    scope: withBase("/"),
    display: "standalone",
    orientation: "portrait",
    background_color: "#fff8f0",
    theme_color: "#fff8f0",
    categories: ["health", "fitness", "lifestyle"],
    icons: [
      { src: withBase("/icons/icon-192.png"), sizes: "192x192", type: "image/png", purpose: "any" },
      { src: withBase("/icons/icon-512.png"), sizes: "512x512", type: "image/png", purpose: "any" },
      { src: withBase("/icons/icon-maskable-192.png"), sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: withBase("/icons/icon-maskable-512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
