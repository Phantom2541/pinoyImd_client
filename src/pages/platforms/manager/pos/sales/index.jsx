import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  MANAGERUPDATE,
  RESET,
} from "../../../../../services/redux/slices/commerce/sales";
import { currency, fullName, axioKit } from "../../../../../services/utilities";
import { capitalize } from "lodash";
import { Categories } from "../../../../../services/fakeDb";
import Swal from "sweetalert2";
import Months from "../../../../../services/fakeDb/calendar/months";
import {
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBTable,
  MDBIcon,
  MDBBadge,
} from "mdbreact";
export default function Sales() {
  const [sales, setSales] = useState([]),
    [view, setView] = useState("all"),
    [total, setTotal] = useState(0),
    [daily, setDaily] = useState({}),
    { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ sales }) => sales),
    // { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    // { collections } = useSelector(({ sales }) => sales),
    dispatch = useDispatch();

  console.log("unused variable setView", setView);
  //Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId && auth._id) {
      const today = new Date().setHours(0, 0, 0, 0);

      dispatch(
        BROWSE({
          token,
          key: {
            branchId: activePlatform?.branchId,
            createdAt: today,
          },
        })
      );
    }

    const today = new Date();
    axioKit
      .universal("finance/pre-calculated-daily-sale/find", token, {
        month: Months[today.getMonth()],
        day: today.getDate(),
        year: today.getFullYear(),
        cashier: auth._id,
        branch: activePlatform?.branchId,
      })
      .then((item) => {
        setDaily(item);
      })
      .catch((error) => {
        console.error("Error fetching daily sale:", error);
      });

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, auth]);
  console.log(daily);

  //Set fetched data for mapping
  useEffect(() => {
    if (!!collections.length) {
      console.log(collections);
      const sales =
        view === "all"
          ? collections
          : collections.filter(({ perform }) => perform === view);
      setTotal(sales.reduce((a, c) => a + c.amount, 0));
      setSales(sales);
    }
  }, [collections, view]);

  //Modal toggle
  // const toggleCashRegister = () => setShowCashRegister(!showCashRegister);

  //Search function
  // const handleSearch = async (willSearch, key) => {
  //   if (willSearch) {
  //     setView("all");
  //     setSales(globalSearch(collections, key));
  //   } else {
  //     setSales(collections);
  //   }
  // };

  const generateStub = (sale) => ({
    ...sale,
    customer: {
      fullName: sale.customerId?.fullName,
      address: `${
        sale.customerId?.address?.barangay &&
        `${sale.customerId?.address?.barangay}, `
      }${sale.customerId?.address?.city}`,
    },
    cashier: sale.cashierId?.fullName,
    cart: sale.cart,
  });

  const handleView = (selected) => {
    localStorage.setItem("claimStub", JSON.stringify(generateStub(selected)));
    window.open(
      "/printout/claimstub",
      "Claim Stub",
      "top=100px,left=100px,width=550px,height=750px"
    );
  };

  // const handleCashRegister = (selected) => {
  //   Swal.fire({
  //     icon: "info",
  //     text: "Temporarily disabled.",
  //   });
  //   // setSelected({
  //   //   ...selected.customerId,
  //   //   category: selected.category,
  //   //   saleId: selected._id,
  //   //   soldCart: selected.cart,
  //   // });
  //   // toggleCashRegister();
  // };

  const handleDelete = async ({ _id }) => {
    const { value: remarks } = await Swal.fire({
      title: "Are you sure?",
      text: "Please, specify a reason.",
      input: "text",
      inputPlaceholder: "Remarks",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Proceed",
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });

    if (remarks) {
      const today = new Date();

      dispatch(
        MANAGERUPDATE({
          token,
          key: {
            _id,
            remarks,
            cash: 0,
            amount: 0,
            month: Months[today.getMonth()],
            day: today.getDate(),
            year: today.getFullYear(),
            deletedAt: today.toLocaleString(),
          },
        })
      );
    }
  };

  const handleAmountUpdate = async ({ _id, amount: _amount }) => {
    const { value: amount } = await Swal.fire({
      title: "Enter new amount.",
      text: `Old amount is ${currency(_amount)}.`,
      input: "number",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Proceed",
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });

    if (amount) {
      dispatch(
        MANAGERUPDATE({
          token,
          key: { _id, amount },
        })
      );
    }
  };
  return (
    <>
      <MDBCard>
        <MDBCardHeader className="d-flex justify-content-between">
          <h5>{`${
            view === "all" ? `Sales Summaries` : capitalize(view)
          } :  ${currency(total)} @ ${sales.length} Patient/s`}</h5>
        </MDBCardHeader>
        <MDBCardBody>
          <MDBTable>
            <thead>
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Physician</th>
                <th>Amount</th>
                <th>Services</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sales?.map((sale, index) => {
                console.log(sale);
                return (
                  <tr key={`sales-${index + 1}`}>
                    <td>{index + 1}.</td>
                    <td>
                      <h6>{fullName(sale.customerId.fullName)}</h6>
                      <small>
                        {capitalize(
                          sale.category === "walkin"
                            ? sale.category
                            : Categories.find(
                                ({ abbr }) => abbr === sale.category
                              ).name
                        )}
                        @ {new Date(sale.createdAt).toLocaleTimeString()}
                      </small>
                    </td>
                    <td>
                      <h6>
                        {sale.physicianId?.fullName.lname && (
                          <h6>Dr. {sale.physicianId.fullName.lname}</h6>
                        )}
                      </h6>
                      <p>{sale.source?.companyName || sale.source?.name}</p>
                    </td>
                    <td>
                      <h6>
                        {currency(sale.amount)}{" "}
                        <MDBIcon
                          icon="pencil-alt"
                          className="mr-2"
                          title="Print Reciept"
                          onClick={() => handleAmountUpdate(sale)}
                        />
                      </h6>

                      <p>
                        {sale.payment}
                        <MDBIcon
                          icon="receipt"
                          className="mr-2"
                          title="Print Reciept"
                          onClick={() => handleView(sale)}
                        />
                      </p>
                    </td>

                    <td>
                      {sale.cart?.map((menu) => (
                        <MDBBadge key={menu.referenceId} className="mx-1">
                          {menu?.abbreviation}
                        </MDBBadge>
                      ))}
                    </td>
                    <td>{sale.remarks}</td>
                    <td>
                      <MDBIcon
                        icon="trash"
                        className="mr-2"
                        title="Delete Sales"
                        onClick={() => handleDelete(sale)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </MDBTable>
        </MDBCardBody>
      </MDBCard>
      {/* <Modal show={showModal} toggle={toggleModal} willCreate={willCreate} /> */}
    </>
  );
}
