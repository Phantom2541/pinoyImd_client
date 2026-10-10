import { useEffect, useState } from "react";

// Whole seconds until `until` (epoch ms), ticking once a second; 0 once it has
// passed or when there is no deadline. Based on timestamps, not a decrementing
// counter, so a timer survives its component being unmounted and remounted.
const useSecondsLeft = (until = 0) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setNow(Date.now());
    if (!until || until <= Date.now()) return undefined;

    const interval = setInterval(() => {
      setNow(Date.now());
      if (Date.now() >= until) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [until]);

  return until ? Math.max(0, Math.ceil((until - now) / 1000)) : 0;
};

export const formatTime = (sec = 0) =>
  `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

export default useSecondsLeft;
