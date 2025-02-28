import React from "react";

export default function Table({ data, outerIndex, activeIndex }) {
  return (
    <table
      className={`task-table ${activeIndex === outerIndex && "active"}`}
      key={`task-table-${outerIndex}`}
    >
      <thead>
        <tr>
          <th>Department</th>
          <th>Services</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{data.department}</td>
          <td>
            <div className="service-wrapper">
              {data.services?.map((service, innerIndex) => {
                return (
                  <small
                    className="services"
                    key={`task-service-${outerIndex}-${innerIndex}`}
                  >
                    {service}
                  </small>
                );
              })}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

{
}
