import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  BROWSE,
  RESET,
  ResetDATE,
  SetMONTH,
} from "../../../../../../services/redux/slices/finance/bookkeeping/remittances";
import "./style.css";
import { currency } from "../../../../../../services/utilities";
import { Calendars } from "../../../../../../components/header";

const Header = () => {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { month, year, collections } = useSelector(
      ({ remittances }) => remittances
    ),
    [coh, setCoh] = useState(0),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId && year && month) {
      const startDate = new Date(year, month - 1, 1);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      endDate.setHours(23, 59, 59, 999);

      dispatch(
        BROWSE({
          token,
          key: {
            branch: activePlatform?.branchId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            cashier: auth?._id,
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, month, year, auth]);

  useEffect(() => {
    if (collections) {
      let gross = 0;
      collections.forEach((collection) => {
        if (!collection?.collector && collection.gross) {
          gross += collection?.closing.sum - collection.opening.sum;
        }
      });
      setCoh(gross);
    }
  }, [collections]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex ">
          <span className="white-text mx-3 text-nowrap mt-0">
            Remittances :{" "}
            {coh > 0 && (
              <span style={{ color: "green" }} title="Unremitted sales">
                {" "}
                COH:({currency(coh)})
              </span>
            )}
          </span>
        </div>
      </div>

      <div className="d-flex align-items-center">
        <Calendars
          moved={(next) => dispatch(SetMONTH(next))}
          reset={() => dispatch(ResetDATE())}
          month={month}
          year={year}
        />
      </div>
    </MDBView>
  );
};

export default Header;
