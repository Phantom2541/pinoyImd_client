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

const toRoman = (num) => {
  const romans = [
    ["m", 1000],
    ["cm", 900],
    ["d", 500],
    ["cd", 400],
    ["c", 100],
    ["xc", 90],
    ["l", 50],
    ["xl", 40],
    ["x", 10],
    ["ix", 9],
    ["v", 5],
    ["iv", 4],
    ["i", 1],
  ];

  let result = "";
  for (const [letter, value] of romans) {
    while (num >= value) {
      result += letter;
      num -= value;
    }
  }
  return result;
};

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
                  <th>Customer</th>
                  <th>Services</th>
                  <th>Price</th>
                </tr>
              </MDBTableHead>

              <MDBTableBody>
                {cluster.map((c, index) => {
                  const { createdAt, deals } = c;
                  return (
                    <React.Fragment key={index}>
                      {/* Date label, already shifted */}
                      <tr>
                        <td
                          colSpan={3}
                          className="font-weight-bold text-primary"
                          style={{ paddingLeft: "2rem" }}
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
          hour12: true,
        });

        const sharedStyle = { paddingLeft: "2rem" }; // 🔁 Shared alignment

        return (
          <tr key={`deals-${deal._id}-${index}`}>
            <td style={{ ...sharedStyle, fontWeight: "400", width: "40%" }}>
              <div>
                <span className="font-weight-bold mr-2">
                  {toRoman(index + 1)}.
                </span>

                {fullName(customerId?.fullName)}
              </div>
              <span className="text-primary ml-4">{time}</span>
            </td>

            <td style={sharedStyle}>
              {services?.map((id) => (
                <MDBBadge key={id} className="ml-2">
                  {Services.getAbbr(id)}
                </MDBBadge>
              ))}
            </td>

            <td style={{ ...sharedStyle, fontWeight: "400", width: "10%" }}>
              {currency.format(amount)}
            </td>
          </tr>
        );
      })}
    </>
  );
};
