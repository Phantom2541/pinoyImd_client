import { MDBBtn, MDBIcon, MDBInput } from "mdbreact";

const Specifications = ({ info, setInfo = () => {} }) => {
  const { specifications = {} } = info;

  const handleChange = (oldKey, newKey, newValue) => {
    setInfo((prevInfo) => {
      const newSpecs = { ...prevInfo.specifications };

      // Update key if it changed
      if (oldKey !== newKey) {
        delete newSpecs[oldKey];
      }

      newSpecs[newKey] = newValue;
      return { ...prevInfo, specifications: newSpecs };
    });
  };

  const handleAdd = () => {
    const newKey = `spec-${Date.now()}`; // unique key
    setInfo((prevInfo) => ({
      ...prevInfo,
      specifications: { ...prevInfo.specifications, [newKey]: "" },
    }));
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
        Specifications
      </span>
      <div className="p-2">
        {Object.entries(specifications).map(([key, value], i) => (
          <div className="d-flex align-items-center mb-2 mt-n3" key={key}>
            <div className="me-2">
              <MDBInput
                label="Title"
                value={key}
                onChange={(e) => handleChange(key, e.target.value, value)}
              />
            </div>
            <div>
              <span className="fw-bold mx-2">:</span>
            </div>
            <div className="w-100">
              <MDBInput
                label="Description"
                value={value}
                onChange={(e) => handleChange(key, key, e.target.value)}
              />
            </div>
          </div>
        ))}
        <MDBBtn block size="md" color="primary" outline onClick={handleAdd}>
          <MDBIcon icon="plus" className="me-2" /> ADD SPECIFICATION
        </MDBBtn>
      </div>
    </div>
  );
};

export default Specifications;
