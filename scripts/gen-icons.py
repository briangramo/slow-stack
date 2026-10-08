"""Generate Slow Stack PWA icons (stacked-blocks mark) on the app palette.

Usage: python3 scripts/gen-icons.py   (needs Pillow)
"""
from PIL import Image, ImageDraw
import os

CREAM = (255, 248, 240, 255)
CORAL = (255, 138, 91, 255)
TERRACOTTA = (232, 93, 76, 255)
SUN = (255, 200, 87, 255)

SS = 4  # supersample for smooth edges


def stacked_blocks(size: int, maskable: bool = False) -> Image.Image:
    big = size * SS
    img = Image.new("RGBA", (big, big), CREAM)
    draw = ImageDraw.Draw(img)
    # Maskable icons must keep the mark inside the 80% safe zone.
    scale = 0.42 if maskable else 0.56
    bw = int(big * scale)
    bh = int(bw * 0.3)
    gap = int(bw * 0.07)
    total_h = 3 * bh + 2 * gap
    y0 = (big - total_h) // 2
    radius = max(2, bh // 3)
    stagger = int(bw * 0.06)
    widths = [0.72, 0.86, 1.0]
    for i, color in enumerate([SUN, CORAL, TERRACOTTA]):
        w = int(bw * widths[i])
        y = y0 + i * (bh + gap)
        x0 = (big - w) // 2 + (stagger if i == 1 else 0)
        draw.rounded_rectangle([x0, y, x0 + w, y + bh], radius=radius, fill=color)
    return img.resize((size, size), Image.LANCZOS)


def main() -> None:
    root = os.path.join(os.path.dirname(__file__), "..", "public")
    icons = os.path.join(root, "icons")
    os.makedirs(icons, exist_ok=True)
    for size in (192, 512):
        stacked_blocks(size).save(os.path.join(icons, f"icon-{size}.png"))
        stacked_blocks(size, maskable=True).save(
            os.path.join(icons, f"icon-maskable-{size}.png")
        )
    stacked_blocks(180).save(os.path.join(root, "apple-touch-icon.png"))
    stacked_blocks(32).save(os.path.join(root, "favicon-32.png"))
    ico = stacked_blocks(64)
    ico.save(
        os.path.join(root, "..", "src", "app", "favicon.ico"),
        sizes=[(16, 16), (32, 32), (48, 48)],
    )
    print("icons written")


if __name__ == "__main__":
    main()
