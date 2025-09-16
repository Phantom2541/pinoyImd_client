import { useEffect, useState } from "react";
import PMHx from "./pmhx";
import FMHx from "./fmhx";
import PSHx from "./pshx";
import OBGyneHx from "./obGyneHx";

const familyHistory = {
  mother: [
    "Diabetes",
    "Hypertension",
    "Asthma",
    "Breast Cancer",
    "Arthritis",
    "Stroke",
    "Tuberculosis",
    "Migraine",
    "Osteoporosis",
    "Glaucoma",
    "Alzheimer’s Disease",
    "Thyroid Disorder",
    "Depression",
    "Obesity",
    "Gout",
    "Anemia",
  ],
  father: [
    "Heart Disease",
    "Cancer",
    "Asthma",
    "Lung Disease",
    "Stroke",
    "Kidney Disease",
    "Arthritis",
    "Diabetes",
    "Parkinson’s Disease",
    "Liver Disease",
    "High Cholesterol",
    "Peptic Ulcer",
    "Epilepsy",
    "Obesity",
    "Prostate Cancer",
    "Hepatitis",
  ],
};

const pastMedicalHistory = {
  "Chronic Illnesses": [
    { name: "Hypertension", year: 2015, status: "Controlled" },
    { name: "Diabetes", year: 2018, status: "Uncontrolled" },
    { name: "Asthma", year: 2020, status: "Stable" },
  ],
  Surgeries: [{ name: "Appendectomy", year: 2010, status: "Recovered" }],
  Hospitalizations: [{ name: "Pneumonia", year: 2022, status: "Recovered" }],
  Allergies: [{ name: "Penicillin", year: "-", status: "Severe" }],
};

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
