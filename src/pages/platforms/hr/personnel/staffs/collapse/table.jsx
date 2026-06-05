import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBCol, MDBRow, MDBIcon, MDBBadge } from "mdbreact";
import { useForm } from "react-hook-form";
import "./styles.css";
import { Access, Policy } from "./../../../../../../services/fakeDb";
import EditableSelect from "./../../../../../../components/customizable/editableSelect";
import AccessModal from "./accessModal";
import { SETOnHotSEAT } from "./../../../../../../services/redux/slices/assets/persons/personnels";
import { capitalize } from "../../../../../../services/utilities";

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
  unit = [],
  rate,
  hasSchedule,
  contribution,
  _id,
  formSubmitted = false,
  isSuccess = false,
  onSubmit,
}) {
  const { activePlatform } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  const [editField, setEditField] = useState(null);
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState({});
  const [dep, setDep] = useState("");
  const { platforms = [] } = staff || {};
  const selectedUnitIds = Array.isArray(unit)
    ? unit.map((value) => String(value))
    : unit
    ? [String(unit)]
    : [];
  const selectedUnitKey = selectedUnitIds.join(",");
  const toggle = () => setShow(!show);
  const taggedPlatforms = platforms
    .map((id) => Access.collections.find((item) => item.id === Number(id)))
    .filter(Boolean);

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
      employmentUnit: selectedUnitIds,
      hasSchedule: hasSchedule || false,
      rateMonthly: rate?.monthly || 0,
      rateCola: rate?.cola || 0,
      rateDaily: rate?.daily || 0,
      contributionPh: contribution?.ph || 0,
      contributionPi: contribution?.pi || 0,
      contributionSss: contribution?.sss || 0,
    });
  }, [reset, contribution, rate, employment, hasSchedule, selectedUnitKey]);

  useEffect(() => {
    resetData();
  }, [employment, resetData]);

  const saveField = handleSubmit((data) => {
    onSubmit(editField, {
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

  const handleDepartmentChange = (e) => {
    setDep(Policy.getDepname(e.target.value));
  };
  const department =
    watch("employmentDepartment") ||
    Policy.getDepartment(employment?.designation);
  const availableUnits = Policy.getUnitsByDepartmentName(department);
  const selectedUnits = (Array.isArray(unit) ? unit : [])
    .map((id) => Policy.units.find((item) => item.id === Number(id)))
    .filter(Boolean);
  const inlineUnits = selectedUnits.slice(0, 3);
  const extraUnits = selectedUnits.length - inlineUnits.length;
  const hiddenUnitsLabel = selectedUnits
    .slice(3)
    .map(({ name }) => name)
    .join(", ");
  const isHonorarium = employment?.soe === "Honorarium";
  return (
    <>
      <MDBRow>
        {/* Employment */}
        <MDBCol md={"4"}>
          <h5>Employment Contract Details</h5>
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
              {[...Policy.getByCategory(activePlatform?.branch?.category)]
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
          <div className="editable-field d-flex align-items-start mt-1">
            <strong
              style={{ fontSize: "0.9rem", color: "#757575" }}
              className="text-nowrap"
            >
              Unit:
            </strong>
            <div className="ml-2 flex-grow-1">
              {editField === "employmentUnit" ? (
                <EditableSelect
                  collections={availableUnits}
                  keyForValue="id"
                  keyForText="name"
                  preValues={unit}
                  getObject
                  fieldData={{
                    _id,
                    id: selectedUnitIds,
                    name: inlineUnits.map(({ code }) => code).join(", ") || "N/A",
                  }}
                  className="m-0 p-0 unit-editable-select"
                  inputClassName="m-0 p-0"
                  classNameTxt="ml-0"
                  parentClassName="d-flex align-items-center w-100"
                  multiple
                  isEditable
                  isCapitalize={false}
                  displayTag="span"
                  startOpen
                  formSubmitted={formSubmitted}
                  iSuccess={isSuccess}
                  onClose={() => setEditField(null)}
                  onSave={(data) => {
                    onSubmit("employmentUnit", {
                      _id,
                      employmentUnit: (Array.isArray(data.id) ? data.id : [])
                        .map((item) =>
                          typeof item === "object" && item !== null ? item.id : item
                        )
                        .filter((value) => value !== undefined && value !== null)
                        .map(Number)
                        .filter((value) => Number.isFinite(value)),
                    });
                  }}
                />
              ) : (
                <div
                  className="d-flex flex-wrap align-items-center cursor-pointer"
                  style={{ gap: "0.25rem" }}
                  onClick={() => setEditField("employmentUnit")}
                  title={hiddenUnitsLabel || undefined}
                >
                  {inlineUnits.length > 0 ? (
                    <>
                      {inlineUnits.map(({ id, code, name }) => (
                        <MDBBadge
                          key={id}
                          pill
                          title={name}
                          className="m-0"
                          style={{ fontSize: "0.62rem", fontWeight: 500 }}
                        >
                          {code}
                        </MDBBadge>
                      ))}
                      {extraUnits > 0 && (
                        <small className="text-muted" title={hiddenUnitsLabel}>
                          +{extraUnits} more
                        </small>
                      )}
                    </>
                  ) : (
                    <span>N/A</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </MDBCol>

        {/* Rate */}
        <MDBCol md={!isHonorarium ? "3" : "4"}>
          <h5>Rate</h5>
          <hr />
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
          {[
            ...(!isHonorarium
              ? [
                  {
                    label: "Monthly",
                    name: "rateMonthly",
                    value: rate?.monthly,
                  },
                  {
                    label: "Daily",
                    name: "rateDaily",
                    value: rate?.daily,
                  },
                  { label: "COLA", name: "rateCola", value: rate?.cola },
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

          <EditableField
            label="Schedule"
            fieldName="hasSchedule"
            {...{
              editField,
              setEditField,
              errors,
              saveField,
              handleCancel,
              value: hasSchedule ? "Included" : "Excluded",
            }}
          >
            <select
              {...register("hasSchedule")}
              className={`form-control form-control-sm ${
                errors.hasSchedule ? "is-invalid" : ""
              }`}
              defaultValue={hasSchedule ? "true" : "false"}
            >
              <option value="true">Included</option>
              <option value="false">Excluded</option>
            </select>
          </EditableField>
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
            {taggedPlatforms?.length > 0 && (
              <MDBIcon
                icon="pencil-alt"
                className="cursor-pointer ml-2"
                onClick={handleOnHotSeat}
                style={{ fontSize: "1rem", color: "blue" }}
              />
            )}
          </div>
          <hr />
          {taggedPlatforms?.length > 0 ? (
            taggedPlatforms.map((acc, index) => (
              <MDBBadge
                key={index}
                className="mr-1 mb-1"
                pill
                style={{ fontSize: "13px", fontWeight: 400 }}
              >
                {capitalize(acc.name || acc.platform)}
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
            </div>
          )}
        </MDBCol>
      </MDBRow>
      <AccessModal show={show} toggle={toggle} selected={selected} />
    </>
  );
}
