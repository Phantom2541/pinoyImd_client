import { currency, dateFormat, fullName } from "../../../services/utilities";
import { capitalize } from "lodash";
export default function Header({ remittance }) {
  const {
    cashier,
    createdAt,
    department,
    expenses,
    opening,
    patients,
    shift,
    sales,
  } = remittance;
  return (
    <div className="px-1 mt-1 ">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <h6>Cashier:</h6>
          <h6 className="ml-1" style={{ fontWeight: 700 }}>
            <u>{fullName(cashier?.fullName)}</u>
          </h6>
        </div>
        <div className="d-flex align-items-center" style={{ width: "25%" }}>
          <h6>Date:</h6>
          <h6 className="ml-1">
            {dateFormat(createdAt)} (
            {
              ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                new Date(createdAt).getDay()
              ]
            }
            )
          </h6>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-between mt-n1">
        <div className="d-flex align-items-center">
          <h6>Department:</h6>
          <h6 className="ml-1">{capitalize(department)}</h6>
        </div>
        <div className="d-flex align-items-center" style={{ width: "25%" }}>
          <h6>Shift:</h6>
          <h6 className="  ml-1">{capitalize(shift)}</h6>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-between mt-n1">
        <div className="d-flex align-items-center">
          <h6>Floating Cash:</h6>
          <h6 className="ml-1" style={{ fontWeight: 700 }}>
            {currency.format(opening?.sum)}
          </h6>
        </div>
        <div className="d-flex align-items-center" style={{ width: "25%" }}>
          <h6>Epenses:</h6>
          <h6 className="  ml-1" style={{ fontWeight: 700 }}>
            {currency.format(expenses)}
          </h6>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-between mt-n1">
        <div className="d-flex align-items-center">
          <h6>Sales:</h6>
          <h6 className="ml-1" style={{ fontWeight: 700 }}>
            {currency.format(sales)}
          </h6>
        </div>
        <div className="d-flex align-items-center" style={{ width: "25%" }}>
          <h6>Patients:</h6>
          <h6 className="ml-1" style={{ fontWeight: 700 }}>
            {patients}
          </h6>
        </div>
      </div>
      <h5 className="text-center mt-n1 " style={{ fontWeight: 600 }}>
        Daily Remittance Report
      </h5>
    </div>
  );
}
