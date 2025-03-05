import React, { useEffect, useMemo, useState } from "react";
import Months from "../../../../../services/fakeDb/calendar/months";
import {
  currency,
  fullName,
  generateClaimStub,
  nickname,
  paymentBadge,
  properFullname,
} from "../../../../../services/utilities";
import {
  MDBBadge,
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBIcon,
  MDBRow,
  MDBSpinner,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBTypography,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/commerce/sales";
import { TAGGING } from "../../../../../services/redux/slices/commerce/taskGenerator";
import {
  TIEUPS as PHYSICIANS,
  RESET as PHYSICIANRESET,
} from "../../../../../services/redux/slices/assets/persons/physicians";
import {
  OUTSOURCE as SOURCELIST,
  RESET as SOURCERESET,
} from "../../../../../services/redux/slices/assets/providers";
import Swal from "sweetalert2";

export default function FocusedSale({ ledger, focusedDay, month, year }) {
  const [filteredCashiers, setFilteredCashiers] = useState([]),
    [filteredByProcessing, setFilteredByProcessing] = useState([]),
    { activePlatform, token, auth } = useSelector(({ auth }) => auth),
    { collections: sales, isLoading } = useSelector(({ sales }) => sales),
    { collections: physicians } = useSelector(({ physicians }) => physicians),
    { collections: sources } = useSelector(({ providers }) => providers),
    dispatch = useDispatch();

  const dateKey = `${Months[month]} ${focusedDay}, ${year}`,
    breakdown = useMemo(() => {
      const key = `${Months[month]} ${focusedDay}, ${year}`;
      return ledger[key] || [];
    }, [ledger, month, focusedDay, year]); // Dependencies

  const fetchCashiers = (_breakdown) => {
    const cashiers = {};

    for (const { cashier = {} } of _breakdown) {
      const { _id, fullName } = cashier,
        cashierName = nickname(fullName);

      cashiers[_id] = cashierName;
    }

    return Object.entries(cashiers);
  };

  const cashiers = useMemo(() => fetchCashiers(breakdown), [breakdown]);

  useEffect(() => {
    const branchId = activePlatform?.branchId;
    const platformId = activePlatform?._id;
    const cashierId = auth._id;

    if (dateKey && platformId && cashiers.length && !sales.length) {
      const startDate = new Date(dateKey).setHours(0, 0, 0, 0);
      const endDate = new Date(dateKey).setHours(23, 59, 59, 999);

      dispatch(
        BROWSE({
          key: {
            branchId,
            createdAt: startDate,
            endDate,
            ...(activePlatform === "cashier" && { cashierId }), // only show own transactions for cashiers
          },
          token,
        })
      );

      dispatch(PHYSICIANS({ key: { branch: branchId }, token }));
      dispatch(SOURCELIST({ token, key: { clients: branchId } }));

      return () => {
        dispatch(RESET());
        dispatch(PHYSICIANRESET());
        dispatch(SOURCERESET());
      };
    }
  }, [dateKey, token, cashiers, sales, activePlatform, auth, dispatch]);

  const showDeletionMotive = ({ title, text }) =>
    Swal.fire({
      icon: "info",
      title,
      text,
      footer: "Deletion Motive",
    });

  const countTransactions = (_sales) => {
    const deletedCount = _sales.filter((s) => s?.deletedAt).length;

    return Object.entries({
      processed: {
        count: _sales.length - deletedCount,
        title: "Successfully Processed Count",
        color: "primary",
      },
      deleted: {
        count: deletedCount,
        title: "Deleted Count",
        color: "danger",
      },
    });
  };

  const processingDetails = useMemo(() => countTransactions(sales), [sales]);

  // toggle for filtering by cashier
  const isFilteringByCashier = Boolean(filteredCashiers.length),
    // toggle for filtering by cashier
    isFilteringByProcess = Boolean(filteredByProcessing.length);

  return (
    <div className="bg-white py-1 rounded flex-1 ml-2 px-2">
      <div className="d-flex align-items-center justify-content-between">
        <strong className="h3-responsive">Transactions</strong>
        <MDBBtn size="sm" color="primary">
          CENSUS
        </MDBBtn>
      </div>
      <div className="d-flex align-items-center justify-content-between my-3">
        {Boolean(sales.length) && (
          <>
            <div className={`${cashiers.length < 2 && "invisible"}`}>
              {cashiers.map(([key, value]) => {
                const isSelected = filteredCashiers.includes(key),
                  color = isSelected ? "primary" : "default";

                return (
                  <MDBBadge
                    key={key}
                    color={color}
                    pill
                    className="cursor-pointer no-select"
                    onClick={() => {
                      if (isLoading) return;

                      setFilteredCashiers((prev) => {
                        if (isSelected) return prev.filter((p) => p !== key);

                        const newSet = new Set(prev);
                        newSet.add(key);
                        return Array.from(newSet);
                      });
                    }}
                  >
                    {value}
                  </MDBBadge>
                );
              })}
            </div>
            <div>
              {processingDetails.map(([key, { color, title, count }]) => {
                const isSelected = filteredByProcessing.includes(key);

                return (
                  <MDBBadge
                    key={key}
                    color={color}
                    className={`no-select cursor-pointer ${
                      isSelected && "border border-dark"
                    }`}
                    title={title}
                    onClick={() =>
                      setFilteredByProcessing((prev) => {
                        if (isSelected) return prev.filter((p) => p !== key);

                        const newSet = new Set(prev);
                        newSet.add(key);
                        return Array.from(newSet);
                      })
                    }
                  >
                    {count}
                  </MDBBadge>
                );
              })}
            </div>
          </>
        )}
      </div>
      <div>
        {isLoading && (
          <div className="d-flex align-items-center">
            <MDBSpinner className="mx-auto" />
          </div>
        )}
        {!cashiers.length && !isLoading && (
          <MDBTypography noteColor="info" note>
            No transaction for this date
          </MDBTypography>
        )}

        {sales.map((sale = {}, index) => {
          const {
              _id: saleId,
              customerId = {},
              deletedAt,
              remarks = "",
              createdAt,
              renderedAt,
              cashierId,
              payment,
              cash,
              discount,
              amount,
              cart = [],
              physicianId = { fullName: {} },
              source: forwardedBy = {},
            } = sale,
            isDeleted = Boolean(deletedAt),
            customerName = fullName(customerId?.fullName),
            process = isDeleted ? "deleted" : "processed",
            filteredByCashier =
              !isFilteringByCashier ||
              filteredCashiers.includes(cashierId?._id),
            filteredByProcess =
              !isFilteringByProcess || filteredByProcessing.includes(process),
            fetchedSource = sources.find(
              ({ vendors }) => vendors?._id === forwardedBy?._id
            ),
            paymentBadgeColor = paymentBadge(payment);

          return (
            <div
              key={saleId}
              className={`no-select my-2 note note-${
                isDeleted ? "danger" : "primary"
              } ${!filteredByCashier && "d-none"} ${
                !filteredByProcess && "d-none"
              } `}
            >
              <MDBRow>
                <MDBCol size="10">
                  <div className="d-flex align-items-center justify-content-between">
                    <span>
                      {++index}. {customerName}
                    </span>
                    <div>
                      <MDBBadge
                        color="info"
                        title="Time Rendered/Processed"
                        className="cursor-help ml-auto mr-1"
                      >
                        {renderedAt
                          ? new Date(renderedAt).toLocaleTimeString()
                          : "-"}
                      </MDBBadge>
                      <MDBBadge
                        color="primary"
                        title="Time Charged/Created"
                        className="cursor-help ml-auto"
                        style={{ width: "80px" }}
                      >
                        {new Date(createdAt).toLocaleTimeString()}
                      </MDBBadge>
                    </div>
                  </div>
                </MDBCol>
                <MDBCol size="2">
                  <MDBContainer className="d-flex justify-content-end">
                    <MDBDropdown size="sm">
                      <MDBDropdownToggle
                        title={isDeleted ? "Dropdown Menu" : "View Claim Stub"}
                        color={isDeleted ? "light" : "primary"}
                        className="rounded-pill px-3 m-0 py-1"
                        onClick={() => {
                          if (isDeleted) return;

                          generateClaimStub(sale);
                        }}
                      >
                        <MDBIcon icon={isDeleted ? "ellipsis-h" : "eye"} />
                      </MDBDropdownToggle>
                      {isDeleted && (
                        <MDBDropdownMenu right basic>
                          <MDBDropdownItem
                            onClick={() => generateClaimStub(sale)}
                          >
                            Claim Stub
                          </MDBDropdownItem>
                          <MDBDropdownItem
                            onClick={() =>
                              showDeletionMotive({
                                title: customerName,
                                text: remarks,
                              })
                            }
                          >
                            Deletion Motive
                          </MDBDropdownItem>
                        </MDBDropdownMenu>
                      )}
                    </MDBDropdown>
                  </MDBContainer>
                </MDBCol>
              </MDBRow>
              <MDBTable small className="mt-3" bordered>
                <MDBTableHead>
                  <tr>
                    <td colSpan={7}>Details</td>
                  </tr>
                  <tr className="text-right">
                    <th scope="col" className="text-left">
                      Services
                    </th>
                    <th scope="col">Price</th>
                    <th scope="col">Discount</th>
                    <th scope="col">Payment & Amount</th>
                    <th scope="col">Gross</th>
                    <th scope="col">Source</th>
                    <th scope="col">Referral</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  <tr className="text-right">
                    <td className="text-left">
                      {cart?.map(
                        ({ referenceId, abbreviation, description }) => (
                          <MDBBadge
                            key={referenceId}
                            className="mx-1 cursor-help"
                            title={description || abbreviation}
                          >
                            {abbreviation || description}
                          </MDBBadge>
                        )
                      )}
                    </td>
                    <td>{currency(amount, true)}</td>
                    <td>{currency(discount, true)}</td>
                    <td>
                      <MDBBadge color={paymentBadgeColor}>
                        {String(payment).toUpperCase()}
                      </MDBBadge>
                      &nbsp;
                      {currency(cash, true)}
                    </td>
                    <td>{currency(amount - discount, true)}</td>
                    <td>
                      <MDBDropdown>
                        <MDBDropdownToggle
                          color="transparent"
                          className="z-depth-0 p-0 m-0 w-100 mx-auto"
                        >
                          {fetchedSource?.name || "walk-in"}
                        </MDBDropdownToggle>
                        <MDBDropdownMenu basic right>
                          {fetchedSource?.name && (
                            <MDBDropdownItem
                              onClick={() =>
                                dispatch(
                                  TAGGING({
                                    token,
                                    key: {
                                      source: "-",
                                      _id: saleId,
                                    },
                                  })
                                )
                              }
                            >
                              <i>Remove Tagged Source</i>
                            </MDBDropdownItem>
                          )}
                          {sources
                            .filter(({ _id }) => _id !== fetchedSource?._id) // remove active selected source
                            .map(({ _id, name, vendors }) => (
                              <MDBDropdownItem
                                key={_id}
                                onClick={() =>
                                  dispatch(
                                    TAGGING({
                                      token,
                                      key: {
                                        source: vendors?._id,
                                        _id: saleId,
                                      },
                                    })
                                  )
                                }
                              >
                                {name}
                              </MDBDropdownItem>
                            ))}
                        </MDBDropdownMenu>
                      </MDBDropdown>
                    </td>
                    <td>
                      <MDBDropdown>
                        <MDBDropdownToggle
                          color="transparent"
                          className="z-depth-0 p-0 m-0 w-100 mx-auto"
                        >
                          {properFullname(physicianId?.fullName)}
                        </MDBDropdownToggle>
                        <MDBDropdownMenu basic right>
                          {physicianId?._id && (
                            <MDBDropdownItem
                              onClick={() =>
                                dispatch(
                                  TAGGING({
                                    token,
                                    key: {
                                      physician: "-",
                                      _id: saleId,
                                    },
                                  })
                                )
                              }
                            >
                              <i>Remove Tagged Physician</i>
                            </MDBDropdownItem>
                          )}
                          {physicians
                            .filter(({ user }) => user._id !== physicianId?._id) // remove active selected physician
                            .map(({ user }) => {
                              const { _id = "", fullName = {} } = user;

                              return (
                                <MDBDropdownItem
                                  key={_id}
                                  onClick={() =>
                                    dispatch(
                                      TAGGING({
                                        token,
                                        key: {
                                          physician: _id,
                                          _id: saleId,
                                        },
                                      })
                                    )
                                  }
                                >
                                  {properFullname(fullName)}
                                </MDBDropdownItem>
                              );
                            })}
                        </MDBDropdownMenu>
                      </MDBDropdown>
                    </td>
                  </tr>
                </MDBTableBody>
              </MDBTable>
            </div>
          );
        })}
      </div>
    </div>
  );
}
