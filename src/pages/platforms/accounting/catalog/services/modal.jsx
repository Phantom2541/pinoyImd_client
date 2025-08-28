import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOptions,
  MDBSelectOption,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
} from "mdbreact";
import { References } from "../../../../../services/fakeDb";
import Swal from "sweetalert2";
import {
  SAVE,
  UPDATE,
} from "../../../../../services/redux/slices/diagnostics/laboratory/preferences";
import EditableSelect from "../../../../../components/customizable/editableSelect";

export default function Modal({
  show,
  toggle,
  serviceId,
  preference,
  references,
  willCreate,
  selected,
}) {
  const { isLoading } = useSelector(({ preferences }) => preferences),
    [form, setForm] = useState({
      lo: 0,
      hi: 0,
      units: "",
      warn: 0,
      alert: 0,
      critical: 0,
    }),
    { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  const key = preference === "gender" ? "isMale" : "development";

  useEffect(() => {
    if (selected._id) setForm(selected);
  }, [selected]);

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const askConsent = (existing, _id) =>
    Swal.fire({
      title: "This category already exists.",
      text: `Proceeding will override ${existing}.`,
      icon: "info",
      confirmButtonText: "Proceed",
    }).then((res) => {
      if (res.isConfirmed) {
        toggle();

        dispatch(
          UPDATE({
            token,
            data: {
              ...form,
              _id,
            },
          })
        );
      }
    });

  const handleQuery = () => {
    toggle();

    if (willCreate)
      return dispatch(
        SAVE({
          token,
          data: {
            ...form,
            serviceId,
            branchId: activePlatform?.branchId,
            userId: auth._id,
          },
        })
      );

    dispatch(
      UPDATE({
        token,
        data: form,
      })
    );
  };

  const validateDevelopment = () => {
    const isExisting = references.find(
      (ref) => String(ref[key]) === String(form.development)
    );

    if (willCreate && isExisting)
      return askConsent(
        References.preferences.development[form.development],
        isExisting._id
      );

    handleQuery();
  };

  const validateGender = () => {
    const isExisting = references.find(
      (ref) => ref[key] === Boolean(form.isMale)
    );

    if (willCreate && isExisting)
      return askConsent(
        References.preferences.gender[form.isMale],
        isExisting._id
      );

    handleQuery();
  };

  const handleError = (text) =>
    Swal.fire({
      icon: "error",
      title: "Invalid Parameters",
      text,
    });

  const validateHierarchy = ({ lo, hi, warn, alert, critical }) =>
    lo < hi && hi < warn && warn < alert && alert < critical;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateHierarchy(form))
      return handleError(
        "Please input proper references. Hierarchy  of values is must."
      );

    // if (!form.units) return handleError("Please select a unit of measurement.");

    if (preference !== "equal" && !form.hasOwnProperty(key))
      return handleError("Please select a category.");

    switch (preference) {
      case "development":
        validateDevelopment();
        break;

      case "gender":
        validateGender();
        break;

      default:
        handleQuery();
        break;
    }
  };

  const { lo, hi, warn, alert, critical, snug } = form;
  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="lg">
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="flask" className="mr-2" />
        {willCreate ? "Create" : "Update"} a Reference Value
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBRow>
            <MDBCol>
              {preference !== "equal" && (
                <MDBSelect
                  getValue={(e) => handleChange(key, Number(e[0]))}
                  className="colorful-select dropdown-primary mt-2 mb-0 hidden-md-down"
                >
                  <MDBSelectInput selected="Category" />
                  <MDBSelectOptions>
                    {References.preferences[preference]?.map(
                      (choice, index) => (
                        <MDBSelectOption
                          key={`choice-${index}`}
                          value={String(index)}
                        >
                          {choice.name ? choice.name : choice}
                          {choice.ageGap ? `(${choice.ageGap})` : ""}
                        </MDBSelectOption>
                      )
                    )}
                  </MDBSelectOptions>
                </MDBSelect>
              )}
            </MDBCol>
          </MDBRow>
          <b>
            <u> Warning Threshold (Low) </u>
          </b>

          <MDBRow className="mb-0">
            <MDBCol>
              <MDBInput
                required
                value={snug}
                onChange={(e) => handleChange("snug", Number(e.target.value))}
                type="number"
                label="Minimum Allowable Value"
              />
            </MDBCol>
          </MDBRow>
          <b>
            <u> Normal Range </u>
          </b>

          <MDBRow className="mb-0">
            <MDBCol>
              <MDBInput
                required
                value={lo}
                onChange={(e) => handleChange("lo", Number(e.target.value))}
                type="number"
                label="Normal Range (Min)"
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                required
                value={hi}
                onChange={(e) => handleChange("hi", Number(e.target.value))}
                type="number"
                label="Normal Range (Max)"
              />
            </MDBCol>
            <MDBCol md="3">
              <EditableSelect
                collections={References.units}
                label="Units"
                className="mt-4 p-1"
                onChange={(e) => handleChange("units", e)}
              />
            </MDBCol>
          </MDBRow>
          <b>
            <u> Upper Thresholds</u>
          </b>

          <MDBRow className="mb-0">
            <MDBCol>
              <MDBInput
                value={warn}
                onChange={(e) => handleChange("warn", Number(e.target.value))}
                required
                type="number"
                label="Warning Threshold (High)"
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                value={alert}
                onChange={(e) => handleChange("alert", Number(e.target.value))}
                required
                type="number"
                label="Panic Range (Min)"
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                value={critical}
                onChange={(e) =>
                  handleChange("critical", Number(e.target.value))
                }
                required
                type="number"
                label="Panic Range (Max)"
              />
            </MDBCol>
          </MDBRow>
          <div className="text-center mb-1-half">
            <MDBBtn
              type="submit"
              disabled={isLoading}
              color="info"
              className="mb-2"
              rounded
            >
              {willCreate ? "submit" : "update"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
