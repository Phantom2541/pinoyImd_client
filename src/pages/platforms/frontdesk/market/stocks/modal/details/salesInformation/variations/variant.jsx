import { useEffect } from "react";
import { MDBBtn, MDBIcon, MDBInput } from "mdbreact";

const Variant = ({
  index,
  variants,
  variant,
  setVariants = () => {},
  setIsDuplicate = () => {}, // ADD this prop from parent
}) => {
  const normalize = (s) => (s ?? "").trim().toLowerCase();

  const handleAddOption = () => {
    setVariants((prev) => {
      const next = { ...prev };
      const opts = next.types[index].options || [];
      if (opts.length > 9) return next;
      next.types[index].options = [...opts, ""];
      return next;
    });
  };

  const handleRemoveOption = (subIndex) => {
    setVariants((prev) => {
      const next = { ...prev };
      const opts = [...next.types[index].options];
      opts.splice(subIndex, 1);
      next.types[index].options = opts;
      return next;
    });
  };

  // ---------- Duplicate checks ----------
  const titleVal = normalize(variant.title);

  const titleDup =
    titleVal &&
    (variants.types?.some(
      (v, i) => i !== index && normalize(v.title) === titleVal
    ) ||
      variants.types?.some((v) =>
        (v.options || []).some((opt) => normalize(opt) === titleVal)
      ));

  const optionDupList = variant.options.map((opt, subIndex) => {
    const val = normalize(opt);
    if (!val) return false;

    const duplicateInOptions =
      variants.types?.some((v, typeIndex) =>
        (v.options || []).some(
          (o, optIndex) =>
            normalize(o) === val &&
            !(typeIndex === index && optIndex === subIndex)
        )
      ) || false;

    const duplicateWithTitles =
      variants.types?.some((v) => normalize(v.title) === val) || false;

    return duplicateInOptions || duplicateWithTitles;
  });

  // Combine for global flag
  const anyDuplicate = titleDup || optionDupList.some(Boolean);

  useEffect(() => {
    setIsDuplicate(anyDuplicate);
  }, [anyDuplicate, setIsDuplicate]);

  // --------------------------------------

  return (
    <div
      style={{
        border: "1px solid #cfc8c8ff",
        position: "relative",
        margin: "20px 0",
        paddingTop: "10px",
        borderRadius: "5px",
      }}
      key={index}
    >
      {/* REMOVE VARIANT BUTTON */}
      <span
        style={{
          position: "absolute",
          top: "-10px",
          right: "-10px",
          background: "red",
          color: "#fff",
          borderRadius: "50%",
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          fontWeight: "bold",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          cursor: "pointer",
        }}
        onClick={() => {
          setVariants((prev) => {
            const next = { ...prev };
            next.types.splice(index, 1);
            if (next.types.length === 0) {
              setIsDuplicate(false);
              return {};
            }
            return { ...next, prices: {} };
          });
        }}
      >
        ×
      </span>

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
        Variant {index + 1}
      </span>

      <div className="px-3">
        {/* TITLE */}
        <MDBInput
          label="Enter Variation Name (e.g., Color, Size)"
          value={variant.title}
          onChange={(e) => {
            const value = e.target.value;
            setVariants((prev) => {
              const next = { ...prev };
              next.types[index].title = value;
              return next;
            });
          }}
        />
        {titleDup && (
          <span
            style={{
              marginTop: "-1.6rem",
              marginBottom: "1rem",
              color: "red",
              fontSize: "14px",
              fontWeight: "500",
            }}
            className="d-block"
          >
            ⚠ This variation name already exists (as a title or option).
          </span>
        )}

        {/* OPTIONS */}
        {variant.options.map((option, subIndex) => {
          const showDup = optionDupList[subIndex];
          return (
            <div className="d-flex align-items-center" key={subIndex}>
              <div className="w-100 mt-n4">
                <MDBInput
                  label="Enter Options (e.g., Red, Blue, Green)"
                  onChange={(e) => {
                    const value = e.target.value;
                    setVariants((prev) => {
                      const next = { ...prev };
                      const opts = [...next.types[index].options];
                      opts[subIndex] = value;
                      next.types[index].options = opts;
                      return next;
                    });
                  }}
                  value={option}
                  className="w-100"
                />
                {showDup && (
                  <span
                    style={{
                      marginTop: "-1.6rem",
                      marginBottom: "1rem",
                      color: "red",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                    className="d-block"
                  >
                    ⚠ Ooopss! That name is already used (as an option or
                    variation name).
                  </span>
                )}
              </div>
              {subIndex !== 0 && (
                <MDBBtn
                  size="sm"
                  rounded
                  className="px-2"
                  color="danger"
                  outline
                  onClick={() => handleRemoveOption(subIndex)}
                >
                  <MDBIcon icon="trash" />
                </MDBBtn>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center mt-n3">
        {variant.options.length < 10 && (
          <MDBBtn color="info" size="sm" onClick={handleAddOption}>
            <MDBIcon icon="plus" className="mr-1" /> ADD OPTIONS (
            {variant?.options?.length}/10)
          </MDBBtn>
        )}
      </div>
    </div>
  );
};

export default Variant;
