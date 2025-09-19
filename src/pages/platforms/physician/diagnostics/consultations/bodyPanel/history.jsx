import { useSelector } from "react-redux";

export default function History({ items }) {
  const { patient } = useSelector(({ consultations }) => consultations);
  if (!items || items.length === 0) return null;

  return (
    <div className="history-list">
      {items.map((it, idx) => (
        <span key={idx} className={`${patient?.isMale ? "male" : "female"}`}>
          {it}
        </span>
      ))}
    </div>
  );
}
