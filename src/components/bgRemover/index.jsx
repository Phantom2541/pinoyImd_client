import React, { useRef, useEffect } from "react";

function colorDistanceSq(r1, g1, b1, r2, g2, b2) {
  // Use squared distance for performance (no sqrt)
  const dr = r1 - r2,
    dg = g1 - g2,
    db = b1 - b2;
  return dr * dr + dg * dg + db * db;
}

export default function BgRemover({
  src,
  alt = "",
  fallback,
  className,
  style,
  bgColor = { r: 255, g: 255, b: 255 },
  tolerance = 100,
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

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const { r: bgR, g: bgG, b: bgB } = bgColor;

      // Process pixels in chunks (optional optimization)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a === 0) continue;

        // Use squared distance to avoid sqrt cost
        const distSq = colorDistanceSq(r, g, b, bgR, bgG, bgB);

        if (distSq < maxToleranceSq) {
          // Calculate alpha fading
          const alphaFactor = Math.sqrt(distSq) / tolerance;
          data[i + 3] = a * alphaFactor;
        }
      }

      ctx.putImageData(imageData, 0, 0);
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
          // Optionally clear canvas or show error state
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    return () => {
      cancelled = true;
      // Optional: cancel image loading if possible
      if (imgRef.current) {
        imgRef.current.onload = null;
        imgRef.current.onerror = null;
        imgRef.current.src = ""; // Cancel load
      }
    };
  }, [src, fallback, bgColor, tolerance]);

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
