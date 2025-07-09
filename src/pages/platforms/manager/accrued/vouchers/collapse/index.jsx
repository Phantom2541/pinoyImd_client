import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBContainer,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBBadge,
} from "mdbreact";
import { currency, fullName } from "../../../../../../services/utilities";
import {
  SetCluster,
  CHECK_DEAL,
  CHECK_BULK,
} from "../../../../../../services/redux/slices/commerce/pos/services/deals";
import { Privileges } from "../../../../../../services/fakeDb";

export default function Body() {
  const { filtered, vendor, cluster } = useSelector(({ deals }) => deals),
    [vouchers, setVouchers] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(SetCluster(filtered));
    setVouchers(filtered);
  }, [filtered, dispatch]);
  const isChecked = (date, deal) => {
    if (cluster.length > 0) {
      const _cluster = [...cluster];
      const findCluster = _cluster.find((item) => item?.date === date);
      if (!deal?._id) return findCluster?.hasSelected || false;
      const { deals = [] } = findCluster || {};
      return deals?.some(({ _id }) => deal?._id === _id) || false;
    }
    return false;
  };

  const isNoVendor = vendor?._id === "noSource" || !vendor?._id;
  return (
    <MDBTable bordered small>
      <thead className="sticky">
        <tr>
          {isNoVendor && <th>Source</th>}
          <th>Customer</th>
          <th>Category</th>
          <th>Services</th>
          <th>Amount</th>
          <th>Discount</th>
          <th>Privilege</th>
        </tr>
      </thead>
      <MDBTableBody>
        {vouchers?.map((voucher, index) => {
          const { deals = [], date } = voucher;
          const total = deals?.reduce((acc, item) => acc + item.amount, 0);
          return (
            <React.Fragment key={`voucher-${index}`}>
              <tr className="bg-light">
                <td
                  colSpan={isNoVendor ? 7 : 6}
                  style={{ fontWeight: 500, fontSize: "1rem" }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center ">
                      {!isNoVendor && (
                        <>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={index}
                            checked={isChecked(date)}
                            onChange={() =>
                              // dispatch(CHECK_BULK({ date: title, hasSelected: !isChecked }))
                              dispatch(CHECK_BULK({ date, deals }))
                            }
                          />
                          <label
                            htmlFor={index}
                            className="form-check-label label-table"
                          />
                        </>
                      )}
                      {date}
                    </div>
                    <span className="text-primary ml-2 d-block">
                      ({currency.format(total)})
                    </span>
                  </div>
                </td>
              </tr>
              {deals?.map((deal, index) => {
                const {
                  customerId,
                  category,
                  amount = 0,
                  discount,
                  privilege,
                  source,
                  cart = [],
                } = deal;
                return (
                  <tr key={index}>
                    {isNoVendor && (
                      <td style={{ fontWeight: 400 }}>
                        <div className="d-flex align-items-center ml-n1">
                          <div
                            className="border mr-1 "
                            style={{ width: "27px" }}
                          ></div>

                          <span className="mr-1"> {++index}.</span>
                          {source?.displayname}
                        </div>
                      </td>
                    )}
                    <td style={{ fontWeight: 400 }}>
                      <div className="d-flex align-items-center  ml-n1">
                        {isNoVendor ? (
                          fullName(customerId?.fullName)
                        ) : (
                          <>
                            <div
                              className="border mr-1 "
                              style={{ width: "27px" }}
                            ></div>
                            <input
                              className="form-check-input m-0 p-0"
                              type="checkbox"
                              id={deal._id}
                              checked={isChecked(date, deal)}
                              onChange={() =>
                                dispatch(
                                  CHECK_DEAL({
                                    deal,
                                    totalDeals: deals.length,
                                    date,
                                  })
                                )
                              }
                            />
                            <label
                              htmlFor={deal._id}
                              style={{ marginRight: "-0.5rem" }}
                              className="form-check-label label-table"
                            >
                              <span className="fw-bold mr-1"> {++index}.</span>
                              {fullName(customerId?.fullName)}
                            </label>
                          </>
                        )}
                      </div>
                    </td>
                    <td>{category}</td>
                    <td>
                      {cart.map(({ menuId }, index) => (
                        <MDBBadge key={index} className="mr-1">
                          {menuId.abbreviation}
                        </MDBBadge>
                      ))}
                    </td>
                    <td>{currency.format(amount)}</td>
                    <td>{currency.format(discount)}</td>
                    <td>{Privileges[privilege]}</td>
                  </tr>
                );
              })}
            </React.Fragment>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
}
