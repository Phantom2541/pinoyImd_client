import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBCardBody, MDBTable, MDBTableHead, MDBTableBody, MDBBtn } from "mdbreact";
import { UPDATE } from "../../../../services/redux/slices/commerce/catalog/products";

export default function ProductsTable() {
  const dispatch = useDispatch();
  const productsState = useSelector((state) => state.products || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [ratingsInput, setRatingsInput] = useState({});

  useEffect(() => {
    if (productsState.filtered?.length) {
      const initialRatings = {};
      productsState.filtered.forEach((item) => {
        initialRatings[item._id] = item.ratings || 0;
      });
      setRatingsInput(initialRatings);
    }
  }, [productsState.filtered]);

  const filteredItems = (productsState.filtered || []).filter((item) =>
    (item.name?.toLowerCase() || item.pid?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const handleRatingChange = (id, value) => {
    setRatingsInput((prev) => ({ ...prev, [id]: value }));
    const item = productsState.filtered.find((p) => p._id === id);
    if (item) {
      dispatch(
        UPDATE({
          data: { ...item, ratings: value },
          token: productsState.token,
        })
      );
    }
  };

  const handleAddClick = () => {
    alert("Add Product clicked! Implement your add logic here.");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <style>{`
        @page {
          size: landscape;
          margin: 10mm;
        }
        @media print {
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
          }
          table {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #000;
            padding: 6px;
            text-align: center;
            font-size: 12px;
            word-wrap: break-word;
          }
          th:nth-child(1),
          td:nth-child(1) {
            text-align: left;
          }
        }
      `}</style>

      <MDBCardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <MDBBtn color="primary" onClick={handleAddClick}>
            + Add Product
          </MDBBtn>

          <input
            type="text"
            className="form-control w-50"
            placeholder="Search product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <MDBTable bordered responsive>
          <colgroup>
            <col style={{ width: "30%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "25%" }} />
          </colgroup>

          <MDBTableHead>
            <tr>
              <th>Product Name</th>
              <th className="text-center">Unit Cost</th>
              <th className="text-center">Stock</th>
              <th className="text-center">VATable</th>
              <th className="text-center">Ratings (1-5)</th>
            </tr>
          </MDBTableHead>

          <MDBTableBody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, idx) => {
                const name = item.name || item.pid?.name || "-";
                const unitCost = typeof item.unitCost !== "undefined" ? item.unitCost : "-";
                const stock = typeof item.stockTotal !== "undefined" ? item.stockTotal : "-";
                const vatable = typeof item.VATable !== "undefined" ? (item.VATable ? "Yes" : "No") : "-";

                return (
                  <tr key={item._id}>
                    <td style={{ textAlign: "left" }}>{name}</td>
                    <td className="text-center">{unitCost}</td>
                    <td className="text-center">{stock}</td>
                    <td className="text-center">{vatable}</td>
                    <td className="text-center">
                      <select
                        className="form-control form-control-sm"
                        value={ratingsInput[item._id] || 0}
                        onChange={(e) =>
                          handleRatingChange(item._id, parseInt(e.target.value))
                        }
                      >
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No products found.
                </td>
              </tr>
            )}
          </MDBTableBody>
        </MDBTable>
      </MDBCardBody>
    </div>
  );
}
