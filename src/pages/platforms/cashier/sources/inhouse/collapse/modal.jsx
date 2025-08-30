import {
  MDBBtn,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBRow,
  MDBTypography,
} from "mdbreact";
import {
  capitalize,
  fullName,
  getAge,
} from "../../../../../../services/utilities";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TAG } from "../../../../../../services/redux/slices/assets/persons/physicians";
import { SetAFFILIATED } from "../../../../../../services/redux/slices/assets/branches";
import Spinner from "../../../../../../components/spinner";
import findCurrentMain from "./findCurrentMain";
const _form = {
  isMajor: false,
  specialization: "",
  register: {
    fullName: {
      fname: "",
      mname: "",
      lname: "",
    },
    dob: "",
    isMale: false,
    email: "",
  },
};
export default function Modal({ show, toggle, selected, branch }) {
  const { token, auth } = useSelector(({ auth }) => auth),
    { formSubmitted } = useSelector(({ physicians }) => physicians),
    { collections } = useSelector(({ branches }) => branches),
    [form, setForm] = useState(_form),
    dispatch = useDispatch(),
    { name, displayname } = branch;

  const { isRegister = false } = selected;

  useEffect(() => {
    setForm(_form);
    if (show && isRegister) {
      setForm({ register: { ...selected } });
    }
  }, [show, isRegister, selected]);

  const { currentMain, found } = findCurrentMain(collections, selected);
  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      TAG({
        token,
        data: {
          ...form,
          user: selected?._id,
          branch: branch?._id,
          status: "active",
          authID: auth._id,
          isRegister,
          oldMajor: found,
        },
      })
    ).then((action) => {
      dispatch(
        SetAFFILIATED({
          branchID: branch._id,
          physican: action?.payload?.payload,
          isNew: true,
          oldMajor: form.isMajor ? found : {},
        })
      );
      toggle();
    });
  };

  const branchName = name || displayname;
  const { register = {} } = form;
  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      size={isRegister ? "lg" : "md"}
      backdrop
    >
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon fas icon="tag" />{" "}
        <span style={{ fontWeight: "400 !important" }}>
          {fullName(selected?.fullName)}{" "}
          {!isRegister && `| ${getAge(selected?.dob)}`}
        </span>
        <br />
        <h6
          className="text-warning"
          style={{
            fontSize: "1rem",
            marginBottom: "-0.8rem",
            marginLeft: "1.8rem",
          }}
        >
          {capitalize(branchName)}
        </h6>
      </MDBModalHeader>
      <form onSubmit={handleSubmit}>
        <MDBModalBody className="mb-0">
          {isRegister && (
            <>
              <MDBTypography
                note
                noteColor="info"
                noteTitle="Note: "
                className="mx-2"
              >
                This physician is not registered in our database. We need to
                provide some information to register them as a physician.
              </MDBTypography>
              <MDBRow>
                <MDBCol>
                  <MDBInput
                    label="First Name"
                    required
                    value={register?.fullName?.fname || ""}
                    onChange={({ target }) =>
                      setForm({
                        ...form,
                        register: {
                          ...register,
                          fullName: {
                            ...register.fullName,
                            fname: target.value,
                          },
                        },
                      })
                    }
                  />
                </MDBCol>
                <MDBCol>
                  <MDBInput
                    label="Middle Name (Optional)"
                    value={register?.fullName?.mname || ""}
                    onChange={({ target }) =>
                      setForm({
                        ...form,
                        register: {
                          ...register,
                          fullName: {
                            ...register.fullName,
                            mname: target.value,
                          },
                        },
                      })
                    }
                  />
                </MDBCol>
                <MDBCol>
                  <MDBInput
                    label="Last Name"
                    required
                    value={register?.fullName?.lname || ""}
                    onChange={({ target }) =>
                      setForm({
                        ...form,
                        register: {
                          ...register,
                          fullName: {
                            ...register.fullName,
                            lname: target.value,
                          },
                        },
                      })
                    }
                  />
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol>
                  <MDBInput
                    label="Email"
                    required
                    value={register?.email || ""}
                    onChange={({ target }) =>
                      setForm({
                        ...form,
                        register: {
                          ...register,
                          email: target.value,
                        },
                      })
                    }
                    type="email"
                  />
                </MDBCol>
                <MDBCol>
                  <MDBInput
                    label="Date of Birth"
                    type="date"
                    required
                    value={register?.dob || ""}
                    onChange={({ target }) =>
                      setForm({
                        ...form,
                        register: {
                          ...register,
                          dob: target.value,
                          password: target.value.replaceAll("-", ""),
                        },
                      })
                    }
                  />
                </MDBCol>
                <MDBCol>
                  <div className=" mt-3 ">
                    <span style={{ fontWeight: 300 }} className="mr-2 d-block">
                      Gender:
                    </span>
                    <div>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={"female"}
                        checked={!register?.isMale || ""}
                        onChange={() =>
                          setForm({
                            ...form,
                            register: {
                              ...register,
                              isMale: !register?.isMale,
                            },
                          })
                        }
                      />
                      <label
                        htmlFor={"female"}
                        className="form-check-label pl-4 mr-3"
                      >
                        Female
                      </label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={"male"}
                        checked={register?.isMale || ""}
                        onChange={() =>
                          setForm({
                            ...form,
                            register: {
                              ...register,
                              isMale: !register?.isMale,
                            },
                          })
                        }
                      />
                      <label
                        htmlFor={"male"}
                        className="form-check-label  pl-4"
                      >
                        Male
                      </label>
                    </div>
                  </div>
                </MDBCol>
              </MDBRow>
            </>
          )}
          {found?._id && currentMain?._id && (
            <MDBTypography
              note
              noteColor="info"
              noteTitle="Note: "
              className="mx-2"
            >
              Physician current main branch:
              <b style={{ color: "#d63384" }} className="ml-1">
                {capitalize(currentMain?.name || currentMain?.displayname)}
              </b>
            </MDBTypography>
          )}
          <MDBInput
            label="Specialization"
            value={form.specialization}
            required
            onChange={({ target }) =>
              setForm({ ...form, specialization: target.value })
            }
          />

          <div className="d-flex align-items-center ">
            <span style={{ fontWeight: 300 }} className="mr-2">
              Set this branch as the physician’s main branch?
            </span>
            <div>
              <input
                className="form-check-input"
                type="checkbox"
                checked={!form.isMajor}
                id={"SOA-no"}
                onChange={() => setForm({ ...form, isMajor: !form.isMajor })}
              />
              <label htmlFor={"SOA-no"} className="form-check-label pl-4 mr-3">
                No
              </label>
              <input
                className="form-check-input"
                checked={form.isMajor}
                type="checkbox"
                id={"SOA-yes"}
                onChange={() => setForm({ ...form, isMajor: !form.isMajor })}
              />
              <label htmlFor={"SOA-yes"} className="form-check-label  pl-4">
                Yes
              </label>
            </div>
          </div>

          <div className="text-center mt-3">
            <MDBBtn
              color="primary"
              rounded
              size="md"
              disabled={formSubmitted}
              type="submit"
            >
              TAG <Spinner formSubmitted={formSubmitted} />
            </MDBBtn>
          </div>
        </MDBModalBody>
      </form>
    </MDBModal>
  );
}
