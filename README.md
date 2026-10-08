# Slow Stack

Motion snacks for your workday. Slow Stack serves one small desk exercise or micro workout at a time, picked to balance what you have already done today. Free, no account, works offline as an installable PWA.

- Live app: https://briangramo.github.io/slow-stack/
- Slow Stack Pro ($4.99, one time): https://valvoflow.gumroad.com/l/slowstackpro

## Features

- One nudge at a time with three picks: Next exercise, Bare minimum, Feeling spunky
- Today's stack timeline and simple muscle region load bars
- Recommendations steer toward underworked or complementary muscle groups
- Installable PWA with an offline app shell
- All state stays on your device in localStorage

## Tech

Next.js (App Router, static export), TypeScript, Tailwind CSS 4, bun.

## Run locally

Requires bun, plus Python 3 with Pillow for the image assets.

```bash
bun install
bun run assets   # generates icons, favicon and og.png (pip install pillow)
bun run dev
```

Open http://localhost:3000.

## Build

```bash
bun run lint
bun run build    # static export to ./out
```

The build serves from the domain root by default. To host under a sub-path, set the base path and public URL at build time:

```bash
NEXT_PUBLIC_BASE_PATH=/slow-stack \
NEXT_PUBLIC_SITE_URL=https://briangramo.github.io/slow-stack \
bun run build
```

`og.png` uses the Nunito variable font. If it is not installed, point `SLOW_STACK_FONT` at a copy of `Nunito[wght].ttf` before running `bun run assets`.

## Deploy

Pushes to `main` run `.github/workflows/deploy.yml`, which generates the image assets, builds with the `/slow-stack` base path, and publishes `out/` to the `gh-pages` branch for GitHub Pages.

## License

All rights reserved. See [LICENSE](LICENSE).
