const isImageValid = (url, callback) => {
  const img = new Image();
  img.onload = () => callback(true);
  img.onerror = () => callback(false);
  img.src = url;
};

export default isImageValid;
