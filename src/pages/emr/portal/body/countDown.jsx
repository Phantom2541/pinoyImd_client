import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetCOUNTDOWN_COMPLETED } from "../../../../services/redux/slices/emr/portal";
import "./style.css";

const ONE_HOUR_PROCESS_SERVICES = ["URINALYSIS", "HEMATOLOGY", "FECALYSIS"];
const CountDown = () => {
  const {
      result,
      countdownCompleted = false,
      activeType,
      rendered,
      forms,
    } = useSelector(({ portal }) => portal),
    [secondsLeft, setSecondsLeft] = useState(null),
    dispatch = useDispatch();

  useEffect(() => {
    if (!result?.createdAt) return;

    const baseCreatedAt = rendered?._id ? rendered?.at : result?.createdAt;
    const createdTime = new Date(baseCreatedAt).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - createdTime) / 1000); // in seconds

    let baseTime = 7200; // Default to 2 hours

    // ✅ Prioritize activeType if it matches one-hour services
    if (rendered?._id) {
      if (
        ONE_HOUR_PROCESS_SERVICES.includes(activeType?.toUpperCase()) &&
        rendered?._id
      ) {
        baseTime = 3600;
      }
    } else {
      //for default countdown if no rendered
      const specialForms = [0, 1, 4];
      const isShortCountdown = forms.some((i) =>
        specialForms.includes(Number(i))
      );
      if (isShortCountdown) baseTime = 3600;
    }
    const remaining = baseTime - elapsed;
    setSecondsLeft(remaining);
  }, [result, rendered, activeType, forms]);

  useEffect(() => {
    console.log("seconds left:", secondsLeft);
    if (secondsLeft <= 0 && !secondsLeft === null) {
      console.log("running seconds left");
      dispatch(SetCOUNTDOWN_COMPLETED(true));
    }
    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, dispatch]);
  console.log("count completed:", countdownCompleted);
  const formatTime = (totalSeconds) => {
    const absSeconds = Math.abs(totalSeconds);

    const hrs = String(Math.floor(absSeconds / 3600)).padStart(1, "0");
    const mins = String(Math.floor((absSeconds % 3600) / 60)).padStart(2, "0");
    const secs = String(absSeconds % 60).padStart(2, "0");

    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="countdown-container">
      <h6
        className="text-center"
        style={{ marginBottom: "-10px", fontWeight: 400 }}
      >
        {countdownCompleted ? "Result Time Delayed" : "Expected Time Released"}
      </h6>
      <h1
        className={`digital-text text-center countdown-anim ${
          countdownCompleted ? "text-danger" : "text-warning"
        }`}
      >
        {formatTime(secondsLeft)}{" "}
        <span style={{ fontSize: "1.2rem", marginLeft: "-1rem" }}> hrs</span>
      </h1>
      {countdownCompleted ? (
        <p className="text-danger">
          <i>
            If your results are still unavailable shortly after the countdown
            ends, please allow a few more moments. If the delay persists, kindly
            follow up with the front desk to check the status of your
            transaction.
          </i>
        </p>
      ) : (
        <p className="description grey-text">
          <i>
            Please wait for the countdown to finish before your results become
            available.
          </i>
        </p>
      )}
    </div>
  );
};

export default CountDown;
