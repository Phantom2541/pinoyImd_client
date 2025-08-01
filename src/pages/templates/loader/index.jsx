import React, { useState, useEffect } from "react";
import Loader from "./loader"; // adjust path if needed
import Marquee from "../../../components/marquee";
import SubsNotice from "../../../components/subsNotice";

const ParentComponent = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* <Marquee
        message="This Content is Exclusively Intended for Demonstration and is not to be Used for Official Purposes."
        daysLeft={1}
        baseShowAfter={600}
        baseHideAfter={20}
      /> */}
      <SubsNotice daysLeft={2} totalDays={30} />
      <Loader
        progress={progress}
        displayType="segmented-bar"
        color="#0d6efd"
        size="sm"
      />
    </div>
  );
};

export default ParentComponent;
