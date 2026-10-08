"""Render the Gumroad cover (1280x720) and OG image (1200x630) on the app palette.

Usage: python3 scripts/gen-cover.py [--og-only]   (needs Pillow + Nunito variable TTF)
Set SLOW_STACK_FONT to a Nunito variable TTF path if it is not installed system-wide.
"""
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import os
import sys

CREAM = (255, 248, 240)
CREAM_DEEP = (255, 232, 212)
PEACH = (255, 212, 184)
SUN = (255, 200, 87)
CORAL = (255, 138, 91)
TERRACOTTA = (232, 93, 76)
INK = (61, 44, 41)
INK_MUTED = (122, 92, 84)

FONT_CANDIDATES = [
    os.environ.get("SLOW_STACK_FONT", ""),
    "/usr/share/fonts/truetype/sand-box/google/Nunito/Nunito-VariableFont_wght.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]


def font(size: int, weight: str = "Black") -> ImageFont.FreeTypeFont:
    for path in FONT_CANDIDATES:
        if path and os.path.exists(path):
            f = ImageFont.truetype(path, size)
            try:
                f.set_variation_by_name(weight)
            except Exception:
                pass
            return f
    return ImageFont.load_default()


def glow(size, center, radius, color, alpha):
    layer = Image.new("RGBA", size, color + (0,))
    d = ImageDraw.Draw(layer)
    cx, cy = center
    d.ellipse([cx - radius, cy - radius * 0.7, cx + radius, cy + radius * 0.7],
              fill=color + (alpha,))
    return layer.filter(ImageFilter.GaussianBlur(radius // 3))


def render(w: int, h: int, title: str, tagline: str, price: str | None) -> Image.Image:
    img = Image.new("RGBA", (w, h), CREAM + (255,))
    img = Image.alpha_composite(img, glow((w, h), (int(w * 0.1), int(-h * 0.05)), int(w * 0.45), SUN, 110))
    img = Image.alpha_composite(img, glow((w, h), (w, 0), int(w * 0.35), CORAL, 70))
    d = ImageDraw.Draw(img)

    s = h / 720
    # Stacked-blocks mark on the right
    bw = int(330 * s)
    bh = int(96 * s)
    gap = int(22 * s)
    x_right = w - int(110 * s)
    y0 = (h - (3 * bh + 2 * gap)) // 2
    for i, (color, frac, shift) in enumerate(
        [(SUN, 0.72, 0), (CORAL, 0.86, int(20 * s)), (TERRACOTTA, 1.0, 0)]
    ):
        bwi = int(bw * frac)
        x1 = x_right - (bw - bwi) // 2 + shift
        x0 = x1 - bwi
        y = y0 + i * (bh + gap)
        d.rounded_rectangle([x0, y, x1, y + bh], radius=bh // 3, fill=color)

    left = int(90 * s)
    d.text((left, int(150 * s)), "SLOW STACK", font=font(int(30 * s), "ExtraBold"),
           fill=TERRACOTTA)
    d.text((left, int(200 * s)), title, font=font(int(104 * s), "Black"), fill=INK)
    d.text((left, int(340 * s)), tagline, font=font(int(44 * s), "Bold"), fill=INK_MUTED)

    if price:
        pf = font(int(40 * s), "ExtraBold")
        tw = d.textlength(price, font=pf)
        px, py = left, int(450 * s)
        ph = int(84 * s)
        d.rounded_rectangle([px, py, px + tw + int(70 * s), py + ph], radius=ph // 2,
                            fill=TERRACOTTA)
        d.text((px + int(35 * s), py + ph // 2), price, font=pf, fill=(255, 255, 255),
               anchor="lm")
        d.text((left, int(575 * s)),
               "Desk exercises · micro workouts at work · exercise snacks",
               font=font(int(26 * s), "SemiBold"), fill=INK_MUTED)
    else:
        d.text((left, int(450 * s)),
               "Desk exercises · micro workouts at work",
               font=font(int(32 * s), "SemiBold"), fill=INK_MUTED)
        d.text((left, int(500 * s)), "Free · no account · works offline",
               font=font(int(32 * s), "SemiBold"), fill=INK_MUTED)
    return img.convert("RGB")


def main() -> None:
    here = os.path.dirname(os.path.abspath(__file__))
    root = os.path.join(here, "..")
    if "--og-only" not in sys.argv:
        render(1280, 720, "Slow Stack Pro", "motion snacks for your workday",
               "$4.99 once").save(os.path.join(root, "gumroad-cover.png"))
    render(1200, 630, "Slow Stack", "motion snacks for your workday", None).save(
        os.path.join(root, "public", "og.png"))
    print("og written" if "--og-only" in sys.argv else "cover + og written")


if __name__ == "__main__":
    main()
