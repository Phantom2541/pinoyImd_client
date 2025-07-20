import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { currency, axioKit } from "../../../../../services/utilities";
import { MDBCard, MDBRow, MDBCol, MDBBtn, MDBIcon } from "mdbreact";

const Utilities = () => {
  const [currentExpenses, setCurrentExpenses] = useState(0);
  const [lastMonthExpenses, setLastExpenses] = useState(0);

  const { activePlatform, auth, token } = useSelector(({ auth }) => auth);

  useEffect(() => {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    const queryCurrentMonth = {
      userId: auth._id,
      branchId: activePlatform.branchId,
      month: month + 1,
      year,
    };

    const queryLastMonth = {
      userId: auth._id,
      branchId: activePlatform.branchId,
      month: month === 0 ? 11 : month,
      year: month === 0 ? year - 1 : year,
    };

    // Fetch Current Month Sales
    axioKit
      .universal(
        `/finance/journals/payments/bulletin`,
        token,
        queryCurrentMonth
      )
      .then((res) => setCurrentExpenses(res.totalAmount || 0))
      .catch((err) => console.log(err.message));

    // Fetch Last Month Sales
    axioKit
      .universal(`/finance/journals/payments/bulletin`, token, queryLastMonth)
      .then((res) => setLastExpenses(res.totalAmount || 0))
      .catch((err) => console.log(err.message));
  }, [activePlatform, auth, token]);
  return (
    <MDBCol xl="3" md="6" className="mb-4 mb-r">
      <MDBCard>
        <MDBRow className="mt-3">
          <MDBCol md="5" col="5" className="text-left pl-4">
            <MDBBtn
              tag="a"
              floating
              size="lg"
              color="warning"
              className="ml-4"
              style={{ padding: 0 }}
            >
              <MDBIcon icon="cogs" size="2x" />
            </MDBBtn>
          </MDBCol>
          <MDBCol md="7" col="7" className="text-right pr-5">
            <h5 className="ml-4 mt-4 mb-2 font-weight-bold">
              {currency.format(currentExpenses)}
            </h5>
            <p className="font-small grey-text">Current Expenses</p>
          </MDBCol>
        </MDBRow>
        <MDBRow className="my-3">
          <MDBCol md="7" col="7" className="text-left pl-4">
            <p className="font-small dark-grey-text font-up ml-4 font-weight-bold">
              Last month
            </p>
          </MDBCol>
          <MDBCol md="5" col="5" className="text-right pr-5">
            <p className="font-small grey-text">
              {currency.format(lastMonthExpenses)}
            </p>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBCol>
  );
};

export default Utilities;
