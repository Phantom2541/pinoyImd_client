import { useEffect, useState } from "react";
import { Banner } from "../../../services/utilities";
import Header from "./header";
import Body from "./body";
import GeneratedBy from "./generatedBy";
import { get } from "lodash";
import "./style.css";
const SOA = () => {
  const [vouchers, setVouchers] = useState([]),
    [options, setOptions] = useState({}),
    [total, setTotal] = useState(0),
    [range, setRange] = useState("");

  useEffect(() => {
    const cluster = JSON.parse(localStorage.getItem("cluster")) || {};
    const filterEntity = JSON.parse(localStorage.getItem("filterEntity")) || {};
    const { gross, options } = JSON.parse(localStorage.getItem("soa")) || {};
    const voucherList = get(cluster, filterEntity) || [];
    setTotal(gross);
    setVouchers(voucherList);
    setRange(options.dateRange);
    setOptions(options);
  }, []);

  return (
    <div
      className="ml-1 soa-container"
      style={{
        width: "1000px",
        fontFamily: "Helvetica, sans-serif",
        letterSpacing: "-0.5px",
      }}
    >
      <table>
        <thead>
          <tr>
            <th
              style={{
                borderTop: "1px solid black",
                borderLeft: "1px solid black",
                borderRight: "1px solid black",
              }}
            >
              <div>
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
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={{
                borderTop: "1px solid black",
                borderLeft: "1px solid black",
                borderRight: "1px solid black",
              }}
            >
              <Body vouchers={vouchers} />
            </td>
          </tr>
        </tbody>
      </table>
      <GeneratedBy />
    </div>
  );
};

export default SOA;
