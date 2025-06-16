import React, { useEffect, useState } from "react";
import "./style.css";

const CountDown = () => {
  const [secondsLeft, setSecondsLeft] = useState(7199); // 1 hour 59 mins 59 secs = 7199 seconds

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const formatTime = (totalSeconds) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(1, "0");
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div>
      <p className="description grey-text">
        <i>
          Please wait for the countdown to finish before your results become
          available.
        </i>
      </p>
      <h1 className="digital-text text-center countdown-anim">
        {formatTime(secondsLeft)}
      </h1>
      <span className="grey-text">In case you encounter a problem::</span>
      <p className="text-danger">
        <i>
          In the event that no results are displayed after the countdown, please
          report to the front desk for further assistance.
        </i>
      </p>
    </div>
  );
};

export default CountDown;
