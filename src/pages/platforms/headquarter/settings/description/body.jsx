import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import {
  RESET,
  PatchSessionPlatform,
} from "../../../../../services/redux/slices/assets/persons/auth";
import { UPDATE } from "../../../../../services/redux/slices/assets/companies";
import AddressSelect from "../../../../../components/searchables/addressSelect";
import Swal from "sweetalert2";
import Logo from "../logo";
import EditableField from "../../../../../components/customizable/editableField";
import "./style.css";

export default function DescriptionBody() {
  const { addToast } = useToasts();
  const { message, isSuccess, activePlatform } = useSelector(
    ({ auth }) => auth
  );

  const { branch = {} } = activePlatform;
  const { companyId = {} } = branch;

  const [isValueFocused, setIsValueFocused] = useState(false);
  const [valuePreview, setValuePreview] = useState(
    Array.isArray(companyId?.vl)
      ? companyId?.vl.join("\n")
      : companyId?.vl || ""
  );

  const dispatch = useDispatch();

  const contactCards = [
    {
      label: "Email",
      keyForValue: "email",
      value: companyId?.contacts?.email || "",
      updateKey: "contacts.email",
      title: "Click to edit email",
    },
    {
      label: "Phone Number",
      keyForValue: "mobile",
      value: companyId?.contacts?.mobile || "",
      updateKey: "contacts.mobile",
      title: "Click to edit phone number",
    },
  ];

  const storyFields = [
    {
      label: "Description",
      keyForValue: "description",
      value: companyId?.description || "",
      updateKey: "description",
      title: "Click to edit description",
    },
    {
      label: "Tagline",
      keyForValue: "tagline",
      value: companyId?.tagline || "",
      updateKey: "tagline",
      title: "Click to edit tagline",
    },
  ];

  const directionFields = [
    {
      label: "Mission",
      keyForValue: "ms",
      value: companyId?.ms || "",
      updateKey: "ms",
      title: "Click to edit mission",
    },
    {
      label: "Vision",
      keyForValue: "vs",
      value: companyId?.vs || "",
      updateKey: "vs",
      title: "Click to edit vision",
    },
  ];

  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }
    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  const handleUpdate = ({ _id, key, value }) => {
    let data = { _id };

    if (key?.includes(".")) {
      const keys = key.split(".");
      const nested = keys.reduceRight((acc, curr) => ({ [curr]: acc }), value);
      data = { ...data, ...nested };
    } else {
      data[key] = value;
    }

    dispatch(UPDATE({ data })).then(({ payload }) => {
      const updatedCompany = payload?.payload || companyId;

      dispatch(
        PatchSessionPlatform({
          data: {
            ...activePlatform,
            branch: {
              ...branch,
              companyId: updatedCompany,
            },
          },
          isBranch: true,
        })
      );

      Swal.fire({
        title: "Success!",
        text: "Company information updated.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    });
  };

  const renderedValues = (Array.isArray(valuePreview)
    ? valuePreview
    : String(valuePreview).split("\n")
  ).filter((line) => line.trim() !== "");

  return (
    <div className="companyDescription-container">
      <div className="companyDescription-header">
        <div className="companyDescription-hero">
          <div className="companyDescription-branding">
            <div className="companyDescription-logoPanel">
              <Logo />
            </div>

            <div className="companyDescription-headerWrapper">
              <span className="companyDescription-kicker">Company profile</span>
              <h1 className="companyDescription-name">
                {companyId?.name || "Unnamed Company"}
              </h1>
              <p className="companyDescription-subtitle">
                Keep your company identity polished with a cleaner profile,
                better contact details, and more readable branding content.
              </p>
            </div>
          </div>

          <div className="companyDescription-summaryGrid">
            {contactCards.map(({ label, value }) => (
              <div key={label} className="companyDescription-summaryItem">
                <span className="companyDescription-summaryLabel">{label}</span>
                <strong className="companyDescription-summaryValue">
                  {value || "Not set yet"}
                </strong>
              </div>
            ))}

            <div className="companyDescription-summaryItem">
              <span className="companyDescription-summaryLabel">Tagline</span>
              <strong className="companyDescription-summaryValue">
                {companyId?.tagline || "No tagline yet"}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="companyDescription-grid">
        <section className="companyDescription-card companyDescription-cardWide">
          <div className="companyDescription-cardHeader">
            <div>
              <span className="companyDescription-sectionKicker">
                Branch location
              </span>
              <h2 className="companyDescription-sectionTitle">
                Address Information
              </h2>
            </div>
          </div>

          <div
            className="patient-personal-info address-grid companyDescription-addressGrid"
            data-title="Address Information"
          >
            <AddressSelect
              address={branch?.address}
              handleChange={(key, val) =>
                handleUpdate({
                  _id: companyId._id,
                  key: `address.${key}`,
                  value: val,
                })
              }
            />

            <div className="companyDescription-field">
              <label className="companyDescription-label">Street (Optional)</label>
              <EditableField
                title="Click to edit street"
                type="string"
                width="100%"
                keyForValue="street"
                fieldData={{
                  _id: companyId._id,
                  street: branch?.address?.street || "",
                }}
                onSave={(data) =>
                  handleUpdate({
                    _id: companyId._id,
                    key: "address.street",
                    value: data.street,
                  })
                }
                formSubmitted={false}
                isSuccess={isSuccess}
              />
            </div>
          </div>
        </section>

        <section className="companyDescription-card">
          <div className="companyDescription-cardHeader">
            <div>
              <span className="companyDescription-sectionKicker">
                Reachability
              </span>
              <h2 className="companyDescription-sectionTitle">
                Contact Details
              </h2>
            </div>
          </div>

          <div className="companyDescription-stack">
            {contactCards.map(
              ({ label, keyForValue, value, updateKey, title }) => (
                <div key={label} className="companyDescription-field">
                  <label className="companyDescription-label">{label}</label>
                  <EditableField
                    title={title}
                    type="string"
                    width="100%"
                    keyForValue={keyForValue}
                    fieldData={{
                      _id: companyId._id,
                      [keyForValue]: value,
                    }}
                    onSave={(data) =>
                      handleUpdate({
                        _id: companyId._id,
                        key: updateKey,
                        value: data[keyForValue],
                      })
                    }
                    formSubmitted={false}
                    isSuccess={isSuccess}
                  />
                </div>
              )
            )}
          </div>
        </section>

        <section className="companyDescription-card companyDescription-cardWide">
          <div className="companyDescription-cardHeader">
            <div>
              <span className="companyDescription-sectionKicker">
                Brand story
              </span>
              <h2 className="companyDescription-sectionTitle">
                Company Overview
              </h2>
            </div>
          </div>

          <div className="companyDescription-stack">
            {storyFields.map(
              ({ label, keyForValue, value, updateKey, title }) => (
                <div key={label} className="companyDescription-field">
                  <label className="companyDescription-label">{label}</label>
                  <EditableField
                    title={title}
                    type="textarea"
                    width="100%"
                    keyForValue={keyForValue}
                    fieldData={{
                      _id: companyId._id,
                      [keyForValue]: value,
                    }}
                    onSave={(data) =>
                      handleUpdate({
                        _id: companyId._id,
                        key: updateKey,
                        value: data[keyForValue],
                      })
                    }
                    formSubmitted={false}
                    isSuccess={isSuccess}
                  />
                </div>
              )
            )}
          </div>
        </section>

        <section className="companyDescription-card companyDescription-cardWide">
          <div className="companyDescription-cardHeader">
            <div>
              <span className="companyDescription-sectionKicker">
                Direction
              </span>
              <h2 className="companyDescription-sectionTitle">
                Mission and Vision
              </h2>
            </div>
          </div>

          <div className="companyDescription-twoColumn">
            {directionFields.map(
              ({ label, keyForValue, value, updateKey, title }) => (
                <div key={label} className="companyDescription-field">
                  <label className="companyDescription-label">{label}</label>
                  <EditableField
                    title={title}
                    type="textarea"
                    width="100%"
                    keyForValue={keyForValue}
                    fieldData={{
                      _id: companyId._id,
                      [keyForValue]: value,
                    }}
                    onSave={(data) =>
                      handleUpdate({
                        _id: companyId._id,
                        key: updateKey,
                        value: data[keyForValue],
                      })
                    }
                    formSubmitted={false}
                    isSuccess={isSuccess}
                  />
                </div>
              )
            )}
          </div>
        </section>

        <section className="companyDescription-card companyDescription-cardWide">
          <div className="companyDescription-cardHeader">
            <div>
              <span className="companyDescription-sectionKicker">Identity</span>
              <h2 className="companyDescription-sectionTitle">Core Values</h2>
            </div>
          </div>

          <div className="companyDescription-valuesLayout">
            <div className="companyDescription-field">
              <label className="companyDescription-label">
                Value statements
              </label>
              <EditableField
                title="Click to edit core values"
                type="textarea"
                width="100%"
                height="100%"
                keyForValue="vl"
                fieldData={{
                  _id: companyId._id,
                  vl: Array.isArray(valuePreview)
                    ? valuePreview.join("\n")
                    : valuePreview,
                }}
                onSave={(data) => {
                  const newValues = data.vl
                    .split("\n")
                    .map((v) => v.trim())
                    .filter((v) => v.length > 0);

                  setValuePreview(newValues);
                  handleUpdate({
                    _id: companyId._id,
                    key: "vl",
                    value: newValues,
                  });
                }}
                onFocus={() => setIsValueFocused(true)}
                onBlur={() => setIsValueFocused(false)}
                formSubmitted={false}
                isSuccess={isSuccess}
              />
            </div>

            <div
              className={`companyDescription-valuesPreview ${
                isValueFocused ? "is-active" : ""
              }`}
            >
              <div className="companyDescription-valuesPreviewHeader">
                <span className="companyDescription-sectionKicker">
                  Live preview
                </span>
                <h3 className="companyDescription-valuesTitle">
                  How your values will read
                </h3>
              </div>

              <ul className="companyDescription-valuesList">
                {renderedValues.map((line, idx) => {
                  const normalizedLine = line.replace(/â€“|–/g, "-");
                  const [title, ...rest] = normalizedLine.split("-");
                  const detail = rest.join("-").trim();

                  return (
                    <li key={idx} className="companyDescription-valueItem">
                      <strong>{title.trim()}</strong>
                      <span>{detail || "Add a short explanation here."}</span>
                    </li>
                  );
                })}

                {!renderedValues.length && (
                  <li className="companyDescription-valueItem is-empty">
                    <strong>No values yet</strong>
                    <span>
                      Add one value per line to build a cleaner company profile.
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
