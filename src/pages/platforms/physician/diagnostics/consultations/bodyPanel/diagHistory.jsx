import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDepartment } from "../../../../../../services/utilities";
import { Templates } from "../../../../../../services/fakeDb";
import { SetPATIENT } from "../../../../../../services/redux/slices/diagnostics/clinic/appointments";

export default function DiagHistory({ department = "", setSlide = () => {} }) {
  const { patient: appointment } = useSelector(
      ({ appointments }) => appointments
    ),
    dispatch = useDispatch();
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const _sections = [];
    const dept = getDepartment(department);
    const activeDept = appointment?.[dept?.toLowerCase()] || {};
    const { images = [], ...rest } = activeDept || {};
    Object.entries(rest).forEach(([key, secs]) => {
      if (secs?.length > 0) {
        secs.forEach((sec) => {
          _sections.push({
            dept,
            section: Templates.getComponentName(sec, dept),
            isImg: false,
            dealId: key,
          });
        });
      }
    });
    if (images?.length > 0) {
      images.forEach((img) => {
        _sections.push({
          ...img,
          isImg: true,
          dept,
        });
      });
    }
    setSections(_sections);
  }, [appointment, department]);
  if (!sections || sections.length === 0) return null;

  const { patient, activeDiag } = appointment || {};

  return (
    <div className="history-list">
      {sections.map((it, idx) => {
        var isActive = false;

        if (!activeDiag?.isImg) {
          isActive =
            activeDiag?.section === it?.section &&
            activeDiag?.dealId === it?.dealId;
        } else {
          isActive = activeDiag?.section === it?.section && it?.isImg;
        }
        return (
          <span
            key={idx}
            className={`${patient?.isMale ? "male" : "female"} ${
              isActive && "active"
            }`}
            onClick={() => {
              setSlide(isActive ? "" : department);
              dispatch(
                SetPATIENT({ ...appointment, activeDiag: isActive ? {} : it })
              );
            }}
          >
            {it?.section} {it?.isImg && "- Hard Copy"}
          </span>
        );
      })}
    </div>
  );
}
