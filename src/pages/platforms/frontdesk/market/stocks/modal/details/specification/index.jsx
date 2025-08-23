import { MDBBtn, MDBIcon, MDBInput } from "mdbreact";

const Specifications = ({ info, setInfo = () => {} }) => {
  const { specifications = [{ title: "", desc: "" }] } = info;

  const handleAddSpecification = () => {
    if (specifications.length >= 8) return;
    setInfo((prevInfo) => ({
      ...prevInfo,
      specifications: [
        ...(prevInfo.specifications || []),
        { title: "", desc: "" },
      ],
    }));
  };

  const handleTitleChange = (value, index) => {
    const _specifications = [...specifications];
    _specifications[index].title = value;
    setInfo({ ...info, specifications: _specifications });
  };

  const handleDescChange = (value, index) => {
    const _specifications = [...(specifications || [])];
    _specifications[index].desc = value;
    setInfo({ ...info, specifications: _specifications });
  };
  const handleRemove = (index) => {
    const _specifications = [...(specifications || [])];
    _specifications.splice(index, 1);
    setInfo({ ...info, specifications: _specifications });
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
        {specifications.map(({ title, desc }, i) => (
          <div
            className={`d-flex align-items-center mt-n${i === 0 ? 2 : 4}`}
            key={`specification-${i}`}
          >
            <div style={{ width: i === 0 ? "20rem" : "21rem" }}>
              <MDBInput
                label="Title"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value, i)}
              />
            </div>
            <div>
              <span className="fw-bold mx-2">:</span>
            </div>
            <div className="w-100">
              <MDBInput
                label="Description"
                required
                value={desc}
                onChange={(e) => handleDescChange(e.target.value, i)}
              />
            </div>
            {i !== 0 && (
              <MDBBtn
                size="sm"
                rounded
                className="px-2"
                color="danger"
                outline
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => handleRemove(i)}
              >
                <MDBIcon icon="trash" />
              </MDBBtn>
            )}
          </div>
        ))}
        <MDBBtn
          block
          size="md"
          color="primary"
          outline
          onClick={handleAddSpecification}
        >
          <MDBIcon icon="plus" className="mr-2" /> ADD SPECIFICATION (
          {specifications?.length}/10)
        </MDBBtn>
      </div>
    </div>
  );
};

export default Specifications;
