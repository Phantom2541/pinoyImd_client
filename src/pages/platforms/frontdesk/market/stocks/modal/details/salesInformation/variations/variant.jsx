import { MDBBtn, MDBIcon, MDBInput } from "mdbreact";

const Variant = ({ index, variant, setVariants = () => {} }) => {
  const handleAddOption = () => {
    setVariants((prevVariants) => {
      const newVariants = { ...prevVariants };
      const { options = [] } = newVariants.types[index];
      if (options.length > 9) return newVariants;
      options.push("");
      return newVariants;
    });
  };

  const handleRemoveOption = (subIndex) => {
    setVariants((prevVariants) => {
      const newVariants = { ...prevVariants };
      const { options = [] } = newVariants.types[index];
      options.splice(subIndex, 1);
      return newVariants;
    });
  };
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
          setVariants((prevVariants) => {
            const newVariants = { ...prevVariants };
            newVariants.types.splice(index, 1);
            return { ...newVariants, prices: {} };
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
          background: "#fff", // same as container background
          padding: "0 5px",
          color: "gray",
        }}
      >
        Variant {index + 1}
      </span>

      <div className="px-3">
        <MDBInput
          label="Enter Variation Name (e.g., Color, Size)"
          value={variant.title}
          onChange={(e) => {
            const value = e.target.value; // copy before async setState
            setVariants((prevVariants) => {
              const newVariants = { ...prevVariants };
              newVariants.types[index].title = value;
              return newVariants;
            });
          }}
        />
        {variant.options.map((option, subIndex) => (
          <div className="d-flex align-items-center" key={subIndex}>
            <div className="w-100 mt-n4">
              <MDBInput
                label="Enter Options (e.g., Red, Blue, Green)"
                onChange={(e) => {
                  const value = e.target.value; // copy before async setState
                  setVariants((prevVariants) => {
                    const newVariants = { ...prevVariants };
                    const options = [...newVariants.types[index].options];
                    options[subIndex] = value;
                    newVariants.types[index].options = options;
                    return newVariants;
                  });
                }}
                value={option}
                className="w-100"
              />
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
        ))}
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
