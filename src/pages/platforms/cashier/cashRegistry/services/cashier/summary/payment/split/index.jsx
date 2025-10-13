import CareOf from "../careOf";

const Split = ({ refNo, setRefNo = () => {}, chargeAmount = 0 }) => {
  const { careOf = {}, pp = "", amount = 0 } = refNo || {};
  const psMinAmt = chargeAmount - amount;
  return (
    <>
      <tr>
        <td colSpan="2" className="p-0 text-center text-primary">
          Payment Split (1)
        </td>
      </tr>
      <tr>
        <td className="py-1">
          <select
            className=" text-left ml-n1"
            value={pp}
            onChange={(e) => setRefNo({ ...refNo, pp: e.target.value })}
          >
            <option value={"cash"}>Cash</option>
            {careOf.pp !== "gcash" && <option value={"gcash"}>Gcash</option>}
          </select>
        </td>
        <td className="py-1">
          <input
            placeholder="Amount"
            required
            value={String(refNo.amount || "")}
            onChange={({ target }) =>
              setRefNo({ ...refNo, amount: target.value })
            }
          />
        </td>
      </tr>

      <tr>
        <td colSpan="2" className="p-0 text-center text-primary">
          Payment Split (2)
        </td>
      </tr>
      <tr>
        <td className="p-1">
          <select
            className=" text-left ml-n1"
            value={careOf.pp}
            onChange={(e) =>
              setRefNo({ ...refNo, careOf: { ...careOf, pp: e.target.value } })
            }
          >
            <option value={"co"}>Care Of</option>
            {pp !== "gcash" && <option value={"gcash"}>Gcash</option>}
          </select>
        </td>
        <td className="p-0">
          {careOf.pp === "co" ? (
            <select
              className=" text-end "
              value={careOf.category}
              onChange={(e) =>
                setRefNo({
                  ...refNo,
                  careOf: { ...careOf, category: e.target.value },
                })
              }
            >
              <option value={"employee"}>Employee</option>
              <option value={"physician"}>Physician</option>
              <option value={"bm"}>Board Member</option>
            </select>
          ) : (
            <input
              placeholder="Reference No."
              required
              value={careOf.number}
              onChange={({ target }) =>
                setRefNo({
                  ...refNo,
                  careOf: { ...careOf, number: target.value },
                })
              }
            />
          )}
        </td>
      </tr>

      {careOf.pp === "co" && (
        <>
          <tr>
            <td style={{ fontSize: "1rem" }}>Particular</td>
            <td>
              <CareOf refNo={refNo} setRefNo={setRefNo} />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: "1rem" }}>Amount</td>
            <td>
              <input
                required
                min={psMinAmt}
                type="number"
                placeholder="Amount"
                value={String(careOf.amount || "") || ""}
                onChange={({ target }) =>
                  setRefNo({
                    ...refNo,
                    careOf: { ...careOf, amount: Number(target.value) },
                  })
                }
              />
            </td>
          </tr>
        </>
      )}
    </>
  );
};

export default Split;
