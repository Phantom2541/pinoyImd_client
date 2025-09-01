export const removeBackground = (imageSrc, threshold = 50) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";

    // kung dataURL (base64), wag lagyan ng query string
    img.src = imageSrc.startsWith("data:")
      ? imageSrc
      : imageSrc + "?t=" + new Date().getTime();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // kunin average color ng corners
      const corners = [
        0,
        (img.width - 1) * 4,
        (img.height - 1) * img.width * 4,
        (img.height * img.width - 1) * 4,
      ];

      let r0 = 0,
        g0 = 0,
        b0 = 0;
      corners.forEach((i) => {
        r0 += data[i];
        g0 += data[i + 1];
        b0 += data[i + 2];
      });
      r0 /= 4;
      g0 /= 4;
      b0 /= 4;

      // loop sa lahat ng pixels
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const dist = Math.sqrt((r - r0) ** 2 + (g - g0) ** 2 + (b - b0) ** 2);

        if (dist < threshold) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = (err) => {
      console.error("Image load failed:", err);
      reject(err);
    };
  });
};
