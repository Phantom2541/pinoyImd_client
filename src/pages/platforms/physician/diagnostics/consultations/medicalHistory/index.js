import { useEffect, useState } from "react";
import PMHx from "./pmhx";
import FMHx from "./fmhx";
import PSHx from "./pshx";
import OBGyneHx from "./obGyneHx";

const familyHistory = ["Diabetes", "Hypertension", "Heart Disease in father"];

const pastMedicalHistory = [
  "Appendectomy - 2015",
  "Allergic rhinitis",
  "Asthma since childhood",
];

const pastSurgicalHistory = ["Appendectomy - 2015", "Knee arthroscopy - 2020"];

const obGyneHistory = [
  { order: 1, outcome: "Alive", deliveryType: "Cesarean", gestationWeeks: 39 },
  {
    order: 2,
    outcome: "Deceased",
    deliveryType: "Cesarean",
    gestationWeeks: 38,
  },
  { order: 3, outcome: "Alive", deliveryType: "Cesarean", gestationWeeks: 37 },
  {
    order: 4,
    outcome: "Stillbirth",
    deliveryType: "Cesarean",
    gestationWeeks: 36,
  },
  { order: 5, outcome: "Alive", deliveryType: "Normal", gestationWeeks: 39 },
];

const Blank = ({ task }) => <div>{task} is not working</div>;

const historyMap = {
  pmhx: PMHx,
  fmhx: FMHx,
  pshx: PSHx,
  obgynehx: OBGyneHx,
};

const order = ["pmhx", "fmhx", "pshx", "obgynehx"];

export default function HistorySwitcher({ task }) {
  const [current, setCurrent] = useState(task);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("left");

  useEffect(() => {
    if (!task || task === current) return;

    const curIndex = order.indexOf(current?.toLowerCase());
    const nextIndex = order.indexOf(task?.toLowerCase());
    setDirection(nextIndex > curIndex ? "left" : "right");

    setAnimating(true);
    const t = setTimeout(() => {
      setCurrent(task);
      setAnimating(false);
    }, 300);

    return () => clearTimeout(t);
  }, [task]);

  const sanitized = current?.toLowerCase().replace(/\s+/g, "");
  const Comp = historyMap[sanitized] || Blank;

  return (
    <div className="tools-switcher-container">
      <div
        key={current}
        className={`tools-switcher-panel ${
          animating ? `exit-${direction}` : `enter-${direction}`
        }`}
      >
        <Comp
          task={current}
          familyHistory={familyHistory}
          pastMedicalHistory={pastMedicalHistory}
          pastSurgicalHistory={pastSurgicalHistory}
          obGyneHistory={obGyneHistory}
          fontSize="1rem"
        />
      </div>
    </div>
  );
}
