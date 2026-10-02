#!/usr/bin/env python3
"""Brightness-match a 'before' edit to its clean original.
usage: match.py clean.png dirty.png out.webp  x y w h   (unchanged reference region)
Measures mean luma of the reference region in both, scales the dirty image by the ratio."""
import sys, subprocess
clean, dirty, out, x, y, w, h = sys.argv[1:8]
def mean(f):
    r = subprocess.run(["ffmpeg","-v","error","-i",f,"-vf",f"crop={w}:{h}:{x}:{y},scale=1:1,format=gray","-f","rawvideo","-"],capture_output=True)
    return r.stdout[0]
g = mean(clean)/max(mean(dirty),1)
print(f"gain {g:.3f}")
v = f"min(255\\,val*{g:.4f})"
subprocess.run(["ffmpeg","-v","error","-y","-i",dirty,"-vf",f"scale=1920:-2,lutrgb=r={v}:g={v}:b={v}","/tmp/_m.png"],check=True)
subprocess.run(["cwebp","-quiet","-q","82","/tmp/_m.png","-o",out],check=True)
