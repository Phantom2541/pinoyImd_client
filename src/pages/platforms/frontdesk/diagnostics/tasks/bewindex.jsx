import React, { useState } from "react";
import "./index.css";
import Search from "./search";
import Card from "./card";

// View daily tasks
// view button (redirect button to tracker)
// add and edit result button
// indicator if a value has been added
// print button

const templates = ["chemistry", "hemathology", "urinalysis"];

const hasDone = {
  chemistry: false,
  hemathology: false,
  urinalysis: true,
};

export default function Tasks() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="task-container">
      <div className="task-template-buttons">
        {templates?.map((template, index) => {
          return (
            <button
              key={`template-${index}`}
              className={`${activeIndex === index && "active"} ${
                hasDone[template] && "not-done"
              }`}
              onClick={() => setActiveIndex(index)}
            >
              {template}
            </button>
          );
        })}
      </div>

      <div className="task-container-header">
        <span>5 Daily Tasks</span>
        <Search />
      </div>
      <div className="task-container-body">
        <Card hasDone={true} name="kevin Magtalas" />
        <Card hasDone={false} name="Pajarillaga, Benedict Earle Gabriel y R." />
        <Card hasDone={true} name="Reynald Nick Magtalas" />
      </div>
    </div>
  );
}
