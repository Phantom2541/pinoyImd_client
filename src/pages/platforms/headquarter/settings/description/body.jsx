import React, { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { ENDPOINT } from "../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import {
  RESET,
  SetActivePlatform,
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

  const logo = `${ENDPOINT}/public/companies/${encodeURIComponent(
    companyId.name
  )}/profile/logo.png`;

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
        SetActivePlatform({
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

  return (
    <div className="companyDescription-container">
      {/* Header */}
      <div className="companyDescription-header">
        <Logo />
        <div className="companyDescription-header-wrapper">
          <span className="companyDescription-name">{companyId?.name}</span>
          <div
            className="patient-personal-info address-grid mt-4"
            data-title="Address Information"
          >
            {/* Address */}
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

            {/* Street */}
            <div>
              <label className="mt-2">Street (Optional)</label>
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

          {/* Contact Info */}
          <div className="d-flex mt-3" style={{ gap: "20px" }}>
            <div className="w-50">
              <label>
                <strong>Email</strong>
              </label>
              <EditableField
                title="Click to edit email"
                type="string"
                width="100%"
                keyForValue="email"
                fieldData={{
                  _id: companyId._id,
                  email: companyId?.contacts?.email || "",
                }}
                onSave={(data) =>
                  handleUpdate({
                    _id: companyId._id,
                    key: "contacts.email",
                    value: data.email,
                  })
                }
                formSubmitted={false}
                isSuccess={isSuccess}
              />
            </div>

            <div className="w-50">
              <label>
                <strong>Phone Number</strong>
              </label>
              <EditableField
                title="Click to edit phone number"
                type="string"
                width="100%"
                keyForValue="mobile"
                fieldData={{
                  _id: companyId._id,
                  mobile: companyId?.contacts?.mobile || "",
                }}
                onSave={(data) =>
                  handleUpdate({
                    _id: companyId._id,
                    key: "contacts.mobile",
                    value: data.mobile,
                  })
                }
                formSubmitted={false}
                isSuccess={isSuccess}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="companyDescription-body mt-4">
        <label>
          <strong>Description</strong>
        </label>
        <EditableField
          title="Click to edit description"
          type="textarea"
          width="100%"
          keyForValue="description"
          fieldData={{
            _id: companyId._id,
            description: companyId?.description || "",
          }}
          onSave={(data) =>
            handleUpdate({
              _id: companyId._id,
              key: "description",
              value: data.description,
            })
          }
          formSubmitted={false}
          isSuccess={isSuccess}
        />

        <label className="mt-3">
          <strong>Tagline</strong>
        </label>
        <EditableField
          title="Click to edit tagline"
          type="textarea"
          width="100%"
          keyForValue="tagline"
          fieldData={{
            _id: companyId._id,
            tagline: companyId?.tagline || "",
          }}
          onSave={(data) =>
            handleUpdate({
              _id: companyId._id,
              key: "tagline",
              value: data.tagline,
            })
          }
          formSubmitted={false}
          isSuccess={isSuccess}
        />

        <div className="d-flex align-items-center mt-3" style={{ gap: "20px" }}>
          <div className="w-50">
            <label>
              <strong>Mission</strong>
            </label>
            <EditableField
              title="Click to edit mission"
              type="textarea"
              width="100%"
              keyForValue="ms"
              fieldData={{
                _id: companyId._id,
                ms: companyId?.ms || "",
              }}
              onSave={(data) =>
                handleUpdate({
                  _id: companyId._id,
                  key: "ms",
                  value: data.ms,
                })
              }
              formSubmitted={false}
              isSuccess={isSuccess}
            />
          </div>

          <div className="w-50">
            <label>
              <strong>Vision</strong>
            </label>
            <EditableField
              title="Click to edit vision"
              type="textarea"
              width="100%"
              keyForValue="vs"
              fieldData={{
                _id: companyId._id,
                vs: companyId?.vs || "",
              }}
              onSave={(data) =>
                handleUpdate({
                  _id: companyId._id,
                  key: "vs",
                  value: data.vs,
                })
              }
              formSubmitted={false}
              isSuccess={isSuccess}
            />
          </div>
        </div>

        {/* Core Values */}
        <label className="mt-3">
          <strong>Core Values</strong>
        </label>
        <div className="w-100 d-flex" style={{ gap: "20px" }}>
          <div className="w-100">
            <EditableField
              title="Click to edit core values"
              type="textarea"
              width="100%"
              height="100%"
              keyForValue="vl"
              fieldData={{
                _id: companyId._id,
                // join array into newline text for editing
                vl: Array.isArray(valuePreview)
                  ? valuePreview.join("\n")
                  : valuePreview,
              }}
              onSave={(data) => {
                // split into array and trim each value
                const newValues = data.vl
                  .split("\n")
                  .map((v) => v.trim())
                  .filter((v) => v.length > 0);

                setValuePreview(newValues); // keep as array
                handleUpdate({
                  _id: companyId._id,
                  key: "vl",
                  value: newValues, // send as array
                });
              }}
              onFocus={() => setIsValueFocused(true)}
              onBlur={() => setIsValueFocused(false)}
              formSubmitted={false}
              isSuccess={isSuccess}
            />
          </div>

          {isValueFocused && (
            <div
              className="mt-2 w-100"
              style={{ paddingLeft: "10px", fontSize: "0.9rem" }}
            >
              <strong>Preview</strong>
              <ul style={{ paddingLeft: "20px", marginTop: "4px" }}>
                {(Array.isArray(valuePreview)
                  ? valuePreview
                  : valuePreview.split("\n")
                )
                  .filter((line) => line.trim() !== "")
                  .map((line, idx) => {
                    const [title, ...rest] = line.split("–");
                    const detail = rest.join("–").trim();
                    return (
                      <li key={idx}>
                        <strong>{title.trim()}</strong>
                        {detail && ` – ${detail}`}
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
