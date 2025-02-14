import React, { useState, useEffect } from "react";
import Header from "./header";
import { MDBTable } from "mdbreact";
// import { Services } from "../../services/fakeDb";

const Printout = ({ sale }) => {
  console.log("sale", sale);

  // const {
  //   category,
  //   branchId,
  //   patient,
  //   updatedAt,
  //   source,
  //   referral,
  //   form,
  //   remarks,
  //   signatories,
  // } = task;
  // const { updatedAt, customer, referral, category, cart = [] } = sale;
  const { updatedAt, customer, referral, category } = sale;
  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "white" }}>
      <div
        style={{
          width: "500px",
          height: "624px",
          cursor: "default",
          fontFamily: "Helvetica, sans-serif",
          letterSpacing: "-0.5px",
          fontSize: "18px",
        }}
      >
        <Header
          patient={customer}
          date={updatedAt}
          category={category}
          task={sale}
          referral={referral}
        />
        <MDBTable responsive borderless className="mb-0 thermal-font">
          <thead>
            <tr>
              {Object.entries(sale)
                .slice(1)
                .map(([fk, value], index) => {
                  console.log(fk);
                  return (
                    <th
                      key={index} // make sure each element has a unique key
                      colSpan={2}
                      className="py-0"
                      style={{ fontSize: "13.5px" }}
                    >
                      {fk.toLocaleUpperCase()}
                    </th>
                  );
                })}
            </tr>
          </thead>
          <tbody>
            {Object.entries(sale)
              .slice(1)
              .map(([fk, value], index) => {
                console.log(value);
                return (
                  <tr key={index}>
                    <td style={{ fontSize: "17.5px" }}></td>
                  </tr>
                );
              })}
            {/* {cart?.map((menu, index) => {
              const { description, abbreviation, packages = [], up } = menu;
              console.log(menu);
              return (
                <tr key={`menu-${index}`}>
                  <td
                    style={{ fontSize: "17.5px" }}
                    className="text-left py-0 px-0 text-uppercase"
                  >
                    {description || abbreviation}
                    {packages.length > 1 &&
                      packages
                        .filter((id) => {
                          const { template } = Services.find(id);
                          if (
                            template !== 6 &&
                            template !== 12 &&
                            template !== 8
                          ) {
                            return id;
                          }
                        })
                        .map((id, index) => {
                          const { name, abbreviation } = Services.find(id);
                          return (
                            <div key={`package-${index}`} className="ml-4">
                              {abbreviation || name}
                            </div>
                          );
                        })}
                  </td>
                  {packages.includes(58) && (
                    <td
                      style={{ fontSize: "17.5px" }}
                      className={`text-right py-0 px-0 fw-bold ${
                        !!index && "d-none"
                      }`}
                    >
                      CBC
                      <div className="ml-4 ">Hct</div>
                      <div className="ml-4 ">Hgb</div>
                      <div className="ml-4 ">RBC</div>
                      <div className="ml-4 ">WBC</div>
                      <hr />
                      <div className="ml-4 ">
                        <br />
                      </div>
                      <div className="ml-4 ">
                        <br />
                      </div>
                      <div className="ml-4 ">
                        <br />
                      </div>
                      <div className="ml-4 ">
                        <br />
                      </div>
                      <div className="ml-4 ">
                        <br />
                      </div>
                      <hr />
                      <div className="ml-4 ">RCI</div>
                      <div className="ml-4 ">MCV</div>
                      <div className="ml-4 ">MCH</div>
                      <div className="ml-4 ">MCHC</div>
                      <div className="ml-4 ">RDWc</div>
                      <hr />
                      <div className="ml-4 ">APC</div>
                    </td>
                  )}
                  {packages.includes(143) && (
                    <td
                      style={{ fontSize: "17.5px" }}
                      className={`text-right py-0 px-0 fw-bold ${
                        !!index && "d-none"
                      }`}
                    >
                      Urinalysis
                    </td>
                  )}
                  {packages.includes(58) && (
                    <td
                      style={{ fontSize: "17.5px" }}
                      className={`text-right py-0 px-0 fw-bold ${
                        !!index && "d-none"
                      }`}
                    >
                      Fecalysis
                    </td>
                  )}
                </tr>
              );
            })} */}
          </tbody>
        </MDBTable>
      </div>
    </div>
  );
};

export default function TaskPrintout() {
  const [sale, setSale] = useState({ _id: "" });

  useEffect(() => {
    setSale(JSON.parse(localStorage.getItem("RequestForm")));
  }, []);
  console.log(sale);
  if (sale?.customer) return <Printout sale={sale} />;

  return <div>Task is Empty</div>;
}
