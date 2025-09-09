import Holder from "./holder";

const Credit = ({ refNo = {}, setRefNo = () => {} }) => {
  const { pp = "cash" } = refNo || {};
  console.log(refNo);
  // condition kung dapat ipakita si Credit
  const shouldShow = pp !== "cash";

  if (!shouldShow) return null;

  return (
    <>
      <tr>
        <td style={{ fontSize: "1rem" }}>
          <span>Category</span>
        </td>
        <td className="p-0">
          <select
            value={refNo?.careOf?.category}
            onChange={(e) =>
              setRefNo({
                ...refNo,
                careOf: {
                  ...refNo?.careOf,
                  category: e.target.value,
                  user: "",
                },
              })
            }
          >
            <option value={"employee"}>Employee</option>
            <option value={"physician"}>Physician</option>
            <option value={"bm"}>Board Member</option>
          </select>
        </td>
      </tr>
      <Holder refNo={refNo} setRefNo={setRefNo} />
    </>
  );
};

export default Credit;
