import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTypography } from "mdbreact";
import Collapse from "./collapse";
import { Services } from "../../../../../services/fakeDb";
import { UPDATE } from "../../../../../services/redux/slices/commerce/pos/services/deals.js";

export default function Body() {
  const { token } = useSelector(({ auth }) => auth),
    { collections, patient } = useSelector(({ deals }) => deals),
    [activeCollapse, setActiveCollapse] = useState(""),
    [didHoverID, setDidHoverID] = useState(-1),
    [tasks, setTasks] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    if (!collections.length) return;

    const processTasks = async () => {
      const updatedTasks = [];

      for (const task of collections) {
        const { _id, forms } = task;
        console.log("forms", forms);

        const updatedForms = normalizeForms(forms);

        const shouldUpdate =
          !forms ||
          typeof forms !== "object" ||
          JSON.stringify(updatedForms) !== JSON.stringify(forms);

        if (shouldUpdate) {
          try {
            await dispatch(
              UPDATE({ token, data: { _id, forms: updatedForms } })
            );
            updatedTasks.push({ ...task, forms: updatedForms });
          } catch (error) {
            console.error(`Error updating forms for task ${_id}:`, error);
            updatedTasks.push(task);
          }
        } else {
          console.log("Existing correct forms for task:", forms);
          updatedTasks.push(task);
        }
      }

      setTasks(updatedTasks);
    };

    processTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <<== EMPTY dependency array!! runs only once after mount
  const normalizeForms = (forms) => {
    const normalizedForms = { 0: [], 1: [], 2: [] };

    if (forms && typeof forms === "object") {
      Object.keys(forms).forEach((key) => {
        if (["0", "1", "2"].includes(key) && Array.isArray(forms[key])) {
          normalizedForms[key] = forms[key].map((_, index) => index);
        }
      });
    }

    console.log("Normalized Forms:", normalizedForms);
    return normalizedForms;
  };

  if (!patient?._id)
    return (
      <MDBTypography note noteColor="info" className="">
        Look for a patient first.
      </MDBTypography>
    );

  if (!collections.length)
    return (
      <MDBTypography note noteColor="warning" className="">
        This patient has no records.
      </MDBTypography>
    );

  return (
    <>
      {tasks.map((task, index) => (
        <Collapse
          key={task?._id}
          task={task}
          didHoverID={didHoverID}
          setDidHoverID={setDidHoverID}
          number={index + 1}
          setActiveCollapse={setActiveCollapse}
          activeCollapse={activeCollapse}
          isActive={activeCollapse === task?._id}
        />
      ))}
    </>
  );
}
