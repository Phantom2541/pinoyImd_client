import { useEffect, useState } from "react";
import Months from "../../../../services/fakeDb/calendar/months";
import { Policy } from "../../../../services/fakeDb";
import { fullName } from "../../../../services/utilities";

const Header = ({ payslip, branch }) => {
  const [dateRange, setDateRange] = useState("");

  useEffect(() => {
    const { breakdown = {}, datePaid = "", contract = {} } = payslip || {};
    const { isAquincena = false } = breakdown;
    const { pc } = contract;
    const year = new Date(datePaid)?.getFullYear();
    const m = new Date(datePaid)?.getMonth(); //Month of number example 5
    const month = Months[m];
    const lastDayOfMonth = new Date(year, m + 1, 0)?.getDate();
    let _range = "";
    if (pc === 1) {
      _range = isAquincena
        ? `${month} 1 to ${month} 15`
        : `${month} 16 to ${month} ${lastDayOfMonth}`;
    } else if (pc === 2) {
      _range = `${month} 1 to ${month} ${lastDayOfMonth}`;
    } else {
      //pang quarterly
      const quarter = Math.floor(m / 3);
      const startMonth = Months[quarter * 3];
      const endMonthIndex = quarter * 3 + 2;
      const endMonth = Months[endMonthIndex];
      const lastDayOfEndMonth = new Date(year, endMonthIndex + 1, 0).getDate();

      _range = `${startMonth} 1 to ${endMonth} ${lastDayOfEndMonth}`;
    }
    setDateRange(_range);
  }, [payslip]);

  const { user = {}, contract = {} } = payslip || {};

  const designation = Policy.getPosition(Number(contract.designation));

  return (
    <thead>
      <tr>
        <th
          colSpan={1}
          rowSpan={2}
          className="bg-info py-0"
          style={{
            verticalAlign: "middle",
            textAlign: "center",
            width: "14rem",
          }}
        >
          <h6 className="mt-2" style={{ fontWeight: 500 }}>
            {branch?.company?.toUpperCase()}
          </h6>
        </th>
        <th
          colSpan={2}
          className="text-center font-weight-bold py-0"
          style={{ fontSize: "1.3rem" }}
        >
          PAYSLIP
        </th>
        <th
          colSpan={1}
          className="bg-light py-0 confidential-box"
          rowSpan={2}
          style={{
            verticalAlign: "middle",
            textAlign: "center",
            width: "14rem",
          }}
        >
          CONFIDENTIAL
        </th>
      </tr>
      <tr>
        <th colSpan={2} className="text-center font-weight-bold py-0">
          {dateRange}, 2025
        </th>
      </tr>
      <tr>
        <th colSpan={2}>
          <div className="d-flex justify-content-between">
            Name: <u className="font-weight-bold">{fullName(user?.fullName)}</u>
          </div>
        </th>
        <th colSpan={2}>
          <div className="d-flex justify-content-between">
            Designation:
            <u className="font-weight-bold">
              {designation?.name?.toUpperCase()}
            </u>
          </div>
        </th>
      </tr>
    </thead>
  );
};

export default Header;
