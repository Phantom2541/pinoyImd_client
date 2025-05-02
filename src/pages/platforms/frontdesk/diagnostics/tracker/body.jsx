import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTypography } from "mdbreact";
import Collapse from "./collapse";
import { Services, Templates } from "../../../../../services/fakeDb";
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
        console.log("_id", _id);

        const updatedForms = normalizeForms(forms);
        console.log("updatedForms", updatedForms);

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
  const normalizeForms = (formsInput) => {
    const normalizedForms = {};
    const forms = JSON.parse(JSON.stringify(formsInput)); // clone to avoid Proxy issues

    const _form = Templates.getComponentIndex(forms);
    console.log("_form", _form);

    if (Array.isArray(forms)) {
      if (forms.length > 0) {
        normalizedForms["0"] = Array.from(
          { length: forms.length },
          (_, i) => i
        );
      }
    } else if (forms && typeof forms === "object") {
      ["0", "1", "2"].forEach((key) => {
        if (Array.isArray(forms[key]) && forms[key].length > 0) {
          normalizedForms[key] = Array.from(
            { length: forms[key].length },
            (_, i) => i
          );
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
