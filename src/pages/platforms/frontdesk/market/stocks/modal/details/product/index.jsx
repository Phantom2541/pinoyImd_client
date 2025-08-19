import Checked from "./checked";

const Product = ({ product }) => {
  const {
    name = "",
    subname = "",
    isConsumable = false,
    VATable = false,
    halt = false,
    revert = false,
  } = product;
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
          background: "#fff", // same as container background
          padding: "0 5px",
          color: "blue",
        }}
      >
        Product Information
      </span>

      <div className="p-2 d-flex justify-content-between">
        <div>
          <span style={{ fontWeight: 500 }}>Name:</span>
          <div>
            <span>{name}</span>
            {subname && <span> - {subname}</span>}
          </div>
        </div>
        <Checked label={"Consumable"} isChecked={isConsumable} />
        <Checked label={"VATable"} isChecked={VATable} />
        <Checked label={"Halt"} isChecked={halt} />
        <Checked label={"Revert"} isChecked={revert} />
      </div>
    </div>
  );
};

export default Product;
