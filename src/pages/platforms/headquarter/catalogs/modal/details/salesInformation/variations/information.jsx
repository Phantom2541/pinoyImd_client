import { MDBBtn, MDBInput } from "mdbreact";
import { useState } from "react";
import { capitalize } from "lodash";
const Information = ({ variants, setVariants = () => {} }) => {
  const [form, setForm] = useState({ price: 0, cost: 0, stock: 0 });
  const handleSubmit = (e) => {
    e.preventDefault();
    const { types = [], prices: _prices = {} } = variants;
    var prices = { ..._prices };
    const options1 = types[0]?.options || [];
    const options2 = types[1]?.options || [];
    if (!form.cost && !form.price && !form.stock) return;
    if (types.length === 2) {
      options1.forEach((element) => {
        options2.forEach((element2) => {
          prices = {
            ...(prices || {}),
            [element]: {
              ...(prices?.[element] || {}),
              [element2]: {
                ...(prices?.[element]?.[element2] || {}),
                ...(form.price && { price: form.price }),
                ...(form.cost && { cost: form.cost }),
                ...(form.stock && { stock: form.stock }),
              },
            },
          };
        });
      });
    } else {
      options1.forEach((element) => {
        prices = {
          ...(prices || {}),
          [element]: {
            ...(prices?.[element] || {}),
            ...(form.price && { price: form.price }),
            ...(form.cost && { cost: form.cost }),
            ...(form.stock && { stock: form.stock }),
          },
        };
      });
    }
    setVariants({ ...variants, prices });
    setForm({ price: 0, cost: 0, stock: 0 });
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
          background: "#fff", // same as container background
          padding: "0 5px",
          color: "gray",
        }}
      >
        Variation Information
      </span>
      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between align-items-center px-3 mt-n2 mb-n3">
          {["cost", "price", "stock"].map((item, index) => (
            <div key={index} className={`w-75 px-${index > 0 && "3"}`}>
              <MDBInput
                className="w-100"
                label={capitalize(item)}
                type="number"
                required
                onChange={(e) =>
                  setForm({ ...form, [item]: Number(e.target.value) })
                }
                value={String(form[item] || "0")}
              />
            </div>
          ))}
          <MDBBtn
            color="primary"
            className="flex-shrink-0"
            size="md"
            type="submit"
          >
            Apply to all
          </MDBBtn>
        </div>
      </form>
    </div>
  );
};

export default Information;
