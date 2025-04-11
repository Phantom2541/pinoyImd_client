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

    for (const task of collections) {
      let updatedTask = { ...task };
      const { _id, forms } = task;

      if (!forms || forms.length === 0) {
        try {
          const services = Services.getTemplates(task.packages);
          const _forms = Object.keys(services);
          dispatch(UPDATE({ token, data: { _id, forms: _forms } }));

          updatedTask.forms = _forms;
        } catch (error) {
          console.error(`Error generating forms for task ${task._id}:`, error);
        }
      } else {
        console.log("Existing forms for task:", task.forms);
      }
      updatedTasks.push(updatedTask);
    }

    setTasks(updatedTasks);
  }, [collections, dispatch, token]);

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
      {tasks.map((task, index) => {
        console.log("task", task);
        
        return (
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
      )})}
    </>
  );
}
