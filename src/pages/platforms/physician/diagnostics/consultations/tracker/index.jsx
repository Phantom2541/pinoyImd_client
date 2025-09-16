import { useEffect } from "react";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  TRACKER,
  SetPatient,
  HEADS,
  SetHEADS,
} from "../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import {
  BROWSE,
  SetPREFERENCES,
  RESET as PREFRESET,
} from "../../../../../../services/redux/slices/diagnostics/laboratory/preferences";
import {
  BROWSE as PHYSICIANS,
  RESET as PHYRESET,
} from "../../../../../../services/redux/slices/assets/persons/physicians";
import Body from "./body";
export default function Tracker() {
  const { patient } = useSelector(({ consultations }) => consultations);
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      TRACKER({
        token,
        key: {
          customerId: patient._id,
        },
      })
    );
    dispatch(SetPatient(patient));
  }, [patient, token, dispatch]);

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      const branchId = activePlatform.branchId;

      const prefData = localStorage.getItem(`preferences`);
      const headsData = localStorage.getItem(`heads-${branchId}`);

      if (prefData) {
        dispatch(SetPREFERENCES(JSON.parse(prefData)));
      } else if (token && activePlatform?.branchId) {
        dispatch(
          BROWSE({
            token,
            branchId: activePlatform.branchId,
          })
        );
      }

      if (headsData) {
        dispatch(SetHEADS(JSON.parse(headsData)));
      } else {
        dispatch(HEADS({ token, branchId })).then((res) => {
          if (res?.payload) {
            localStorage.setItem(
              `heads-${branchId}`,
              JSON.stringify(res.payload?.payload)
            );
          }
        });
      }

      dispatch(PHYSICIANS({ token, branchId })).then((res) => {
        if (res?.payload) {
          localStorage.setItem(
            `physicians`,
            JSON.stringify(res.payload?.payload)
          );
        }
      });

      return () => {
        dispatch(PREFRESET());
        dispatch(PHYRESET());
      };
    }
  }, [token, dispatch, activePlatform]);

  return (
    <div className="checkup-data-tracker">
      <Body />
    </div>
  );
}
