import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBModalFooter,
  MDBInput,
  MDBTypography,
} from "mdbreact";
import {
  RESET,
  CLEARANCE_PAY,
} from "../../../../../services/redux/slices/finance/journals/payments";
import {
  SetTERMINATED,
  TOGGLE,
} from "../../../../../services/redux/slices/assets/persons/personnels";

// import { isEqual } from "lodash";
import { currency, fullName } from "../../../../../services/utilities";
import EditableSelect from "../../../../../components/customizable/editableSelect";
import { useToasts } from "react-toast-notifications";

// declare your expected items
const _form = {
  personnel: "",
  breakdown: {
    deduction: 0,
    backPay: 0,
    net: 0,
  },
};

export default function Modal() {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { employees, showModal } = useSelector(({ personnels }) => personnels),
    { formSubmitted, isSuccess } = useSelector(({ payments }) => payments),
    [form, setForm] = useState(_form),
    dispatch = useDispatch(),
    { addToast } = useToasts();

  const toggle = useCallback(() => {
    dispatch(TOGGLE());
  }, [dispatch]);

  useEffect(() => {
    setForm(_form);
    if (!formSubmitted && isSuccess && showModal) {
      toggle();
      dispatch(RESET());
      addToast("Termination Process Completed", {
        appearance: "success",
      });
    }
  }, [isSuccess, formSubmitted, showModal, dispatch, toggle, addToast]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { breakdown, personnel } = form;
    const { backPay, deduction } = breakdown;
    const particular = [...employees].find(({ _id }) => personnel === _id)?.user
      ?._id;

    dispatch(
      CLEARANCE_PAY({
        token,
        data: {
          ...form,
          particular,
          userId: auth._id,
          breakdown: { ...breakdown, net: backPay - deduction },
          fsId: 45,
          branchId: activePlatform.branchId,
        },
      })
    ).then(({ payload }) => {
      const { payload: data } = payload;
      dispatch(SetTERMINATED(data));
    });
  };

  const { breakdown } = form;
  const { deduction, backPay } = breakdown;
  return (
    <MDBModal
      isOpen={showModal}
      toggle={toggle}
      backdrop
      disableFocusTrap={false}
      size="md"
    >
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user-alt-slash" className="mr-2" />
        Clearance Pay
      </MDBModalHeader>
      <form onSubmit={handleSubmit}>
        <MDBModalBody>
          <MDBTypography note noteColor="warning" noteTitle="Note: ">
            Please ensure that the employee has completed the required 1-month
            querying period for clearance validation before releasing the final
            pay. Termination has been confirmed, and the employee will no longer
            be part of the payroll.
          </MDBTypography>
          <EditableSelect
            className="w-100 "
            selectStyle={{ width: "100%" }}
            label="Employee"
            collections={employees.map(({ _id, user }) => ({
              _id: _id,
              name: fullName(user.fullName),
            }))}
            keyForValue="_id"
            keyForText="name"
            onChange={(value) => setForm({ ...form, personnel: value })}
          />
          <MDBInput
            label="Back Pay"
            className="mt-n5"
            required
            value={String(backPay)}
            onChange={(e) =>
              setForm({
                ...form,
                breakdown: { ...breakdown, backPay: Number(e.target.value) },
              })
            }
          />
          <MDBInput
            label="Deduction"
            value={String(deduction)}
            onChange={(e) =>
              setForm({
                ...form,
                breakdown: { ...breakdown, deduction: Number(e.target.value) },
              })
            }
          />

          <span>Total Net: {currency.format(backPay - deduction)}</span>
        </MDBModalBody>
        <MDBModalFooter>
          <button
            disabled={formSubmitted}
            type="submit"
            className="btn btn-info"
          >
            Submit {formSubmitted && <MDBIcon icon="spinner" pulse />}
          </button>
        </MDBModalFooter>
      </form>
    </MDBModal>
  );
}
