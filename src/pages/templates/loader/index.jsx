import React, { useState, useEffect } from "react";
import Loader from "./loader"; // adjust path if needed

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
      {/* available loadstyle: circle, bar, segmented-bar */}
      <Loader progress={progress} displayType="bar" color="#0d6efd" />
    </div>
  );
};

export default ParentComponent;
