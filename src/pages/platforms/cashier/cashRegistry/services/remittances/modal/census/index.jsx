import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBIcon,
  MDBModalHeader,
  MDBBtn,
  MDBCardBody,
  MDBRow,
  MDBCol,
} from "mdbreact";
import {
  TOGGLE,
  CENSUS,
} from "../../../../../../../../services/redux/slices/finance/bookkeeping/remittances";
import Swal from "sweetalert2";
import Breakdown from "./cash";
import Census from "./census";

export default function Index() {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { showCensus, selected, deals, formSubmitted, isSuccess } = useSelector(
      ({ remittances }) => remittances
    ),
    { collections: payments } = useSelector(({ payments }) => payments),
    [census, setCensus] = useState({ menus: [], services: [] }),
    [patients, setPatients] = useState(0),
    [gross, setGross] = useState(0),
    [breakdown, setBreakdown] = useState({}),
    dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;
    if (selected?.census && selected?.census?.menus?.length > 0) {
      setCensus(selected.census);
      setPatients(selected.patients);
      setGross(selected.gross);
      return;
    }
    const fetchCensus = async () => {
      try {
        if (deals.length > 0) {
          setPatients(deals?.length);
          const menuCountMap = {};
          const serviceCountMap = {};
          const paymentSummary = {};

          setGross(
            deals
              .filter((item) => !item.deletedAt)
              .reduce((acc, item) => acc + item.amount, 0)
          );

          deals.forEach(({ cart, amount, payment }) => {
            if (payment && amount) {
              if (!paymentSummary[payment]) {
                paymentSummary[payment] = 0;
              }
              paymentSummary[payment] += amount;
            }

            cart.forEach(({ menuId, packages }) => {
              if (menuId?._id) {
                menuCountMap[menuId._id] = (menuCountMap[menuId._id] || 0) + 1;
              }

              packages.forEach((serviceId) => {
                serviceCountMap[serviceId] =
                  (serviceCountMap[serviceId] || 0) + 1;
              });
            });
          });

          if (isMounted) {
            setCensus({
              menus: menuCountMap,
              services: serviceCountMap,
            });

            setBreakdown(paymentSummary);
          }
        }
      } catch (error) {
        console.error("Failed to fetch census:", error);
      }
    };

    if (selected?.createdAt) fetchCensus();

    return () => {
      isMounted = false;
    };
  }, [selected, token, activePlatform, auth, dispatch, deals]);

  useEffect(() => {
    if (showCensus && isSuccess && !formSubmitted) {
      dispatch(TOGGLE({ key: "census" }));
    }
  }, [isSuccess, formSubmitted, showCensus, dispatch]);

  const censusDate = selected?.createdAt
    ? new Date(selected.createdAt).toLocaleDateString("en-PH") // 'YYYY-MM-DD' in local time
    : "N/A";

  const paymentsSum = payments
    .filter(
      ({ createdAt, amount }) =>
        createdAt &&
        new Date(createdAt).toLocaleDateString("en-PH") === censusDate &&
        amount
    )
    .reduce((sum, { amount }) => sum + Number(amount), 0);
  const handleSubmit = () => {
    const { opening } = selected;
    const breakdownTotal = Object.values(breakdown).reduce(
      (acc, val) => acc + val,
      0
    );
    if (breakdownTotal !== gross) {
      return Swal.fire({
        icon: "warning",
        title: "Inconsistent Sales Detected",
        html: `
            <p style="margin-top: 8px;">
              There seems to be a mismatch in your sales summary.
            </p>
            <p style="margin: 4px 0;">
              Please try logging out and logging back in to refresh your data.
            </p>
            <p style="margin: 4px 0;">
              If the issue persists, kindly inform your system administrator.
            </p>
          `,
        confirmButtonText: "Okay, got it!",
        confirmButtonColor: "#f39c12",
      });
    } else {
      const data = {
        _id: selected._id,
        census,
        breakdown,
        patients,
        sales: gross,
        coh: breakdown.cash + opening.sum - paymentsSum,
        expenses: paymentsSum,
      };
      dispatch(CENSUS({ token, data }));
    }
  };

  return (
    <MDBModal
      isOpen={showCensus}
      toggle={() => dispatch(TOGGLE({ key: "census" }))}
      size="xl"
      backdrop
    >
      <MDBModalHeader
        toggle={() => dispatch(TOGGLE({ key: "census" }))}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="calendar-alt" className="mr-2" />
        Remittance Census : {censusDate}
      </MDBModalHeader>

      {!selected && (
        <p className="font-weight-bold text-danger">
          Please declare your floating cash before proceeding with the census.
        </p>
      )}
      <MDBRow>
        <MDBCol md="9" className="mb-3">
          <Census census={census} />
        </MDBCol>
        <MDBCol md="3">
          <Breakdown
            fc={selected?.opening?.sum || 0}
            breakdown={breakdown}
            gross={gross}
            paymentsSum={paymentsSum}
            patients={patients}
          />
        </MDBCol>
      </MDBRow>

      <MDBCardBody>
        {!!selected && (
          <MDBBtn
            className="w-100"
            color="primary"
            size="sm"
            rounded
            onClick={handleSubmit}
          >
            <strong>Submit</strong>
            {formSubmitted && <MDBIcon icon="spinner" pulse className="ml-2" />}
          </MDBBtn>
        )}
      </MDBCardBody>
    </MDBModal>
  );
}
