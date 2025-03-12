import React, { useState, useEffect } from "react";
import { Templates } from "../../../../../../services/fakeDb";
import { MDBTable } from "mdbreact";
import Forms from "./forms";

export default function CollapseTable({ menu }) {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const _templates = Templates.collections.reduce(
      (accumulator, { components, department }) => {
        if (department === "LAB") {
          const filteredComponents = components.filter(
            (component) => menu[component.toLowerCase()]
          );

          return [...accumulator, ...filteredComponents];
        }

        return accumulator;
      },
      []
    );

    setTemplates(_templates);
  }, [menu]);

  return (
    <>
      <MDBTable small hover responsive>
        <thead>
          <tr>
            <th>Performer</th>
            <th>Template</th>
            <th>Services</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {templates?.map((template, index) => {
            const data = menu[template.toLowerCase()];
            if (!data)
              return (
                <tr key={`empty-${index}`}>
                  <td colSpan={4}>Empty Test</td>
                </tr>
              );

            if (Array.isArray(data))
              return data.map((obj, i) => (
                <Forms
                  form={template}
                  obj={obj}
                  index={index + 1}
                  i={i}
                  menu={menu}
                />
              ));
            return (
              <Forms form={template} obj={data} index={index + 1} menu={menu} />
            );
          })}
        </tbody>
      </MDBTable>
    </>
  );
}
