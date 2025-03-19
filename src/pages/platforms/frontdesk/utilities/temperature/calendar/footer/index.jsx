import React from "react";
import { MDBBtn, MDBBtnGroup, MDBIcon } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  SAVE,
  UPDATE,
} from "../../../../../../../services/redux/slices/monitoring/temperature";
const Footer = ({ dateCell, txt }) => {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth);
  const { collections } = useSelector(({ temperatures }) => temperatures);
  const entry = collections?.find(
    (entry) =>
      new Date(entry?.createdAt).toDateString() === dateCell.toDateString()
  );
  const dispatch = useDispatch();

  const handleTempInput = async (type, meridiem) => {
    const { value: temp } = await Swal.fire({
      title: `Input ${type} ${meridiem} Temp`,
      input: "number",
      inputLabel: "*Only 2 decimals",
      inputPlaceholder: "Enter temperature",
      inputAttributes: { step: "0.01" },
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
    });

    if (temp) {
      dispatch(
        entry
          ? UPDATE({
              data: {
                _id: entry._id,
                branchId: activePlatform?.branchId,
                userId: auth._id,
                createdAt: entry.createdAt,
                [meridiem]: {
                  ...entry?.[meridiem],
                  [type]: temp,
                },
              },
              token,
            })
          : SAVE({
              data: {
                branchId: activePlatform?.branchId,
                userId: auth._id,
                createdAt: txt,
                [meridiem]: { [type]: temp },
              },
              token,
            })
      );
      Swal.fire(`Entered ${type} ${meridiem} Temp: ${temp} on ${txt}`);
    }
  };
  return (
    <MDBBtnGroup className="sales-card-footer w-100">
      <MDBBtn
        type="button"
        className="m-0"
        size="sm"
        color="primary"
        title="AM Room"
        // onClick={() => false}
        onClick={() => handleTempInput("room", "AM")}
      >
        <MDBIcon icon="thermometer" />
      </MDBBtn>

      <MDBBtn
        type="button"
        className="m-0 "
        size="sm"
        color="primary"
        // onClick={() => false}
        title="AM Fridge"
        onClick={() => handleTempInput("ref", "AM")}
      >
        <MDBIcon icon="thermometer" />
      </MDBBtn>
      <MDBBtn
        type="button"
        className="m-0 "
        size="sm"
        color="success"
        title="PM Room"
        // onClick={() => false}
        onClick={() => handleTempInput("room", "PM")}
      >
        <MDBIcon icon="thermometer" />
      </MDBBtn>
      <MDBBtn
        type="button"
        className="m-0 "
        size="sm"
        color="success"
        title="PM Fridge"
        // onClick={() => false}
        onClick={() => handleTempInput("ref", "PM")}
      >
        <MDBIcon icon="thermometer" />
      </MDBBtn>
    </MDBBtnGroup>
  );
};

export default Footer;
