import CoverPhoto from "./coverPhoto";
import Variants from "./variants";

const Media = ({
  isDuplicate = false,
  variants,
  images,
  setImages = () => {},
}) => {
  const variant1 = { ...(variants?.types?.[0] || {}) };
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
      <CoverPhoto images={images} setImages={setImages} />
      {variant1?.options?.length > 0 && (
        <Variants
          images={images}
          setImages={setImages}
          variant={variant1}
          isDuplicate={isDuplicate}
        />
      )}
    </div>
  );
};

export default Media;
