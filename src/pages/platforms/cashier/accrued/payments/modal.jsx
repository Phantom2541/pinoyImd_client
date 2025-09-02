import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SAVE,
  RESET,
} from "../../../../../services/redux/slices/finance/journals/payments";
import cash from "../../../../../assets/paymentMethods/cash.png";
import transfer from "../../../../../assets/paymentMethods/transfer.png";
import gcash from "../../../../../assets/paymentMethods/gcash.png";
import cheque from "../../../../../assets/paymentMethods/cheque.png";
import {
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBInput,
  MDBBtn,
  MDBIcon,
  MDBCard,
} from "mdbreact";
import { Statements } from "../../../../../services/fakeDb";
import { Select } from "../../../../../components/customizable";
import { SelectUser } from "../../../../../components/searchables";
import Swal from "sweetalert2";

const paymentMethods = [
  { text: "Cash", img: cash },
  { text: "Gcash", img: gcash },
  { text: "Transfer", img: transfer },
  { text: "Check", img: cheque },
];

const _form = {
  orOption: "",
  category: "Cash",
  amount: 0,
  fsId: "",
};

export default function Modal({ show, toggle = () => {} }) {
  const dispatch = useDispatch();
  const { formSubmitted } = useSelector(({ payments }) => payments),
    { collections } = useSelector(({ providers }) => providers),
    { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form);

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.fsId) {
      return Swal.fire({
        title: "Financial Statement Required",
        text: "You need to select a financial statement before proceeding.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    }
    const formData = {
      ...form,
      userId: auth._id,
      branchId: activePlatform.branchId,
    };

    dispatch(SAVE({ data: formData, token })).then(() => {
      dispatch(RESET());
      setForm(_form);
      toggle();
    });
  };

  const handleSuppliers = () => {
    return [...collections].map((supplier) => {
      const { vendors = null, displayname } = supplier;

      return {
        value: supplier._id,
        label: vendors ? vendors.name : displayname,
      };
    });
  };
  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop={true} size="m">
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        Payment
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSave}>
          <Select
            collections={
              Array.isArray(Statements?.collections)
                ? Statements.collections.filter(
                    (statement) => statement?.category === "expenses"
                  )
                : []
            }
            label={"Financial Statement"}
            className="m-0 p-0"
            preValue={form.fsId}
            keys={"id"}
            values={"title"}
            onChange={(value) => setForm({ ...form, fsId: Number(value) })}
          />
          <div className="d-flex align-item-center w-100">
            <div style={{ width: form.orOption ? "35%" : "100%" }}>
              <select
                className="browser-default custom-select"
                value={form.orOption || ""}
                onChange={(e) => {
                  setForm({ ...form, orOption: e.target.value });
                }}
              >
                <option value="" disabled>
                  Select a payee
                </option>
                <option value="Particular">Particular</option>
                <option value="Supplier">Supplier</option>
              </select>
            </div>
            {form.orOption && (
              <div style={{ marginBottom: "-1rem" }} className="w-100">
                {form.orOption === "Particular" ? (
                  <div
                    className="w-100 ml-3"
                    style={{
                      marginTop: !form.particular ? "-1.6rem" : "0.8rem",
                    }}
                  >
                    <SelectUser
                      setUser={(user) =>
                        setForm({ ...form, particular: user?._id })
                      }
                      label="Search Particular"
                      displayWithLabel={false}
                      // setPatient={(user) => console.log("user", user)}
                    />
                  </div>
                ) : form.orOption === "Supplier" ? (
                  <Select
                    collections={handleSuppliers()}
                    label="Supplier"
                    className="m-0 p-0 ml-3"
                    keys="value"
                    values="label"
                    onChange={(e) => setForm({ ...form, supplier: e })}
                  />
                ) : null}{" "}
              </div>
            )}
          </div>
          <h6 className="mt-3 grey-text">Payment Methods:</h6>
          <div className="d-flex align-items-center justify-content-center ">
            {paymentMethods.map(({ img, text }, index) => (
              <MDBCard
                key={index}
                onClick={() => setForm({ ...form, category: text })}
                className={`mr-2 d-flex align-items-center justify-content-center cursor-pointer ${
                  text === form.category
                    ? "active-payment-method"
                    : "payment-method"
                }`}
                style={
                  index === 3
                    ? {
                        height: "3.6rem",
                        width: "6rem ",
                        border: "red 2px solid black",
                      }
                    : {}
                }
              >
                <img
                  style={{
                    width: index === 3 ? "5rem" : "6rem",
                    height: index === 3 ? "2.8rem" : "3.5rem",
                  }}
                  src={img}
                  alt={text}
                />
              </MDBCard>
            ))}
          </div>

          <MDBInput
            label="Amount"
            style={{ marginTop: "-0.5rem" }}
            required
            type="number"
            value={form.amount || ""}
            onChange={({ target }) =>
              setForm({ ...form, amount: Number(target.value) })
            }
          />

          <MDBInput
            label="Remarks"
            value={form?.remarks}
            onChange={({ target }) =>
              setForm({ ...form, remarks: target.value })
            }
          />
          <MDBBtn
            color="primary"
            className="float-right"
            disabled={formSubmitted}
            type="submit"
          >
            Save
            {formSubmitted && <MDBIcon icon="spinner" pulse className="ml-2" />}
          </MDBBtn>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
