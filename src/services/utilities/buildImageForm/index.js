/**
 * Given a base64 image, folder, and fileName, return a FormData to be used
 * for uploading the image to the server.
 * @param {string} image - Base64 string of the image
 * @param {string} folder - Folder to save the image in
 * @param {string} fileName - Name to save the image as
 * @returns {FormData}
 */
const buildImageForm = (image, folder, fileName) => {
  const byteString = atob(image.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: "image/png" });

  const formData = new FormData();
  formData.append("file", blob);
  formData.append("folder", folder);
  formData.append("filename", fileName);

  return formData;
};

export default buildImageForm;
