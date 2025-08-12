import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBModalFooter,
} from "mdbreact";
import {
  SAVE,
  RESET,
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
  holiday: {
    regular: {
      present: 0,
      absent: 0,
    },
    special: 0, // this if for number of present days
  },
  overtime: 0,
  nightShift: 0,
  bonus: 0,
  ca: 0,
  absent: 0,
  loan: 0,
};

export default function Modal() {
  const { token, auth } = useSelector(({ auth }) => auth),
    { selected, showModal, willCreate, year, month } = useSelector(
      ({ personnels }) => personnels
    ),
    { formSubmitted, isSuccess } = useSelector(({ payments }) => payments),
    [form, setForm] = useState(_form),
    [holidayAmount, setHolidayAmount] = useState({
      // this is for breakdown sallary of holiday
      regular: { present: 0, absent: 0 },
      special: 0,
    }),
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
      const { rate = {} } = selected;
      const { daily, cola, monthly } = rate;
      const { holiday } = form;
      const { regular, special } = holiday;

      const regularHolidayPresent = regular.present * daily * 2;
      const regularHolidayAbsent = regular.absent * daily;
      const regularHolidaySalary = regularHolidayPresent + regularHolidayAbsent;
      const specialHolidaySalary = daily * special * 1.3;
      const holidaySalary = regularHolidaySalary + specialHolidaySalary;
      const overtime = Number(form?.overtime) * (daily / 8) * 1.25;
      const nightShift = Number(form?.nightShift) * daily * 0.1;

      setTotEarn(
        handleCalc(monthly) +
          handleCalc(cola) +
          holidaySalary +
          overtime +
          nightShift +
          Number(form?.bonus)
      );
      setHolidayAmount({
        regular: {
          present: regularHolidayPresent,
          absent: regularHolidayAbsent,
        },
        special: specialHolidaySalary,
      });
    }
  }, [form, selected, handleCalc]);

  const formattedCreatedAt = () => {
    const { isAquincena = false } = selected;
    const lastDay = new Date(year, month, 0).getDate();

    const offset =
      payCycle === 1 ? { day: isAquincena ? 15 : lastDay } : { day: lastDay };

    const date = new Date(year, month - 1 + (offset.month || 0), offset.day);
    date.setHours(0, 0, 0, 0); // Set oras to 00:00:00
    return date;
  };

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
        nightShift: form.nightShift,
        rate: handleCalc(selected?.rate?.monthly),
        cola: handleCalc(selected?.rate?.cola),
        total: totEarn,
      },
      net: totEarn - totDeduc,
      isAquincena,
    };
    dispatch(
      SAVE({
        data: {
          breakdown,
          particular: selected?.user?._id,
          userId: auth._id,
          branchId: selected?.branch._id,
          createdAt: formattedCreatedAt(),
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

  const { holiday = {} } = form;
  const { regular = {}, special = 0 } = holiday;
  const hourlyRate = selected?.rate?.daily / 8;
  const dailyRate = selected?.rate?.daily;

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
                {currency.format(handleCalc(selected?.rate?.monthly))}
              </td>
              <td
                className="border border-dark p-1"
                style={{ fontWeight: 400 }}
              >
                Cash Advance
              </td>
              <td className="border border-dark p-1">
                <input
                  style={{
                    height: "1.9rem",
                    fontSize: "0.9rem",
                  }}
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
                {currency.format(selected?.rate?.daily)}
              </td>
              <td
                className="border border-dark p-1"
                style={{ fontWeight: 400 }}
              >
                Absent (day)
              </td>
              <td className="border border-dark p-1">
                <div className="d-flex align-items-center justify-content-between">
                  <input
                    value={String(handleValue("absent"))}
                    style={{
                      width: "7.8rem",
                      height: "1.9rem",
                      fontSize: "0.9rem",
                    }}
                    type="number"
                    placeholder="Absent days..."
                    onChange={(e) =>
                      handleChange("absent", Number(e.target.value))
                    }
                    className="form-control"
                  />
                  <h6>
                    {currency.format(
                      handleValue("absent") * selected?.rate?.daily
                    )}
                  </h6>
                </div>
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
                {currency.format(handleCalc(selected?.rate?.cola))}
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
                  style={{
                    height: "1.9rem",
                    fontSize: "0.9rem",
                  }}
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
                Regular Holiday
              </td>
              <td className="border border-dark p-1">
                <div>
                  <div className="d-flex alin-items-center justify-content-between">
                    <input
                      value={String(regular.present || "")}
                      style={{
                        height: "1.5rem",
                        fontSize: "0.9rem",
                        width: "7.8rem",
                      }}
                      type="number"
                      placeholder="Present days"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          holiday: {
                            ...holiday,
                            regular: {
                              ...regular,
                              present: Number(e.target.value),
                            },
                          },
                        })
                      }
                      className="form-control"
                    />
                    <h6>{currency.format(holidayAmount?.regular?.present)}</h6>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <input
                      value={String(regular.absent || "")}
                      style={{
                        height: "1.5rem",
                        fontSize: "0.9rem",
                        width: "7.8rem",
                      }}
                      type="number"
                      placeholder="Absent days"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          holiday: {
                            ...holiday,
                            regular: {
                              ...regular,
                              absent: Number(e.target.value),
                            },
                          },
                        })
                      }
                      className="form-control"
                    />
                    <h6>{currency.format(holidayAmount?.regular?.absent)}</h6>
                  </div>
                </div>
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
                {currency.format(selected?.contribution?.ph)}
              </td>
            </tr>
            <tr style={{ height: "2.5rem" }}>
              <td
                className="border border-dark p-1"
                style={{ fontWeight: 400 }}
              >
                Special Holiday
              </td>
              <td className="border border-dark p-1">
                <div className="d-flex align-items-center justify-content-between">
                  <input
                    value={String(special || "")}
                    style={{
                      width: "7.8rem",
                      height: "1.9rem",
                      fontSize: "0.9rem",
                    }}
                    type="number"
                    placeholder="Present days"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        holiday: {
                          ...holiday,
                          special: Number(e.target.value),
                        },
                      })
                    }
                    className="form-control"
                  />
                  <h6>{currency.format(holidayAmount?.special)}</h6>
                </div>
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
                {currency.format(selected?.contribution?.sss)}
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
                <div className="d-flex align-items-center justify-content-between">
                  <input
                    style={{
                      width: "7.8rem",
                      height: "1.9rem",
                      fontSize: "0.9rem",
                    }}
                    value={String(handleValue("overtime"))}
                    type="number"
                    placeholder="OT hours"
                    onChange={(e) =>
                      handleChange("overtime", Number(e.target.value))
                    }
                    className="form-control"
                  />
                  <h6>
                    {currency.format(
                      handleValue("overtime") * hourlyRate * 1.25
                    )}
                  </h6>
                </div>
              </td>
              <td
                className="border border-dark p-1"
                style={{ fontWeight: 400 }}
              >
                Pag-ibig
              </td>
              <td
                className="border border-dark text-right p-1"
                style={{ fontWeight: 400 }}
              >
                {currency.format(selected?.contribution?.ph)}{" "}
              </td>
            </tr>
            <tr style={{ height: "2.5rem" }}>
              <td
                className="border border-dark p-1"
                style={{ fontWeight: 400 }}
              >
                Night Shift (Duty)
              </td>
              <td className="border border-dark p-1">
                <div className="d-flex align-items-center justify-content-between">
                  <input
                    style={{
                      width: "7.8rem",
                      height: "1.9rem",
                      fontSize: "0.9rem",
                    }}
                    value={String(handleValue("nightShift") || "")}
                    placeholder="Night shift"
                    type="number"
                    onChange={(e) =>
                      handleChange("nightShift", Number(e.target.value))
                    }
                    className="form-control"
                  />
                  <h6>
                    {currency.format(
                      handleValue("nightShift") * dailyRate * 0.1
                    )}
                  </h6>
                </div>
              </td>
              <td
                className="border border-dark p-1"
                style={{ fontWeight: 400 }}
              ></td>
              <td
                className="border border-dark text-right"
                style={{ fontWeight: 400 }}
              ></td>
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
                  style={{
                    height: "1.9rem",
                    fontSize: "0.9rem",
                  }}
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
              ></td>
              <td
                className="border border-dark text-right"
                style={{ fontWeight: 400 }}
              ></td>
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
                {currency.format(totEarn)}
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
                {currency.format(totDeduc)}
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
                  {currency.format(totEarn - totDeduc)}{" "}
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
