"""Zip the contents of out/ (index.html at the zip root) to ../slow-stack-dist.zip."""
import os
import zipfile

here = os.path.dirname(os.path.abspath(__file__))
out = os.path.normpath(os.path.join(here, "..", "out"))
dest = os.path.normpath(os.path.join(here, "..", "..", "slow-stack-dist.zip"))

if os.path.exists(dest):
    os.remove(dest)
with zipfile.ZipFile(dest, "w", zipfile.ZIP_DEFLATED) as z:
    for root, _, files in os.walk(out):
        for f in sorted(files):
            full = os.path.join(root, f)
            z.write(full, os.path.relpath(full, out))
print(dest, os.path.getsize(dest), "bytes")
