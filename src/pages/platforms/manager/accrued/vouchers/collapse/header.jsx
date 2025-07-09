import { MDBTypography } from "mdbreact";
import { currency } from "../../../../../../services/utilities";
import { useSelector } from "react-redux";

const Header = () => {
  const {
    cluster = [],
    filterBy = "source",
    vendor,
    hmo,
  } = useSelector(({ deals }) => deals);
  const totalCustomers = cluster?.reduce(
    (acc, curr) => acc + curr.deals?.length,
    0
  );
  const totalAmount = cluster?.reduce((acc, curr) => {
    const totalDealsAmount = curr.deals?.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0
    );
    return acc + totalDealsAmount;
  }, 0);

  const isFilterBySource = filterBy === "source";

  const haveSelect = isFilterBySource
    ? vendor?._id && vendor._id !== "noSource"
    : hmo !== "all";

  return (
    <div className="mt-n2">
      {!haveSelect ? (
        <div>
          <MDBTypography noteTitle="Note: " note noteColor="warning">
            Please select a {isFilterBySource ? "source" : "card type"} before
            generating the SOA.
          </MDBTypography>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            marginBottom: "0.5rem",
          }}
        >
          <p style={{ fontSize: "1.5rem", margin: "0 10px" }}>
            {currency.format(totalAmount)}
          </p>
          <div style={{ flex: 1, borderBottom: "1px dashed black" }}></div>
          <p style={{ fontSize: "1.5rem", margin: "0 10px" }}>
            @ {totalCustomers} Customer/s
          </p>
        </div>
      )}
    </div>
  );
};

export default Header;
