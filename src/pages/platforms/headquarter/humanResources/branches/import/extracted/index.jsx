import { MDBBtn, MDBIcon, MDBTable } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import React from "react";
import Services from "./services";
import { EditableField } from "../../../../../../../components/customizable";
import {
  SetDELETED_MENU,
  SetUPDATED_MENU,
} from "../../../../../../../services/redux/slices/commerce/catalog/menus";

const ExtractedData = () => {
  const { extracted } = useSelector(({ menus }) => menus);
  const [activeId, setActiveId] = useState(-1);
  const dispatch = useDispatch();
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
            <th style={{ width: "40%", fontWeight: 600 }} className="py-1">
              Menus ({extracted.length})
            </th>
            <th className="py-1">Description</th>

            <th style={{ width: "10%" }} className="py-1">
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
                    <td
                      style={{
                        color: isOpen ? "blue" : "",
                        fontWeight: isOpen ? 600 : 400,
                      }}
                    >
                      <div className="d-flex align-items-center ">
                        <span className="mt-n2 mr-1">{index + 1}.</span>
                        <EditableField
                          isCapitalize={false}
                          fieldData={{
                            _id: index,
                            abbreviation: item.abbreviation,
                          }}
                          keyForValue={"abbreviation"}
                          keyForText="abbreviation"
                          onSave={(item) =>
                            dispatch(
                              SetUPDATED_MENU({ data: item, _id: index })
                            )
                          }
                          localUpdate
                        />
                      </div>
                    </td>
                    <td
                      style={{
                        fontWeight: isOpen ? 500 : 400,
                        color: isOpen ? "blue" : "",
                      }}
                    >
                      <EditableField
                        fieldData={{
                          _id: index,
                          description: item.description,
                        }}
                        isCapitalize={false}
                        width="20rem"
                        keyForValue={"description"}
                        keyForText="description"
                        onSave={(item) =>
                          dispatch(SetUPDATED_MENU({ data: item, _id: index }))
                        }
                        localUpdate
                      />
                    </td>
                    <td
                      className="text-end "
                      style={{
                        fontWeight: isOpen ? 500 : 400,
                        color: isOpen ? "blue" : "",
                      }}
                    >
                      <EditableField
                        fieldData={{
                          _id: index,
                          opd: item.opd,
                        }}
                        width="9rem"
                        isMoney
                        keyForValue={"opd"}
                        keyForText="opd"
                        onSave={(item) =>
                          dispatch(SetUPDATED_MENU({ data: item, _id: index }))
                        }
                        localUpdate
                      />
                    </td>
                    <td style={{ width: "10%" }}>
                      <div className="d-flex align-items-center justify-content-between">
                        <MDBBtn
                          size="sm"
                          color="danger"
                          className="px-2 py-1"
                          onClick={() => dispatch(SetDELETED_MENU(index))}
                        >
                          <MDBIcon icon="trash" />
                        </MDBBtn>
                        <div className="m-0 p-0 d-flex align-items-center ">
                          <MDBBtn
                            size="sm"
                            color="white"
                            rounded
                            title="View Services Tagged"
                            onClick={() =>
                              setActiveId((prev) =>
                                prev === index ? -1 : index
                              )
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
