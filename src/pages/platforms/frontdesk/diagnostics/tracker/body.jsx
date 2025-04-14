import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTypography } from "mdbreact";
import Collapse from "./collapselol";
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
    const updatedTasks = [];

    const processTasks = async () => {
      for (const task of collections) {
        let updatedTask = { ...task };
        const { _id, forms } = task;

        if (!forms || forms.length === 0) {
          try {
            const services = Services.getTemplates(task.packages);
            const _forms = Object.keys(services);

            // Prevent repeated dispatch for already updated tasks
            if (_forms.length > 0 && (!task.forms || task.forms.length === 0)) {
              await dispatch(UPDATE({ token, data: { _id, forms: _forms } }));
              updatedTask.forms = _forms;
            }
          } catch (error) {
            console.error(`Error generating forms for task ${_id}:`, error);
          // if (_forms.length > 0 && (!task.forms || task.forms.length === 0)) {
          //   await dispatch(UPDATE({ token, data: { _id, forms: _forms } }));
          //   updatedTask.forms = _forms;
          }
        } else {
          console.log("Existing forms for task:", task.forms);
        }

        updatedTasks.push(updatedTask);
      }

      setTasks(updatedTasks);
    };

    processTasks();
  }, [collections, dispatch, token]); // Remove `dispatch` and `token` from deps unless strictly needed

//   processTasks();
// }, [collections, dispatch, token]); // ✅ Now includes dispatch and token
//  // Remove `dispatch` and `token` from deps unless strictly needed
  
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
