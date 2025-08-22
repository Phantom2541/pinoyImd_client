import React, { useState } from "react";
import {
  MDBIcon,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
} from "mdbreact";
const Results = ({ generics, handleNext = () => {} }) => {
  const [productSearch, setProductSearch] = useState("");

  const clearProduct = () => setProductSearch("");

  return (
    <div
      style={{
        maxHeight: "450px",
        overflowY: "auto",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
      }}
    >
      <MDBTable small>
        <MDBTableHead>
          <tr>
            <th colSpan={2}>
              <div className="d-flex align-items-center justify-content-between">
                <span>Products</span>
                <div className="position-relative" style={{ width: "220px" }}>
                  <MDBIcon
                    icon="search"
                    className="position-absolute text-muted"
                    style={{
                      top: "50%",
                      left: "8px",
                      transform: "translateY(-50%)",
                      fontSize: "1rem",
                    }}
                  />
                  <input
                    type="text"
                    className="form-control form-control-sm ps-4 rounded-pill"
                    placeholder="Search all products..."
                    value={productSearch}
                    style={{ paddingLeft: "30px", paddingRight: "10px" }} // <-- fixed
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                  {productSearch && (
                    <MDBIcon
                      icon="times"
                      className="position-absolute text-muted"
                      style={{
                        top: "50%",
                        right: "8px",
                        transform: "translateY(-50%)",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                      onClick={clearProduct}
                    />
                  )}
                </div>
              </div>
            </th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {generics.map((generic) => {
            const filteredProducts = generic.products.filter((p) =>
              p.name.toLowerCase().includes(productSearch.toLowerCase())
            );
            return (
              <React.Fragment key={generic._id}>
                <tr key={generic._id}>
                  <td className="fw-bold" colSpan={2}>
                    {generic.name}
                  </td>
                </tr>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td className="text-end">
                        <MDBBtn
                          size="sm"
                          className="px-2 p-0 m-0"
                          color="primary"
                          outline
                          onClick={() => handleNext(product)}
                        >
                          <MDBIcon icon="share" />
                        </MDBBtn>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2}> No products found</td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </MDBTableBody>
      </MDBTable>
    </div>
  );
};

export default Results;
