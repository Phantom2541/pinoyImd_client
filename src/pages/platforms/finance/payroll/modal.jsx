import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  // MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  // MDBInput,
  MDBModalFooter,
} from "mdbreact";
import {
  SAVE,
  RESET,
  // UPDATE,
} from "../../../../services/redux/slices/finance/journals/payments";

import {
  // PAYROLL,
  SetPAYROLL,
  TOGGLE,
} from "../../../../services/redux/slices/assets/persons/personnels";

// import { isEqual } from "lodash";
import { currency, fullName } from "../../../../services/utilities";
import { Policy } from "../../../../services/fakeDb";

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
    { selected, showModal, willCreate } = useSelector(
      ({ personnels }) => personnels
    ),
    { formSubmitted, isSuccess } = useSelector(({ payments }) => payments),
    [form, setForm] = useState(_form),
    [totDeduc, setTotDeduc] = useState(),
    [totEarn, setTotEarn] = useState(),
    dispatch = useDispatch();

  const payCycle = Number(selected?.contract?.pc);

  const toggle = useCallback(() => dispatch(TOGGLE()), [dispatch]);

  useEffect(() => {
    setForm(_form);
    if (!formSubmitted && isSuccess && showModal) {
      toggle();
      dispatch(RESET());
    }
  }, [isSuccess, formSubmitted, showModal, dispatch, toggle]);

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
    const { isAquincena = false } = selected;
    const breakdown = {
      deduction: {
        ca: form.ca,
        absent: form.absent,
        loan: form.loan,
        ph: selected?.contribution?.ph,
        sss: selected?.contribution?.sss,
        pi: selected?.contribution?.pi,
        total: totDeduc,
      },
      earn: {
        holiday: form.holiday,
        overtime: form.overtime,
        bonus: form.bonus,
        rate: handleCalc(selected?.rate?.monthly),
        cola: handleCalc(selected?.rate?.cola),
        total: totEarn,
      },
      net: totEarn - totDeduc,
      isAquincena,
    };

    //console.log(selected);
    dispatch(
      SAVE({
        data: {
          breakdown,
          particular: selected?.user?._id,
          userId: auth._id,
          branchId: selected?.branch._id,
          fsId: 13,
        },
        token,
      })
    ).then(({ payload }) => {
      const { payload: data } = payload;
      dispatch(SetPAYROLL(data));
    });
    // toggle();
  };

  // use for direct values like strings and numbers
  const handleValue = (key) =>
    willCreate ? form[key] : form[key] || selected[key];

  const handleChange = (key, value) => setForm({ ...form, [key]: value });
  const handleClose = () => dispatch(TOGGLE());
  const { contract = {} } = selected;
  const designation = Policy.getPosition(Number(contract?.designation));

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
          {designation?.toUpperCase()} | {contract?.soe?.toUpperCase()}
        </h6>
      </MDBModalHeader>
      <MDBModalBody className="mb-0 m-0 p-1">
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
                Monthly
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
                  type="number"
                  placeholder="Enter cash advance here..."
                  value={String(handleValue("ca"))}
                  onChange={(e) => handleChange("ca", Number(e.target.value))}
                  className="form-control"
                />
              </td>
            </tr>
            <tr style={{ height: "2.5rem" }}>
              <td
                className="border border-dark p-1"
                style={{ fontWeight: 400 }}
              >
                Daily
              </td>
              <td
                className="border border-dark p-1 text-right"
                style={{ fontWeight: 400 }}
              >
                {currency(handleCalc(selected?.rate?.daily))}
              </td>
              <td
                className="border border-dark p-1"
                style={{ fontWeight: 400 }}
              >
                Absent (day)
              </td>
              <td className="border border-dark p-1">
                <input
                  value={String(handleValue("absent"))}
                  type="number"
                  placeholder="Enter number of absent days..."
                  onChange={(e) =>
                    handleChange("absent", Number(e.target.value))
                  }
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
                Loan
              </td>
              <td className="border border-dark p-1">
                <input
                  value={String(handleValue("loan"))}
                  placeholder="Enter loan here..."
                  onChange={(e) => handleChange("loan", Number(e.target.value))}
                  className="form-control"
                  type="number"
                />
              </td>
            </tr>
            <tr style={{ height: "2.5rem" }}>
              <td
                className="border border-dark p-1"
                style={{ fontWeight: 400 }}
              >
                Holiday (days)
              </td>
              <td className="border border-dark p-1">
                <input
                  value={String(handleValue("holiday"))}
                  type="number"
                  placeholder="Enter number of holiday days..."
                  onChange={(e) =>
                    handleChange("holiday", Number(e.target.value))
                  }
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
                Over Time (Hrs)
              </td>
              <td className="border border-dark p-1">
                <input
                  value={String(handleValue("overtime"))}
                  type="number"
                  placeholder="Enter overtime hours here..."
                  onChange={(e) =>
                    handleChange("overtime", Number(e.target.value))
                  }
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
              <td
                className="border border-dark p-1"
                style={{ fontWeight: 400 }}
              >
                Bonus
              </td>
              <td className="border border-dark p-1">
                <input
                  value={String(handleValue("bonus") || "")}
                  placeholder="Enter bonus here..."
                  onChange={(e) =>
                    handleChange("bonus", Number(e.target.value))
                  }
                  className="form-control"
                />
              </td>
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
              <td className="border border-dark text-right   p-1" colSpan={3}>
                <h5 className="mt-1" style={{ fontWeight: 500 }}>
                  Net Salary
                </h5>
              </td>
              <td className="border border-dark p-1 text-right">
                <h5 className="mt-1" style={{ fontWeight: 500 }}>
                  {currency(totEarn - totDeduc)}{" "}
                </h5>
              </td>
            </tr>
          </tbody>
        </table>
      </MDBModalBody>
      <MDBModalFooter>
        <button
          disabled={formSubmitted}
          onClick={() => {
            handleSubmit();
          }}
          className="btn btn-info"
        >
          Submit {formSubmitted && <MDBIcon icon="spinner" pulse />}
        </button>
      </MDBModalFooter>
    </MDBModal>
  );
}
