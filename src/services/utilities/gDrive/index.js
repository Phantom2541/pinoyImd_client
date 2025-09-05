const gDrive = {
  extractFileId: (url) => {
    try {
      const regex = /[-\w]{25,}/;
      const match = url.match(regex);
      const fileId = match ? match[0] : null;

      // Check if the link looks like a shared link
      const isSharedToAnyone =
        url.includes("sharing") ||
        url.includes("view?usp=sharing") ||
        url.includes("open?") ||
        url.includes("file/d/");

      return {
        fileId,
        isValid: !!fileId,
        isSharedToAnyone,
      };
    } catch {
      return {
        fileId: null,
        isValid: false,
        isSharedToAnyone: false,
      };
    }
  },
  view: (fileId) => `https://drive.google.com/thumbnail?id=${fileId}&sz=w4000`,
};

export default gDrive;
