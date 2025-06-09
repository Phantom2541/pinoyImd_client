import { useDispatch, useSelector } from "react-redux";
import { MDBTable, MDBBtn, MDBIcon, MDBBadge } from "mdbreact";
import React, { useState } from "react";
import Deals from "./deals";
import { currency, paymentMethod } from "../../../../../../services/utilities";
import { SetPAYMENT } from "../../../../../../services/redux/slices/finance/journals/soa";
import { capitalize } from "lodash";
import PaymentDetails from "./paymentDetails";

const Body = () => {
  const { filtered, activePage, maxPage } = useSelector(({ soa }) => soa),
    [activeId, setActiveId] = useState(""),
    dispatch = useDispatch();

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page
  return (
    <MDBTable responsive>
      <thead>
        <tr>
          <th>Client</th>
          <th>Amount</th>
          <th>Payment </th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((soa, index) => {
          const {
            clientId,
            status,
            amount,
            deals = [],
            _id,
            payments = [],
          } = soa;
          const isOpen = activeId === _id;
          const totalPaid = [...payments].reduce((a, b) => a + b.amount, 0);
          const remaining = amount - totalPaid;
          const imageSrc = (type) => paymentMethod.getImage(type).img;
          return (
            <React.Fragment key={`body-${index}`}>
              <tr className={isOpen ? "border border-black" : ""}>
                <td style={{ fontWeight: 400 }}>
                  <span className="font-weight-bold ">{index + 1}.</span>
                  <span className="ml-2">{clientId?.name}</span>{" "}
                  <MDBBadge
                    color={
                      status === "settled"
                        ? "success"
                        : status === "partial"
                        ? "primary"
                        : "grey"
                    }
                  >
                    {capitalize(status)}
                  </MDBBadge>
                </td>
                <td key={index} style={{ fontWeight: 400 }}>
                  {currency(amount)}{" "}
                </td>
                <td>
                  <strong>Amount:</strong> ₱{totalPaid.toLocaleString()}{" "}
                  {remaining ? (
                    <>
                      &nbsp;|&nbsp;
                      <strong className="text-danger">Remaining:</strong> ₱
                      {remaining.toLocaleString()}
                    </>
                  ) : (
                    ""
                  )}
                  <PaymentDetails payments={payments} imageSrc={imageSrc} />
                </td>
                <td>
                  <div className="d-flex justify-content-between">
                    {status !== "settled" ? (
                      <MDBBtn
                        size="sm"
                        color="info"
                        rounded
                        onClick={() => dispatch(SetPAYMENT(soa))}
                      >
                        Pay <MDBIcon icon="money-bill-wave" className="ml-1" />
                      </MDBBtn>
                    ) : (
                      <div></div>
                    )}

                    <div className="m-0 p-0 d-flex align-items-center">
                      <MDBBtn
                        size="sm"
                        color="white"
                        rounded
                        title="View Deals"
                        onClick={() =>
                          setActiveId((prev) => (prev === _id ? -1 : _id))
                        }
                        className="m-0 p-0 transition-all float-right "
                        style={{
                          width: isOpen ? "1.5rem" : "2.5rem",
                          height: isOpen ? "2rem" : "1.5rem",
                        }}
                      >
                        <i
                          style={{ rotate: `${isOpen ? 0 : 90}deg` }}
                          className="fa fa-angle-down transition-all "
                        />
                      </MDBBtn>
                      {!isOpen && deals.length > 0 && (
                        <span
                          className="counter"
                          style={{
                            marginBottom: "-10px",
                            marginRight: "-10px !important",
                          }}
                        >
                          {deals?.length}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
              <Deals deals={deals} isOpen={isOpen} _id={_id} key={_id} />
            </React.Fragment>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;
