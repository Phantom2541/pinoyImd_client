import React, { useEffect, useState } from "react";
import { Banner, dateFormat } from "../../../services/utilities";
import { Legend } from "./legend";
import Header from "./header";
import Body from "./body";
import Footer from "./footer";
import GeneratedBy from "./generatedBy";

const SOA = () => {
  const [vouchers, setVouchers] = useState([]),
    [vendor, setVendor] = useState({}),
    [menus, setMenus] = useState([]),
    [total, setTotal] = useState(0),
    [range, setRange] = useState("");

  useEffect(() => {
    const cluster = JSON.parse(localStorage.getItem("cluster")) || {};
    const _vendor = JSON.parse(localStorage.getItem("vendor")) || {};
    const { menus, gross } = JSON.parse(localStorage.getItem("soa")) || {};
    const voucherList = cluster[_vendor._id] || [];

    setTotal(gross);
    setVouchers(voucherList);
    setVendor(_vendor);
    setMenus(menus);

    if (_vendor?.cutoff) {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth(); // 0-based

      const cutoffDay = parseInt(_vendor.cutoff);
      const currentCutoffDate = new Date(currentYear, currentMonth, cutoffDay);

      // Previous month cutoff
      const previousMonthDate = new Date(currentCutoffDate);
      previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
      previousMonthDate.setDate(previousMonthDate.getDate() - 1);

      // Find if there's a date in cluster earlier than previousMonthDate
      const earlierDates = voucherList
        .map((v) => new Date(v.date)) // assuming v.date is a valid date string
        .filter((d) => d < previousMonthDate)
        .sort((a, b) => b - a); // descending order

      const finalPreviousMonth =
        earlierDates.length > 0 ? earlierDates[0] : previousMonthDate;
      const options = { month: "short", day: "numeric" };
      const formattedDate = finalPreviousMonth.toLocaleDateString(
        "en-US",
        options
      );
      setRange(`${formattedDate} -  ${dateFormat(currentCutoffDate)}`);
    }
  }, []);

  return (
    <div
      className="ml-1"
      style={{
        width: "794px",
        fontFamily: "Helvetica, sans-serif",
        letterSpacing: "-0.5px",
      }}
    >
      <div
        style={{
          borderTop: "1px solid black",
          borderLeft: "1px solid black",
          borderRight: "1px solid black",
        }}
      >
        <div>
          <div>
            <Banner company={"Smart Care"} branch={"General Tinio"} />
          </div>
          <h5 className="text-center mt-2" style={{ fontWeight: 700 }}>
            {/* Statement Of Account */}
            STATEMENT OF ACCOUNT
          </h5>
        </div>
        <div
          className="mt-1"
          style={{
            cursor: "default",
            fontSize: "16px !important",
          }}
        >
          <Header range={range} vendor={vendor} total={total} />
          <Body vouchers={vouchers} />
        </div>
      </div>
      <GeneratedBy />
      <Footer menus={menus} />
    </div>
  );
};

export default SOA;
