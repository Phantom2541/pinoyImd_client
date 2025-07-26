import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { MDBCol, MDBRow, MDBIcon, MDBBadge } from "mdbreact";
import { useForm } from "react-hook-form";
import "./styles.css";
import { Policy } from "./../../../../../../services/fakeDb";
import AccessModal from "./accessModal";
import {
  SETOnHotSEAT,
  DESTROY,
} from "./../../../../../../services/redux/slices/assets/persons/personnels";
import Swal from "sweetalert2";

function EditableField({
  label,
  fieldName,
  editField,
  setEditField,
  errors,
  saveField,
  handleCancel,
  value,
  children,
}) {
  const isEditing = editField === fieldName;

  return (
    <div className="editable-field d-flex align-items-center mt-1">
      <strong
        style={{ fontSize: "0.9rem", color: "#757575" }}
        className="text-nowrap"
      >
        {label}:
      </strong>
      {isEditing ? (
        <div className="input-inline ml-2 position-relative">
          {children}
          <MDBIcon
            icon="check"
            className="icon-inline"
            onClick={() => saveField(fieldName)}
          />
          <MDBIcon
            icon="times"
            className="icon-inline cancel"
            onClick={handleCancel}
          />
          {errors[fieldName] && (
            <div className="invalid-feedback">{errors[fieldName].message}</div>
          )}
        </div>
      ) : (
        <span className="ml-2" onClick={() => setEditField(fieldName)}>
          {value || "N/A"}
        </span>
      )}
    </div>
  );
}

export default function CollapseTable({
  employment,
  staff,
  rate,
  contribution,
  _id,
  onSubmit,
}) {
  const dispatch = useDispatch();
  const [editField, setEditField] = useState(null);
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState({});
  const [dep, setDep] = useState("");
  const { access = [] } = staff || {};
  const toggle = () => setShow(!show);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const resetData = useCallback(() => {
    setDep(Policy.getDepartment(employment?.designation));
    reset({
      employmentHor: employment?.hos || 0,
      employmentSoe: employment?.soe || "",
      employmentPc: employment?.pc || 0,
      employmentDesignation: employment?.designation || "",
      rateMonthly: rate?.monthly || 0,
      rateCola: rate?.cola || 0,
      rateDaily: rate?.daily || 0,
      contributionPh: contribution?.ph || 0,
      contributionPi: contribution?.pi || 0,
      contributionSss: contribution?.sss || 0,
    });
  }, [reset, contribution, rate, employment]);

  useEffect(() => {
    resetData();
  }, [employment, resetData]);

  const saveField = handleSubmit((data) => {
    onSubmit({
      _id,
      ...data,
    });
    setEditField(null);
  });

  const handleCancel = () => {
    resetData();
    setEditField(null);
  };

  const handleOnHotSeat = (e) => {
    e.preventDefault();
    dispatch(SETOnHotSEAT(staff));
    setSelected(staff);
    toggle();
  };

  const handleRemove = (e) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DESTROY);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };

  const handleDepartmentChange = (e) => {
    setDep(Policy.getDepname(e.target.value));
  };
  const department =
    watch("employmentDepartment") ||
    Policy.getDepartment(employment?.designation);
  const isHonorarium = employment?.soe === "Honorarium";

  return (
    <>
      <MDBRow>
        {/* Employment */}
        <MDBCol md={"4"}>
          <h5>Employment</h5>
          <hr />
          <EditableField
            label="Hours of Service"
            fieldName="employmentHor"
            {...{
              editField,
              setEditField,
              errors,
              saveField,
              handleCancel,
              value: employment?.hos,
            }}
          >
            <input
              type="number"
              {...register("employmentHor")}
              className={`form-control form-control-sm ${
                errors.employmentHor ? "is-invalid" : ""
              }`}
            />
          </EditableField>

          <EditableField
            label="Status of Employment"
            fieldName="employmentSoe"
            {...{
              editField,
              setEditField,
              errors,
              saveField,
              handleCancel,
              value: employment?.soe,
            }}
          >
            <select
              {...register("employmentSoe")}
              className={`form-control form-control-sm ${
                errors.employmentSoe ? "is-invalid" : ""
              }`}
            >
              <option value="Contractual">Contractual</option>
              <option value="Reliever">Reliever</option>
              <option value="Permanent">Permanent</option>
              <option value="Honorarium">Honorarium</option>
            </select>
          </EditableField>

          <EditableField
            label="Department"
            fieldName="employmentDepartment"
            {...{
              editField,
              setEditField,
              errors,
              saveField,
              handleCancel,
              value: !!dep ? dep : "N/A",
            }}
          >
            <select
              {...register("employmentDepartment")}
              className={`form-control form-control-sm ${
                errors.employmentDepartment ? "is-invalid" : ""
              }`}
              value={department}
              onChange={(e) => {
                register("employmentDepartment").onChange(e);
                handleDepartmentChange(e);
              }}
            >
              <option value="">-- Select Department --</option>
              {[...Policy.collections]
                .sort((a, b) => a.department.localeCompare(b.department))
                .map((dept) => (
                  <option key={dept.department} value={dept.department}>
                    {dept.department.toLocaleUpperCase()}
                  </option>
                ))}
            </select>
          </EditableField>
          <EditableField
            label="Designation"
            fieldName="employmentDesignation"
            {...{
              editField,
              setEditField,
              errors,
              saveField,
              handleCancel,
              value: Policy.getPositions(employment?.designation),
            }}
          >
            <select
              {...register("employmentDesignation")}
              className={`form-control form-control-sm ${
                errors.employmentDesignation ? "is-invalid" : ""
              }`}
            >
              <option value="">-- Select Designation --</option>
              {Policy.getPositionsByDepartmentName(department).map((pos) => (
                <option key={pos.id} value={pos.id}>
                  {pos.display_name}
                </option>
              ))}
            </select>
          </EditableField>

          <EditableField
            label="Payment Cycle"
            fieldName="employmentPc"
            {...{
              editField,
              setEditField,
              errors,
              saveField,
              handleCancel,
              value:
                employment?.pc === 1
                  ? "Bi Monthly"
                  : employment?.pc === 2
                  ? "Monthly"
                  : "Quarterly",
            }}
          >
            <select
              {...register("employmentPc")}
              className={`form-control form-control-sm ${
                errors.employmentPc ? "is-invalid" : ""
              }`}
            >
              <option value={1}>Bi Monthly</option>
              <option value={2}>Monthly</option>
              <option value={3}>Quarterly</option>
            </select>
          </EditableField>
        </MDBCol>

        {/* Rate */}
        <MDBCol md={!isHonorarium ? "3" : "4"}>
          <h5>Rate</h5>
          <hr />
          {[
            ...(!isHonorarium
              ? [
                  {
                    label: "Monthly Rate",
                    name: "rateMonthly",
                    value: rate?.monthly,
                  },
                  { label: "COLA", name: "rateCola", value: rate?.cola },
                  {
                    label: "Daily Rate",
                    name: "rateDaily",
                    value: rate?.daily,
                  },
                ]
              : [
                  {
                    label: "Incentive Rate",
                    name: "incentive",
                    value: rate?.incentive,
                  },
                ]),
          ].map((field) => (
            <EditableField
              key={field.name}
              label={field.label}
              fieldName={field.name}
              {...{
                editField,
                setEditField,
                errors,
                saveField,
                handleCancel,
                value: field.value,
              }}
            >
              <input
                type="number"
                {...register(field.name)}
                className={`form-control form-control-sm ${
                  errors[field.name] ? "is-invalid" : ""
                }`}
              />
            </EditableField>
          ))}
        </MDBCol>

        {/* Contributions */}
        {!isHonorarium && (
          <MDBCol md={"2"}>
            <h5>Contribution</h5>
            <hr />
            {[
              { label: "PH", name: "contributionPh", value: contribution?.ph },
              {
                label: "Pag Ibig",
                name: "contributionPi",
                value: contribution?.pi,
              },
              {
                label: "SSS",
                name: "contributionSss",
                value: contribution?.sss,
              },
            ].map((field) => (
              <EditableField
                key={field.name}
                label={field.label}
                fieldName={field.name}
                {...{
                  editField,
                  setEditField,
                  errors,
                  saveField,
                  handleCancel,
                  value: field.value,
                }}
              >
                <input
                  type="number"
                  {...register(field.name)}
                  className={`form-control form-control-sm ${
                    errors[field.name] ? "is-invalid" : ""
                  }`}
                />
              </EditableField>
            ))}
          </MDBCol>
        )}

        {/* Access */}
        <MDBCol md={!isHonorarium ? "3" : "4"}>
          <div className="d-flex  align-items-center">
            <h5 className="mb-0">Access</h5>
            {access?.length > 0 && (
              <MDBIcon
                icon="pencil-alt"
                className="cursor-pointer ml-2"
                onClick={handleOnHotSeat}
                style={{ fontSize: "1rem", color: "blue" }}
              />
            )}
          </div>
          <hr />
          {access?.length > 0 ? (
            access.map((acc, index) => (
              <MDBBadge
                key={index}
                className="mr-2 mb-3"
                pill
                style={{ fontSize: "15px", fontWeight: 500 }}
              >
                {acc.platform}
              </MDBBadge>
            ))
          ) : (
            <div className="text-center">
              <p>No access</p>
              <p>
                <span
                  className="text-primary font-weight-bold"
                  style={{ cursor: "pointer" }}
                  onClick={handleOnHotSeat}
                >
                  Click here
                </span>{" "}
                to grant access
              </p>
              <p>
                <span
                  className="text-primary font-weight-bold"
                  style={{ cursor: "pointer" }}
                  onClick={handleRemove}
                >
                  Click here
                </span>{" "}
                to remove the personnel
              </p>
            </div>
          )}
        </MDBCol>
      </MDBRow>
      <AccessModal show={show} toggle={toggle} selected={selected} />
    </>
  );
}
