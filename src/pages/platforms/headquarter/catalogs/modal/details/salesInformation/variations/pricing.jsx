import { MDBInput, MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import { useState } from "react";

const Pricing = ({ variants, setVariants = () => {} }) => {
  const { types = [], prices = {} } = variants || {};
  const [option1Focus, setOption1Focus] = useState(-1);
  const [option2Focus, setOption2Focus] = useState(-1);

  const options1 = types[0]?.options || [];
  const options2 = types[1]?.options || [];
  const has2Variant = types.length > 1;

  const setFocus = (op1, op2 = -1) => {
    setOption1Focus(op1);
    setOption2Focus(op2);
  };

  const handleChange = (primaryKey, option, value, secondaryKey) => {
    let _prices = { ...prices };

    if (secondaryKey) {
      _prices = {
        ..._prices,
        [primaryKey]: {
          ..._prices[primaryKey],
          [secondaryKey]: {
            ...(_prices[primaryKey]?.[secondaryKey] || {}),
            [option]: value,
          },
        },
      };
    } else {
      _prices = {
        ..._prices,
        [primaryKey]: {
          ...(_prices[primaryKey] || {}),
          [option]: value,
        },
      };
    }

    setVariants((prevVariants) => ({
      ...prevVariants,
      prices: _prices,
    }));
  };

  const handleValue = (primary, option, secondary) => {
    if (secondary) {
      return prices?.[primary]?.[secondary]?.[option] ?? "0";
    }
    return prices?.[primary]?.[option] ?? "0";
  };

  return (
    <div
      style={{
        border: "1px solid #cfc8c8ff",
        position: "relative",
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
        Variation List
      </span>
      <div className="px-2 mt-1">
        <MDBTable small bordered>
          <MDBTableHead>
            <tr>
              {types.map(({ title }, index) => (
                <th className="text-center" key={index}>
                  {title || `Variant Name (${index + 1})`}
                </th>
              ))}
              <th>
                <span className="ml-3">Price</span>
              </th>
              <th>
                <span className="ml-3">Cost</span>
              </th>
              <th>
                <span className="ml-3">Stock</span>
              </th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {options1.map((option1, index1) => {
              if (has2Variant) {
                return options2.map((option2, index2) => {
                  return (
                    <tr key={`${index1}-${index2}`}>
                      {index2 === 0 && (
                        <td
                          className="text-center"
                          rowSpan={options2.length}
                          style={{
                            verticalAlign: "middle",
                            color: option1Focus === index1 ? "blue" : "",
                          }}
                        >
                          {option1 || "Option"}
                        </td>
                      )}
                      <td
                        style={{
                          verticalAlign: "middle",
                          color:
                            option1Focus === index1 && option2Focus === index2
                              ? "blue"
                              : "",
                        }}
                        className="text-center"
                      >
                        {option2 || "Option"}
                      </td>
                      {["cost", "price", "stock"].map((field, fieldIndex) => (
                        <td key={field}>
                          <div className="px-3 mr-1">
                            <MDBInput
                              className="m-0 p-1 mt-n4 mb-n4"
                              label={fieldIndex <= 1 ? "₱" : ""}
                              value={String(
                                handleValue(option1, field, option2) || "0"
                              )}
                              onChange={(e) =>
                                handleChange(
                                  option1,
                                  field,
                                  Number(e.target.value),
                                  option2
                                )
                              }
                              type="number"
                              onFocus={() => setFocus(index1, index2)}
                              onBlur={() => setFocus(-1, -1)}
                            />
                          </div>
                        </td>
                      ))}
                    </tr>
                  );
                });
              } else {
                return (
                  <tr key={index1}>
                    <td
                      className="text-center"
                      style={{
                        color: option1Focus === index1 ? "blue" : "",
                      }}
                    >
                      {option1 || "Option"}
                    </td>
                    {["cost", "price", "stock"].map((field, fieldIndex) => (
                      <td key={field}>
                        <div className="px-3 mr-1">
                          <MDBInput
                            className="m-0 p-1 mt-n4 mb-n4"
                            value={String(handleValue(option1, field) || "0")}
                            onChange={(e) =>
                              handleChange(
                                option1,
                                field,
                                Number(e.target.value)
                              )
                            }
                            label={fieldIndex <= 1 ? "₱" : ""}
                            type="number"
                            onFocus={() => setFocus(index1)}
                            onBlur={() => setFocus(-1, -1)}
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              }
            })}
          </MDBTableBody>
        </MDBTable>
      </div>
    </div>
  );
};

export default Pricing;
