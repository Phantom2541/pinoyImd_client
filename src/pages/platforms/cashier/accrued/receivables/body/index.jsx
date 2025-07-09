import { useSelector } from "react-redux";
import { MDBTable, MDBBtn, MDBBadge } from "mdbreact";
import React, { useEffect, useState } from "react";
import Deals from "./deals";
import {
  currency,
  dateFormat,
  paymentMethod,
} from "../../../../../../services/utilities";
import { capitalize } from "lodash";
import PaymentDetails from "./paymentDetails";

const Body = () => {
  const { filtered, activePage, maxPage } = useSelector(({ soa }) => soa),
    [receivables, setReceivables] = useState([]),
    [activeId, setActiveId] = useState("");

  useEffect(() => {
    const statusPriority = {
      settled: 2,
      partial: 1,
      default: 0,
    };

    const sorted = [...filtered].sort((a, b) => {
      const aPriority =
        statusPriority[a.status?.toLowerCase()] ?? statusPriority.default;
      const bPriority =
        statusPriority[b.status?.toLowerCase()] ?? statusPriority.default;

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setReceivables(sorted);
  }, [filtered]);

  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = receivables.slice(startIndex, endIndex);

  return (
    <MDBTable responsive>
      <thead>
        <tr>
          <th>Particular</th>
          <th>Title</th>
          <th>Payment</th>
          <th>Amount</th>
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
            createdAt,
          } = soa;
          const isOpen = activeId === _id;
          const totalPaid = [...payments].reduce((a, b) => a + b.amount, 0);
          const remaining = amount - totalPaid;
          const imageSrc = (type) => paymentMethod.getImage(type).img;
          const soaTitle = `${new Date(createdAt).toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })} - SOA`;

          return (
            <React.Fragment key={`body-${index}`}>
              <tr className={isOpen ? "border border-black" : ""}>
                <td style={{ fontWeight: 400 }}>
                  <div>
                    <span className="font-weight-bold">{index + 1}.</span>
                    <span className="ml-2">{clientId?.name}</span>
                    <MDBBadge
                      className="ml-2"
                      color={
                        status === "settled"
                          ? "grey"
                          : status === "partial"
                          ? "primary"
                          : "success"
                      }
                    >
                      {capitalize(status)}
                    </MDBBadge>
                  </div>
                  <span
                    style={{ marginLeft: "1.3rem" }}
                    className="text-primary"
                  >
                    {dateFormat(createdAt)}
                  </span>
                </td>
                <td style={{ fontWeight: 400 }}>{soaTitle}</td>
                <td>
                  {totalPaid <= 0 ? (
                    currency.format(totalPaid)
                  ) : (
                    <>
                      <PaymentDetails payments={payments} imageSrc={imageSrc} />
                      {remaining ? (
                        <span className="font-weight-bold">
                          <span className="text-danger">Balance:</span> ₱
                          <span>{remaining.toLocaleString()}</span>
                        </span>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </td>
                <td key={index} style={{ fontWeight: 400 }}>
                  {currency.format(amount)}
                </td>

                <td>
                  <div className="d-flex justify-content-between">
                    {/* Pay button removed */}
                    <div></div>

                    <div className="m-0 p-0 d-flex align-items-center">
                      <MDBBtn
                        size="sm"
                        color="white"
                        rounded
                        title="View Deals"
                        onClick={() =>
                          setActiveId((prev) => (prev === _id ? -1 : _id))
                        }
                        className="m-0 p-0 transition-all float-right"
                        style={{
                          width: isOpen ? "1.5rem" : "2.5rem",
                          height: isOpen ? "2rem" : "1.5rem",
                        }}
                      >
                        <i
                          style={{ rotate: `${isOpen ? 0 : 90}deg` }}
                          className="fa fa-angle-down transition-all"
                        />
                      </MDBBtn>
                      {!isOpen && deals.length > 0 && (
                        <span
                          className="counter"
                          style={{
                            marginBottom: "-10px",
                            marginRight: "-10px",
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
