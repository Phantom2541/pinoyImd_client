import { useEffect, useState } from "react";
import { Banner } from "../../../services/utilities";
import Header from "./header";
import Body from "./body";
import Footer from "./footer";
import GeneratedBy from "./generatedBy";
import { isEmpty } from "lodash";
import "./style.css";
const SOA = () => {
  const [vouchers, setVouchers] = useState([]),
    [options, setOptions] = useState({}),
    [menus, setMenus] = useState([]),
    [total, setTotal] = useState(0),
    [range, setRange] = useState("");

  useEffect(() => {
    const cluster = JSON.parse(localStorage.getItem("cluster")) || {};
    const _vendor = JSON.parse(localStorage.getItem("vendor")) || {};
    const { menus, gross, options } =
      JSON.parse(localStorage.getItem("soa")) || {};
    const voucherList = cluster[_vendor._id] || [];
    setTotal(gross);
    setVouchers(voucherList);
    setMenus(menus);
    setRange(options.dateRange);
    setOptions(options);
  }, []);

  return (
    <div
      className="ml-1 soa-container"
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
            <Banner
              company={"Smart Care"}
              branch={"General Tinio"}
              className="soa-banner-printout"
            />
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
          <Header range={range} options={options} total={total} />
          <Body vouchers={vouchers} />
        </div>
      </div>
      <GeneratedBy />
      {!isEmpty(menus) && <Footer menus={menus} />}
    </div>
  );
};

export default SOA;
