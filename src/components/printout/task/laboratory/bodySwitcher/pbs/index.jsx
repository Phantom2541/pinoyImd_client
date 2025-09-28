import { DocxView } from "../../../../../docx";

export default function Pbs({ task }) {
  const { findings } = task;

  return (
    <div style={{ border: "0.5px solid black" }} className="mt-1">
      {/* @kevin */}
      <DocxView content={JSON.parse(findings)} />
    </div>
  );
}
