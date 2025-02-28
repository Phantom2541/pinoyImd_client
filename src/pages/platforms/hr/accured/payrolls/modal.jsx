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
} from "../../../../../services/redux/slices/responsibilities/liabilities";
// import { isEqual } from "lodash";
import { currency } from "../../../../../services/utilities";

// declare your expected items
const _form = {
  holiday: 0,
  overtime: 0,
  bonus: 0,
  ca: 0,
  absent: 0,
  loan: 0,
};

export default function Modal({ show, toggle, selected, willCreate }) {
  const { token, auth } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    [totDeduc, setTotDeduc] = useState(),
    [totEarn, setTotEarn] = useState(),
    dispatch = useDispatch();
  const handleCalc = useCallback(
    monthly => {
      const payCycle = Number(selected?.contract?.pc);
      switch (payCycle) {
        case 1:
          return monthly / 2;
        case 2:
          return monthly * 1;

        default:
          return monthly * 3;
      }
    },
    [selected?.contract?.pc]
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
        handleCalc(selected?.rate?.monthly / 2) +
          handleCalc(selected?.rate?.cola / 2) +
          Number(form?.holiday) +
          Number((form?.overtime / 8) * selected?.rate?.daily) +
          Number(form?.bonus)
      );
    }
  }, [form, selected, handleCalc]);

  const handleSubmit = () => {
    //console.log(selected);
    dispatch(
      SAVE({
        data: {
          ...form,
          particular: selected?.user?._id,
          userId: auth._id,
          branchId: selected?.branch._id,
          fsId: 3,
          net: totEarn - totDeduc,
          rate: handleCalc(selected?.rate?.monthly / 2),
          cola: handleCalc(selected?.rate?.cola / 2),
        },
        token,
      })
    );
    toggle();
  };

  // use for direct values like strings and numbers
  const handleValue = key =>
    willCreate ? form[key] : form[key] || selected[key];

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      backdrop
      disableFocusTrap={false}
      size="lg"
    >
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        Payroll
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBTable>
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
              <td>{currency(handleCalc(selected?.rate?.monthly / 2))}</td>
              <td>Cash Advance</td>
              <td>
                <input
                  name="ca"
                  value={handleValue("ca")}
                  onChange={e => handleChange("ca", e.target.value)}
                  className="form-control"
                />
              </td>
            </tr>
            <tr>
              <td>Cola</td>
              <td>{currency(handleCalc(selected?.rate?.cola / 2))}</td>
              <td>Absent (day)</td>
              <td>
                <input
                  value={handleValue("absent")}
                  onChange={e => handleChange("absent", e.target.value)}
                  className="form-control"
                />
              </td>
            </tr>
            <tr>
              <td>Holiday</td>
              <td>
                <input
                  value={handleValue("holiday")}
                  onChange={e => handleChange("holiday", e.target.value)}
                  className="form-control"
                />
              </td>
              <td>Loan</td>
              <td>
                <input
                  value={handleValue("loan")}
                  onChange={e => handleChange("loan", e.target.value)}
                  className="form-control"
                />
              </td>
            </tr>
            <tr>
              <td>Over Time (Hrs)</td>
              <td>
                <input
                  value={handleValue("overtime")}
                  onChange={e => handleChange("overtime", e.target.value)}
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
                  onChange={e => handleChange("bonus", e.target.value)}
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
        </MDBTable>
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
