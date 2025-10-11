import { MDBBtn, MDBTable } from "mdbreact";
import { currency } from "../../../../../../../services/utilities";
import { useSelector } from "react-redux";
import { useState } from "react";
import React from "react";
import Services from "./services";

const ExtractedData = () => {
  const { extracted } = useSelector(({ menus }) => menus);
  const [activeId, setActiveId] = useState(-1);
  return (
    <div
      style={{
        maxHeight: "23rem",
        overflowY: "auto",
      }}
    >
      <MDBTable small className="mb-0">
        <thead className="sticky" style={{ top: "0", zIndex: 3 }}>
          <tr>
            <th style={{ width: "70%", fontWeight: 600 }} className="py-1">
              Menus ({extracted.length})
            </th>
            <th style={{ width: "20%" }} className="py-1">
              Price
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {extracted.length > 0 ? (
            extracted.map((item, index) => {
              const { packages = [] } = item;
              const isOpen = activeId === index;

              return (
                <React.Fragment key={index}>
                  <tr key={index}>
                    <td>
                      {index + 1}.
                      <span
                        style={{
                          fontWeight: isOpen ? 500 : 400,
                          color: isOpen ? "blue" : "",
                        }}
                        className="ml-1"
                      >
                        {item.abbreviation}
                      </span>
                    </td>
                    <td
                      className="text-end "
                      style={{
                        fontWeight: isOpen ? 500 : 400,
                        color: isOpen ? "blue" : "",
                      }}
                    >
                      {currency.format(item.opd)}
                    </td>
                    <td>
                      <div className="m-0 p-0 d-flex align-items-center justify-content-end">
                        <MDBBtn
                          size="sm"
                          color="white"
                          rounded
                          title="View Services Tagged"
                          onClick={() =>
                            setActiveId((prev) => (prev === index ? -1 : index))
                          }
                          className="m-0 p-0 transition-all float-right "
                          style={{
                            width: isOpen ? "1.8rem" : "2rem",
                            height: isOpen ? "1.3rem" : "1.3rem",
                          }}
                        >
                          <i
                            style={{ rotate: `${isOpen ? 0 : 90}deg` }}
                            className="fa fa-angle-down transition-all "
                          />
                        </MDBBtn>
                        {!isOpen && packages.length > 0 && (
                          <span
                            className="counter"
                            style={{
                              marginBottom: "-15px",
                              marginRight: "-20px !important",
                            }}
                          >
                            {packages?.length}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                  {isOpen && (
                    <Services isOpen={isOpen} _id={index} packages={packages} />
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan="2" className="text-center text-muted py-3">
                No data extracted yet. Upload an Excel file to preview.
              </td>
            </tr>
          )}
        </tbody>
      </MDBTable>
    </div>
  );
};

export default ExtractedData;
