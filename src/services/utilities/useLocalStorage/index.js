import { useEffect, useState } from "react";

const useLocalStorage = (key) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const storedValue = localStorage.getItem(key);
        setValue(storedValue ? JSON.parse(storedValue) : null);
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, [key]);

  return value;
};

export default useLocalStorage;
