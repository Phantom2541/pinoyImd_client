import { useEffect, useState } from "react";

export default function TypingText({
  text = "",
  speed = 100,
  loop = false,
  className = "",
  onTypingDone = () => {},
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      onTypingDone(); // 🔥 trigger when done
      if (loop) {
        const timeout = setTimeout(() => {
          setDisplayedText("");
          setIndex(0);
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }
  }, [index, text, speed, loop, onTypingDone]);

  return <span className={className}>{displayedText}</span>;
}
