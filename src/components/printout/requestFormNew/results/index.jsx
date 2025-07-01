import {
  Chemistry,
  Hematology,
  Urinalysis,
  Miscellaneous,
  Parasitology,
  Serology,
} from "./logs";
import { capitalize } from "../../../../services/utilities";
import Header from "./header";
import { useSelector } from "react-redux";

const formComponents = {
  Chemistry,
  Hematology,
  Urinalysis,
  Parasitology,
  Miscellaneous,
  Serology,
};

const getComponents = (key) => {
  switch (key) {
    case "Chemistry":
    case "Electrolyte":
    case "Serology":
      return formComponents["Chemistry"];
    default:
      return formComponents[key];
  }
};

const Hr = ({ className = "" }) => (
  <hr
    style={{
      border: "none",
      borderTop: "1px dashed #000",
      height: 0,
    }}
    className={`my-1 ${className}`}
  />
);

const Text = ({ title = "", value = "", className = "", fontSize = "" }) => {
  return (
    <div className={`d-flex justify-content-between ${className}`}>
      <span>{title}</span>
      <span style={{ fontSize }}>{value}</span>
    </div>
  );
};

const Stub = ({ sale, forms }) => {
  const {
      _id = "",
      createdAt = "",
      customerId = {},
      cashier = {},
      ssx,
      pn,
    } = sale,
    { fullName = {} } = customerId || {};

  return (
    <div>
      {Object?.keys(forms)?.map((key, index, arr) => {
        const isLast = index === arr.length - 1;
        const FormComponent = getComponents(key);
        return (
          <div key={index}>
            <div
              style={{
                width: "105mm",
                lineHeight: "20px",
                cursor: "default",
                fontFamily: "Courier New, monospace",
                letterSpacing: "-0.5px",
                fontSize: "20px",
                wordSpacing: "-1px",
              }}
              className="text-center thermal-font "
            >
              <Header date={createdAt} dealId={_id} />
              <Text
                className="mt-2"
                title="Name"
                value={capitalize(
                  `${fullName.fname || ""} ${fullName.lname || ""}`
                )}
              />
              <Text title="SSX" value={ssx} />
              <Text title="Patient No." value={pn} />

              <Hr />
              <h6>{key}</h6>

              {FormComponent && (
                <div style={{ fontSize: "10px", padding: "2px" }}>
                  <FormComponent data={forms[key]} />
                </div>
              )}

              <Hr />

              <Text
                title="Performer"
                value={capitalize(
                  `${cashier?.fname?.split?.(" ")[0] || ""} ${
                    cashier?.lname || ""
                  }`
                )}
              />
              <Hr />
            </div>
            {!isLast && (
              <div
                style={{
                  height: "1.7px",
                  width: "25.9%",
                  backgroundImage:
                    "repeating-linear-gradient(to right, black 0, black 10px, transparent 10px, transparent 20px)",
                  backgroundRepeat: "repeat-x",
                  backgroundPosition: "center",
                }}
                className={`my-4 `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function ResultPrintout({ sale = {}, forms, ssx }) {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { branch = {} } = activePlatform,
    { companyId = {} } = branch;

  if (!sale || !sale?._id) return <div>Sale is Empty</div>;

  return (
    <div>
      <Stub sale={sale} companyId={companyId?._id} forms={forms} ssx={ssx} />
    </div>
  );
}
