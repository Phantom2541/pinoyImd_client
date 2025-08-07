const Cloudinary = {
  getEndpoint: (isImage = true) =>
    `https://res.cloudinary.com/dr7ljconx/${isImage ? "image" : "raw"}/upload`,
  buildFileForm: (base64, folder, fileName) => {
    const mimeMatch = base64.match(/^data:(.*);base64,/);
    if (!mimeMatch) throw new Error("Invalid base64 format");

    const mimeType = mimeMatch[1];
    const base64Data = base64.split(",")[1];
    const byteString = atob(base64Data);

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeType });

    const formData = new FormData();
    formData.append("file", blob);
    formData.append("folder", folder);
    formData.append("filename", fileName);

    return formData;
  },
};

export default Cloudinary;
