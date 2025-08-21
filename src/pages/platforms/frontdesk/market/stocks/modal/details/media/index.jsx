import { useState } from "react";
import { MDBIcon } from "mdbreact";

const Media = () => {
  const [images, setImages] = useState([null]);

  // handle file upload / re-upload
  const handleUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newImages = [...images];
        newImages[index] = reader.result;
        setImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  // remove image
  const handleRemove = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  // drag & drop
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };

  const handleDrop = (e, targetIndex) => {
    const sourceIndex = e.dataTransfer.getData("index");
    if (sourceIndex === null) return;

    const newImages = [...images];
    const temp = newImages[targetIndex];
    newImages[targetIndex] = newImages[sourceIndex];
    newImages[sourceIndex] = temp;

    setImages(newImages);
  };

  return (
    <div
      style={{
        border: "1px solid #cfc8c8ff",
        position: "relative",
        margin: "20px 0",
        padding: "20px",
        borderRadius: "5px",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "-12px",
          left: "15px",
          background: "#fff",
          padding: "0 5px",
          color: "gray",
        }}
      >
        Media Management
      </span>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {images.map((img, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "120px",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "120px",
                height: "120px",
                border: img ? "none" : "2px dashed gray",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              draggable={!!img}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, index)}
              onClick={() =>
                document.getElementById(`fileInput-${index}`).click()
              }
            >
              {img ? (
                <>
                  <img
                    src={img}
                    alt={`upload-${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    style={{
                      position: "absolute",
                      zIndex: 999,
                      top: "-10px",
                      right: "-10px",
                      background: "red",
                      color: "#fff",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: "bold",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </span>
                </>
              ) : (
                <MDBIcon icon="plus" size="2x" style={{ color: "gray" }} />
              )}

              <input
                id={`fileInput-${index}`}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleUpload(e, index)}
              />
            </div>

            {/* Label sa ilalim ng box */}
            <span
              style={{
                marginTop: "8px",
                fontSize: "14px",
                color: "gray",
                textAlign: "center",
              }}
            >
              Image {index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Media;
