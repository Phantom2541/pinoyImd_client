import { useSelector } from "react-redux";
import Credit from "./credit";
import { useEffect } from "react";

const Voucher = ({ refNo = {}, chargeAmount = 0, setRefNo = () => {} }) => {
  const { cardHolder = {} } = useSelector(({ pos }) => pos);
  const { company = {} } = cardHolder || {};
  const { name, ref } = company;
  const isCardHolder = Boolean(name || ref);
  const { amount: debtAmount } = refNo;

  useEffect(() => {
    setRefNo((prev) => ({
      ...prev,
      pp: !isCardHolder ? "co" : "cash",
    }));
    // eslint-disable-next-line
  }, [isCardHolder]);

  return (
    <>
      {isCardHolder && (
        <>
          {[
            { label: "Tracking No.", key: "number" },
            {
              label: "Credit Covered",
              key: "amount",
              ph: "Credit Covered",
            },
          ].map(({ label, key, ph = "" }, index) => (
            <tr>
              <td style={{ fontSize: "0.8rem" }}>{label}</td>
              <td className="p-0 m-0">
                <input
                  type={index === 1 ? "number" : "string"}
                  value={String(refNo[key] || "")}
                  onChange={({ target }) =>
                    setRefNo({
                      ...refNo,
                      [key]: index === 1 ? Number(target.value) : target.value,
                    })
                  }
                  placeholder={ph ? ph : label}
                  required
                  name={key}
                  title={label}
                />
              </td>
            </tr>
          ))}
        </>
      )}
      {debtAmount < chargeAmount ? (
        <tr>
          <td style={{ fontSize: "0.8rem" }}>Patient Payable</td>
          <td className="p-0">
            <select
              value={refNo.pp}
              onChange={({ target }) =>
                setRefNo({
                  ...refNo,
                  pp: target.value,
                  careOf: { ...refNo.careOf, user: "", pp: target.value },
                })
              }
            >
              {isCardHolder && <option value="cash">Cash</option>}
              <option value="co">Care Of</option>
            </select>
          </td>
        </tr>
      ) : (
        ""
      )}

      <Credit refNo={refNo} setRefNo={setRefNo} amount={chargeAmount} />
    </>
  );
};

export default Voucher;
