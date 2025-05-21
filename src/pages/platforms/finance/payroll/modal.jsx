import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  // MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  // MDBInput,
  MDBTable,
  MDBModalFooter,
} from "mdbreact";
import {
  SAVE,
  // UPDATE,
} from "../../../../services/redux/slices/finance/journals/payments";

import {
  // PAYROLL,
  TOGGLE,
} from "../../../../services/redux/slices/assets/persons/personnels";

// import { isEqual } from "lodash";
import { currency, fullName } from "../../../../services/utilities";

// declare your expected items
const _form = {
  holiday: 0,
  overtime: 0,
  bonus: 0,
  ca: 0,
  absent: 0,
  loan: 0,
};

export default function Modal() {
  const { token, auth } = useSelector(({ auth }) => auth),
    { selected, showModal, toggle, willCreate } = useSelector(
      ({ personnels }) => personnels
    ),
    [form, setForm] = useState(_form),
    [totDeduc, setTotDeduc] = useState(),
    [totEarn, setTotEarn] = useState(),
    dispatch = useDispatch();

  const payCycle = Number(selected?.contract?.pc);

  const handleCalc = useCallback(
    (monthly) => {
      switch (payCycle) {
        case 1:
          return monthly / 2;
        case 2:
          return monthly * 1;
        default:
          return monthly * 3;
      }
    },
    [payCycle] // Now it's a simple variable
  );

  useEffect(() => {
    if (form) {
      setTotDeduc(
        Number(form?.ca) +
          Number(form?.absent * selected?.rate?.daily) +
          Number(form?.loan) +
          selected?.contribution?.ph +
          selected?.contribution?.sss +
          selected?.contribution?.pi
      );
      setTotEarn(
        handleCalc(selected?.rate?.monthly) +
          handleCalc(selected?.rate?.cola) +
          Number(form?.holiday) +
          Number((form?.overtime / 8) * selected?.rate?.daily) +
          Number(form?.bonus)
      );
    }
  }, [form, selected, handleCalc]);

  const handleSubmit = () => {
    const breakdown = {
      deduction: {
        ca: form.ca,
        absent: form.absent,
        loan: form.loan,
        ph: selected?.contribution?.ph,
        sss: selected?.contribution?.sss,
        pi: selected?.contribution?.pi,
      },
      earn: {
        holiday: form.holiday,
        overtime: form.overtime,
        bonus: form.bonus,
        rate: handleCalc(selected?.rate?.monthly),
        cola: handleCalc(selected?.rate?.cola),
      },
      net: totEarn - totDeduc,
    };
    console.log({
      breakdown,
      particular: selected?.user?._id,
      userId: auth._id,
      branchId: selected?.branch._id,
      fsId: 3,
    });
    //console.log(selected);
    dispatch(
      SAVE({
        data: {
          breakdown,
          particular: selected?.user?._id,
          userId: auth._id,
          branchId: selected?.branch._id,
          fsId: 3,
        },
        token,
      })
    );
    toggle();
  };

  // use for direct values like strings and numbers
  const handleValue = (key) =>
    willCreate ? form[key] : form[key] || selected[key];

  const handleChange = (key, value) => setForm({ ...form, [key]: value });
  const handleClose = () => dispatch(TOGGLE());

  console.log("selected", selected);
  return (
    <MDBModal
      isOpen={showModal}
      toggle={handleClose}
      backdrop
      disableFocusTrap={false}
      size="lg"
    >
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {fullName(selected?.user?.fullName)}
        <h6 style={{ marginBottom: "-0.7rem", marginLeft: "1.9rem" }}>
          FRONTDESK | PERMANENT
        </h6>
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        {/* <MDBTable>
          <thead>
            <tr>
              <th></th>
              <th>Earinings</th>
              <th></th>
              <th>Deductions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rate</td>
              <td>{currency(handleCalc(selected?.rate?.monthly))}</td>
              <td>Cash Advance</td>
              <td>
                <input
                  name="ca"
                  value={handleValue("ca")}
                  onChange={(e) => handleChange("ca", e.target.value)}
                  className="form-control"
                />
              </td>
            </tr>
            <tr>
              <td>Cola</td>
              <td>{currency(handleCalc(selected?.rate?.cola))}</td>
              <td>Absent (day)</td>
              <td>
                <input
                  value={handleValue("absent")}
                  onChange={(e) => handleChange("absent", e.target.value)}
                  className="form-control"
                />
              </td>
            </tr>
            <tr>
              <td>Holiday</td>
              <td>
                <input
                  value={handleValue("holiday")}
                  onChange={(e) => handleChange("holiday", e.target.value)}
                  className="form-control"
                />
              </td>
              <td>Loan</td>
              <td>
                <input
                  value={handleValue("loan")}
                  onChange={(e) => handleChange("loan", e.target.value)}
                  className="form-control"
                />
              </td>
            </tr>
            <tr>
              <td>Over Time (Hrs)</td>
              <td>
                <input
                  value={handleValue("overtime")}
                  onChange={(e) => handleChange("overtime", e.target.value)}
                  className="form-control"
                />
              </td>
              <td>Phil. Health</td>
              <td>{currency(selected?.contribution?.ph)}</td>
            </tr>
            <tr>
              <td>Bonus</td>
              <td>
                <input
                  value={handleValue("bonus")}
                  onChange={(e) => handleChange("bonus", e.target.value)}
                  className="form-control"
                />
              </td>
              <td>SSS</td>
              <td>{currency(selected?.contribution?.sss)}</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td>Pag-ibig</td>
              <td> {currency(selected?.contribution?.pi)} </td>
            </tr>
            <tr>
              <td>Gross </td>
              <td>{currency(totEarn)}</td>
              <td></td>
              <td>{currency(totDeduc)}</td>
            </tr>
            <tr>
              <td></td>
              <td>Net</td>
              <td> {currency(totEarn - totDeduc)} </td>
              <td> </td>
            </tr>
          </tbody>
        </MDBTable> */}
        <table style={{ border: "1px solid black" }} className="w-100">
          <thead>
            <tr>
              <th className="border border-dark p-2 font-weight-bold text-center bg-info">
                Earnings
              </th>
              <th className="border border-dark p-2  font-weight-bold text-center bg-info">
                Amount
              </th>
              <th className="border border-dark p-2  font-weight-bold text-center bg-info">
                Deductions
              </th>
              <th className="border border-dark p-2  font-weight-bold text-center bg-info">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ height: "2rem" }}>
              <td
                className="border border-dark p-1"
                style={{ fontWeight: 400 }}
              >
                Rate
              </td>
              <td
                className="border border-dark p-1 text-right"
                style={{ fontWeight: 400 }}
              >
                {currency(handleCalc(selected?.rate?.monthly))}
              </td>
              <td
                className="border border-dark p-1"
                style={{ fontWeight: 400 }}
              >
                Cash Advance
              </td>
              <td className="border border-dark p-1">
                <input
                  name="ca"
                  placeholder="Enter cash advance here..."
                  value={handleValue("ca")}
                  onChange={(e) => handleChange("ca", e.target.value)}
                  className="form-control"
                />
              </td>
            </tr>
            <tr style={{ height: "2.5rem" }}>
              <td
                className="border border-dark p-1"
                style={{ fontWeight: 400 }}
              >
                Cola
              </td>
              <td
                className="border border-dark p-1 text-right"
                style={{ fontWeight: 400 }}
              >
                {currency(handleCalc(selected?.rate?.cola))}
              </td>
              <td
                className="border border-dark p-1"
                style={{ fontWeight: 400 }}
              >
                Absent (day)
              </td>
              <td className="border border-dark p-1">
                <input
                  value={handleValue("absent")}
                  placeholder="Enter absent days here..."
                  onChange={(e) => handleChange("absent", e.target.value)}
                  className="form-control"
                />
              </td>
            </tr>
            <tr style={{ height: "2.5rem" }}>
              <td
                className="border border-dark p-1"
                style={{ fontWeight: 400 }}
              >
                Holiday
              </td>
              <td className="border border-dark p-1">
                <input
                  value={handleValue("holiday")}
                  placeholder="Enter holiday here..."
                  onChange={(e) => handleChange("holiday", e.target.value)}
                  className="form-control"
                />
              </td>
              <td
                className="border border-dark p-1"
                style={{ fontWeight: 400 }}
              >
                Loan
              </td>
              <td className="border border-dark p-1">
                <input
                  value={handleValue("loan")}
                  placeholder="Enter loan here..."
                  onChange={(e) => handleChange("loan", e.target.value)}
                  className="form-control"
                />
              </td>
            </tr>
            <tr style={{ height: "2.5rem" }}>
              <td className="p-1" style={{ fontWeight: 400 }}>
                Over Time (Hrs)
              </td>
              <td className="border border-dark p-1">
                <input
                  value={handleValue("overtime")}
                  placeholder="Enter overtime hours here..."
                  onChange={(e) => handleChange("overtime", e.target.value)}
                  className="form-control"
                />
              </td>
              <td
                className="border border-dark p-1"
                style={{ fontWeight: 400 }}
              >
                Phil. Health
              </td>
              <td
                className="border border-dark p-1 text-right"
                style={{ fontWeight: 400 }}
              >
                {currency(selected?.contribution?.ph)}
              </td>
            </tr>
            <tr style={{ height: "2.5rem" }}>
              <td
                className="border border-dark p-1"
                style={{ fontWeight: 400 }}
              >
                Bonus
              </td>
              <td className="border border-dark p-1">
                <input
                  value={handleValue("bonus")}
                  placeholder="Enter bonus here..."
                  onChange={(e) => handleChange("bonus", e.target.value)}
                  className="form-control"
                />
              </td>
              <td
                className="border border-dark p-1"
                style={{ fontWeight: 400 }}
              >
                SSS
              </td>
              <td
                className="border border-dark p-1 text-right"
                style={{ fontWeight: 400 }}
              >
                {currency(selected?.contribution?.sss)}
              </td>
            </tr>
            <tr style={{ height: "2.5rem" }}>
              <td className="border border-dark"></td>
              <td className="border border-dark"></td>
              <td
                className="border border-dark p-1"
                style={{ fontWeight: 400 }}
              >
                Pag-ibig
              </td>
              <td
                className="border border-dark text-right"
                style={{ fontWeight: 400 }}
              >
                {" "}
                {currency(selected?.contribution?.pi)}{" "}
              </td>
            </tr>
            <tr style={{ height: "2.5rem" }}>
              <td
                className="border border-dark bg-info p-1"
                style={{ fontWeight: 400 }}
              >
                Gross Earnings{" "}
              </td>
              <td
                className="border border-dark bg-info p-1 text-right"
                style={{ fontWeight: 400 }}
              >
                {currency(totEarn)}
              </td>
              <td
                className="border border-dark bg-info p-1"
                style={{ fontWeight: 400 }}
              >
                Total Deductions
              </td>
              <td
                className="border border-dark bg-info p-1 text-right"
                style={{ fontWeight: 400 }}
              >
                {currency(totDeduc)}
              </td>
            </tr>

            <tr style={{ height: "2.5rem" }}>
              <td
                className="border border-dark text-right font-weight-bold  p-1"
                colSpan={3}
              >
                Net Salary
              </td>
              <td className="border border-dark p-1 text-right font-weight-bold">
                {currency(totEarn - totDeduc)}{" "}
              </td>
            </tr>
          </tbody>
        </table>
      </MDBModalBody>
      <MDBModalFooter>
        <button
          onClick={() => {
            handleSubmit();
          }}
          className="btn btn-info"
        >
          Submit
        </button>
      </MDBModalFooter>
    </MDBModal>
  );
}
