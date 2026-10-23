"""Normalize rushabh-ashar / vaibhav-jain leadership portraits to 288x384.

Other leadership shots are already 3:4. These two started as near-square
files with side padding, so object-cover made them look wrong in the team grid.
"""

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "images" / "about" / "leadership"
TARGET_W, TARGET_H = 288, 384
TARGET_RATIO = TARGET_W / TARGET_H


def trim_white_border(img: Image.Image, inset: int = 2) -> Image.Image:
    g = np.asarray(img.convert("L"))
    xs = np.where(g.mean(axis=0) < 250)[0]
    ys = np.where(g.mean(axis=1) < 250)[0]
    cropped = img.crop((int(xs[0]), int(ys[0]), int(xs[-1]) + 1, int(ys[-1]) + 1))
    w, h = cropped.size
    return cropped.crop((inset, inset, w - inset, h - inset))


def person_center(img: Image.Image) -> tuple[float, float]:
    gray = np.asarray(img.convert("L"), dtype=np.float32)
    col_var = gray.var(axis=0)
    row_var = gray.var(axis=1)
    col_thr = max(500.0, float(np.percentile(col_var, 45)))
    row_thr = max(450.0, float(np.percentile(row_var, 25)))
    cols = np.where(col_var > col_thr)[0]
    rows = np.where(row_var > row_thr)[0]
    left, right = int(cols[0]), int(cols[-1]) + 1
    top, bottom = int(rows[0]), int(rows[-1]) + 1
    return (left + right) / 2, top + (bottom - top) * 0.32


def normalize(img: Image.Image) -> Image.Image:
    img = trim_white_border(img.convert("RGB"))
    w, h = img.size
    cx, cy = person_center(img)

    if w / h > TARGET_RATIO:
        crop_h = h
        crop_w = int(round(h * TARGET_RATIO))
    else:
        crop_w = w
        crop_h = int(round(w / TARGET_RATIO))

    left = int(round(cx - crop_w / 2))
    top = int(round(cy - crop_h * 0.38))
    left = max(0, min(left, w - crop_w))
    top = max(0, min(top, h - crop_h))

    cropped = img.crop((left, top, left + crop_w, top + crop_h))
    return (
        cropped.convert("L")
        .convert("RGB")
        .resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)
    )


def main() -> None:
    for name in ("rushabh-ashar.jpg", "vaibhav-jain.jpg"):
        path = ROOT / name
        bak = path.with_suffix(path.suffix + ".bak")
        src = bak if bak.exists() else path
        if not bak.exists():
            path.replace(bak)
            src = bak
        fixed = normalize(Image.open(src))
        fixed.save(path, "JPEG", quality=92, optimize=True)
        print(f"wrote {path.name} {fixed.size}")


if __name__ == "__main__":
    main()
