import { MDBIcon } from "mdbreact";
import validate from "../../validate";
const Variants = ({
  isDuplicate = false,
  images,
  setImages = () => {},
  variant = {},
}) => {
  const { options = [] } = variant;
  // handle file upload / re-upload
  const handleUpload = (e, option) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newImages = { ...images };
        newImages[option] = reader.result;
        setImages({ ...images, ...newImages });
      };
      reader.readAsDataURL(file);
    }
  };

  // remove image
  const handleRemove = (option) => {
    const newImages = { ...images };
    delete newImages[option];
    setImages({ ...newImages });
  };

  // drag & drop
  const handleDragStart = (e, option) => {
    e.dataTransfer.setData("option", option);
  };

  const handleDrop = (e, targetOption) => {
    const sourceOption = e.dataTransfer.getData("option");
    if (sourceOption === null) return;

    const newImages = { ...images };
    const temp = newImages[targetOption];
    newImages[targetOption] = newImages[sourceOption];
    newImages[sourceOption] = temp;

    if (!newImages[sourceOption]) delete newImages[sourceOption];

    setImages({ ...newImages });
  };

  return (
    <div
      className="mt-3"
      style={{
        border: "1px solid #cfc8c8ff",
        position: "relative",
        margin: "10px 0",
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
        {variant?.title || "Variant Name"} Images
      </span>
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {options?.map((option, index) => {
          const img = images[option];
          return (
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
                onDragStart={(e) => handleDragStart(e, option)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, option)}
                onClick={() => {
                  if (!validate.img.hasOption(option, variant?.title, index))
                    return;
                  if (validate.img.duplicateVariant(isDuplicate)) return;

                  document.getElementById(`fileInput-variant-${index}`).click();
                }}
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
                        handleRemove(option);
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
                  id={`fileInput-variant-${index}`}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleUpload(e, option)}
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
                {option || `Option-${index + 1}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Variants;
