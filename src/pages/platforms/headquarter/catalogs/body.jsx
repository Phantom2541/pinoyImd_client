import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MDBCardBody,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBInput,
} from "mdbreact";
import { UPDATE } from "../../../../services/redux/slices/commerce/catalog/products";

export default function ProductsTable({ searchTerm = "" }) {
  const dispatch = useDispatch();
  const productsState = useSelector((state) => state.products || {});

  // Local editable values for stock and unit cost keyed by product id
  const [editableFields, setEditableFields] = useState({});

  useEffect(() => {
    // Initialize editable fields from filtered products on load/update
    if (productsState.filtered?.length) {
      const fields = {};
      productsState.filtered.forEach((item) => {
        fields[item._id] = {
          stockTotal: item.stockTotal || 0,
          unitCost: item.unitCost || 0,
          ratings: item.ratings || 0,
        };
      });
      setEditableFields(fields);
    }
  }, [productsState.filtered]);

  // Filter products by search term
  const filteredItems = (productsState.filtered || []).filter((item) =>
    (item.name?.toLowerCase() || item.pid?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // When user changes input for stock or unit cost, update local state
  const handleFieldChange = (id, field, value) => {
    setEditableFields((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  // When user blurs input (leaves input), dispatch update to Redux store/backend
  const handleFieldBlur = (id) => {
    const item = productsState.filtered.find((p) => p._id === id);
    if (item && editableFields[id]) {
      const updatedData = {
        ...item,
        stockTotal: Number(editableFields[id].stockTotal),
        unitCost: Number(editableFields[id].unitCost),
        ratings: Number(editableFields[id].ratings),
      };
      dispatch(
        UPDATE({
          data: updatedData,
          token: productsState.token,
        })
      );
    }
  };

  const handleRatingChange = (id, value) => {
    setEditableFields((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ratings: value,
      },
    }));
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

  return (
    <div>
      <MDBCardBody>
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
              filteredItems.map((item) => {
                const name = item.name || item.pid?.name || "-";
                const vatable =
                  typeof item.VATable !== "undefined"
                    ? item.VATable
                      ? "Yes"
                      : "No"
                    : "-";

                const fields = editableFields[item._id] || {
                  stockTotal: 0,
                  unitCost: 0,
                  ratings: 0,
                };

                return (
                  <tr key={item._id}>
                    <td style={{ textAlign: "left" }}>{name}</td>

                    <td className="text-center" style={{ maxWidth: "100px" }}>
                      <MDBInput
                        type="number"
                        size="sm"
                        value={fields.unitCost}
                        onChange={(e) =>
                          handleFieldChange(item._id, "unitCost", e.target.value)
                        }
                        onBlur={() => handleFieldBlur(item._id)}
                        min="0"
                        step="0.01"
                      />
                    </td>

                    <td className="text-center" style={{ maxWidth: "100px" }}>
                      <MDBInput
                        type="number"
                        size="sm"
                        value={fields.stockTotal}
                        onChange={(e) =>
                          handleFieldChange(item._id, "stockTotal", e.target.value)
                        }
                        onBlur={() => handleFieldBlur(item._id)}
                        min="0"
                        step="1"
                      />
                    </td>

                    <td className="text-center">{vatable}</td>

                    <td className="text-center">
                      <select
                        className="form-control form-control-sm"
                        value={fields.ratings}
                        onChange={(e) =>
                          handleRatingChange(item._id, parseInt(e.target.value))
                        }
                      >
                        {[0, 1, 2, 3, 4, 5].map((val) => (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        ))}
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
