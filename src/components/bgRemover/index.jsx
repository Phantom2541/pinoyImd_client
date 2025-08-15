import React, { useRef, useEffect } from "react";

function colorDistanceSq(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2,
    dg = g1 - g2,
    db = b1 - b2;
  return dr * dr + dg * dg + db * db;
}

function BgRemoverComponent({
  src,
  alt = "",
  fallback,
  className,
  style,
  bgColor = { r: 255, g: 255, b: 255 },
  tolerance = 100,
  scaleWidth, // target width
  scaleHeight, // target height
}) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    imgRef.current = img;

    let cancelled = false;
    const maxToleranceSq = tolerance * tolerance;

    img.src = src;

    img.onload = () => {
      if (cancelled) return;

      // Draw original image
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const { r: bgR, g: bgG, b: bgB } = bgColor;

      // Remove background
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i],
          g = data[i + 1],
          b = data[i + 2],
          a = data[i + 3];
        if (a === 0) continue;
        const distSq = colorDistanceSq(r, g, b, bgR, bgG, bgB);
        if (distSq < maxToleranceSq) {
          const alphaFactor = Math.sqrt(distSq) / tolerance;
          data[i + 3] = a * alphaFactor;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Find bounding box of non-transparent pixels
      let minX = canvas.width,
        minY = canvas.height,
        maxX = 0,
        maxY = 0;
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const index = (y * canvas.width + x) * 4;
          if (data[index + 3] > 0) {
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (minX > maxX || minY > maxY) {
        minX = 0;
        minY = 0;
        maxX = canvas.width;
        maxY = canvas.height;
      }

      let width = maxX - minX + 1;
      let height = maxY - minY + 1;

      // Robust square detection (5% tolerance)
      const aspectRatio = width / height;
      if (aspectRatio > 0.95 && aspectRatio < 1.05) {
        const size = Math.max(width, height);
        const centerX = Math.round((minX + maxX) / 2);
        const centerY = Math.round((minY + maxY) / 2);

        // Clamp minX/minY to canvas boundaries
        minX = Math.max(0, centerX - Math.floor(size / 2));
        minY = Math.max(0, centerY - Math.floor(size / 2));
        width = Math.min(size, canvas.width - minX);
        height = Math.min(size, canvas.height - minY);
      }

      // Offscreen canvas for smooth crop
      const tmpCanvas = document.createElement("canvas");
      const tmpCtx = tmpCanvas.getContext("2d");
      tmpCanvas.width = width;
      tmpCanvas.height = height;
      tmpCtx.drawImage(canvas, minX, minY, width, height, 0, 0, width, height);

      // --- FINAL SCALING LOGIC ---
      let finalWidth = scaleWidth || width;
      let finalHeight = scaleHeight || height;

      // Square image → use smaller of scaleWidth/scaleHeight
      if (width === height && scaleWidth && scaleHeight) {
        const size = Math.min(scaleWidth, scaleHeight);
        finalWidth = size;
        finalHeight = size;
      }

      // Draw final image
      canvas.width = finalWidth;
      canvas.height = finalHeight;
      ctx.clearRect(0, 0, finalWidth, finalHeight);
      ctx.drawImage(tmpCanvas, 0, 0, finalWidth, finalHeight);
    };

    img.onerror = () => {
      if (cancelled) return;

      if (fallback) {
        const fallbackImg = new Image();
        fallbackImg.crossOrigin = "anonymous";
        fallbackImg.src = fallback;

        fallbackImg.onload = () => {
          if (cancelled) return;
          canvas.width = fallbackImg.width;
          canvas.height = fallbackImg.height;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(fallbackImg, 0, 0);
        };

        fallbackImg.onerror = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    return () => {
      cancelled = true;
      if (imgRef.current) {
        imgRef.current.onload = null;
        imgRef.current.onerror = null;
        imgRef.current.src = "";
      }
    };
  }, [src, fallback, bgColor, tolerance, scaleWidth, scaleHeight]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={alt}
      role="img"
      className={className}
      style={style}
    />
  );
}

export default React.memo(BgRemoverComponent);
