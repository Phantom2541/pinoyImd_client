import {
  MDBTable,
  MDBTableHead,
  MDBCollapse,
  MDBTableBody,
  MDBBadge,
} from "mdbreact";
import {
  currency,
  dateFormat,
  fullName,
} from "../../../../../../services/utilities";
import { Services } from "../../../../../../services/fakeDb";
import React, { useEffect, useState } from "react";

const Deals = ({ deals: collections, isOpen, _id }) => {
  const [cluster, setCluster] = useState([]);

  useEffect(() => {
    const arrangeDeals = [...collections].reduce((acc, deal) => {
      const { createdAt } = deal;
      const index = acc.findIndex((item) => {
        const itemDate = new Date(item.createdAt).toDateString();
        const targetDate = new Date(createdAt).toDateString();
        return itemDate === targetDate;
      });
      if (index > -1) {
        acc[index].deals.push(deal);
      } else {
        acc.push({ createdAt, deals: [deal] });
      }
      return acc;
    }, []);
    setCluster(arrangeDeals);
  }, [collections]);

  return (
    <>
      <tr className="border-left border-right border-bottom border-black ">
        <td colSpan={6} className="m-0 p-0">
          <MDBCollapse
            id={`collapse-${_id}`}
            isOpen={isOpen}
            className="m-0 p-0"
          >
            <MDBTable
              small
              className="m-0"
              style={{ marginBottom: "transparent" }}
            >
              <MDBTableHead>
                <tr>
                  <td>Customer</td>
                  <td>Services</td>
                  <td>Price</td>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {cluster.map((c, index) => {
                  const { createdAt, deals } = c;
                  return (
                    <React.Fragment key={index}>
                      <tr>
                        <td
                          colSpan={3}
                          className="font-weight-bold"
                          style={{ color: "blue" }}
                        >
                          {dateFormat(createdAt)}
                        </td>
                      </tr>
                      <Children deals={deals} />
                    </React.Fragment>
                  );
                })}
              </MDBTableBody>
            </MDBTable>
          </MDBCollapse>
        </td>
      </tr>
    </>
  );
};

export default Deals;

const Children = ({ deals }) => {
  return (
    <>
      {deals.map((deal, index) => {
        const { services, customerId, amount } = deal;
        const createdAt = new Date(deal.createdAt);
        const time = createdAt.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true, // or false if you want 24-hour format
        });
        return (
          <tr key={`deals-${deal._id}-${index}`}>
            <td style={{ fontWeight: "400", width: "40%" }}>
              <div>
                <span className="font-weight-bold mr-2">{index + 1}.</span>
                {fullName(customerId?.fullName)}
              </div>
              <span style={{ marginLeft: "1.2rem" }} className="text-primary">
                {time}
              </span>
            </td>
            <td>
              {services?.map((id) => (
                <MDBBadge key={id} className="ml-2">
                  {Services.getAbbr(id)}
                </MDBBadge>
              ))}
            </td>
            <td style={{ fontWeight: "400", width: "10%" }}>
              {currency.format(amount)}
            </td>
          </tr>
        );
      })}
    </>
  );
};
