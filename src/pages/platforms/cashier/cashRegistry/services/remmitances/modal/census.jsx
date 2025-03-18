import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBRow,
  MDBCol,
} from "mdbreact";
import {
  TOGGLE,
  UPDATE as CENSUSSAVE,
} from "./../../../../../../../services/redux/slices/finance/bookkeeping/remittances";
import {
  CASHIER,
  RESET,
} from "./../../../../../../../services/redux/slices/commerce/pos/services/deals";
import { currency } from "./../../../../../../../services/utilities";

export default function Census() {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { month, year, day, showCensus, selected } = useSelector(
      ({ remittances }) => remittances
    ),
    { collections } = useSelector(({ deals }) => deals),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId && auth._id) {
      /**
       *   Construct date from state
       * */
      const selectedDate = new Date(year, month, day);
      selectedDate.setHours(0, 0, 0, 0);

      // dispatch(
      //   CASHIER({
      //     token,
      //     key: {
      //       branchId: activePlatform?.branchId,
      //       cashierId: auth._id,
      //       date: selectedDate,
      //     },
      //   })
      // );
    }

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, auth, month, year, day]);

  const handleCensus = () => {
    dispatch(
      CENSUSSAVE({
        _id: selected._id,
        menus: selected.menus,
        services: selected.services,
        patient: selected.patient,
        expenses: selected.expenses,
      })
    );
  };

  return (
    <MDBModal
      isOpen={showCensus}
      toggle={() => dispatch(TOGGLE({ key: "census" }))}
      size="lg"
      backdrop
    >
      <MDBModalHeader
        toggle={() => dispatch(TOGGLE({ key: "census" }))}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="calendar-alt" className="mr-2" />
        census
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        {collections.map((collection) => {
          return (
            <MDBRow className="mb-2">
              <MDBCol size="10" className="text-left">
                {collection?.customer?.fullName}
              </MDBCol>
              <MDBCol size="2" className="text-right">
                {currency(collection?.amount)}
              </MDBCol>
            </MDBRow>
          );
        })}
      </MDBModalBody>
    </MDBModal>
  );
}
