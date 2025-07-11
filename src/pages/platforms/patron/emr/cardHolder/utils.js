const utils = {
  fetchImageAsBase64: async (url, token) => {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.warn(`⚠️ Fetch failed. Status: ${response.status}`);
        return "";
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.startsWith("image/")) {
        console.warn(`❌ Not an image. Content-Type: ${contentType}`);
        return "";
      }

      const blob = await response.blob();
      if (!blob || blob.size === 0) {
        console.warn("⚠️ Empty blob.");
        return "";
      }

      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result || "");
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      return base64.split(",")[1] || "";
    } catch (error) {
      console.error("❌ Error fetching/converting image:", error);
      return "";
    }
  },
};

export default utils;
