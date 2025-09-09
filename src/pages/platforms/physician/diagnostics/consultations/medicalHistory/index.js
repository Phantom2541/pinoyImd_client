import { useRef } from "react";
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
  {
    order: 1,
    outcome: "Alive",
    deliveryType: "Cesarean",
    gestationWeeks: 39,
  },
  {
    order: 2,
    outcome: "Deceased",
    deliveryType: "Cesarean",
    gestationWeeks: 38,
  },
  {
    order: 3,
    outcome: "Alive",
    deliveryType: "Cesarean",
    gestationWeeks: 37,
  },
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

export default function HistorySwitcher({ task }) {
  const contentRef = useRef(null);

  // sanitize task: remove spaces & lowercase
  const sanitizedTask = task?.toLowerCase().replace(/\s+/g, "");
  const Component = historyMap[sanitizedTask] || Blank;

  return (
    <div>
      <div ref={contentRef}>
        <Component
          task={task}
          familyHistory={familyHistory}
          pastMedicalHistory={pastMedicalHistory}
          pastSurgicalHistory={pastSurgicalHistory}
          obGyneHistory={obGyneHistory}
          fontSize={"1rem"}
        />
      </div>
    </div>
  );
}
