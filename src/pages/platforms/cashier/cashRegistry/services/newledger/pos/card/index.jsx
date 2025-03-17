import React, { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBCollapse,
  MDBIcon,
  MDBBadge,
  MDBTypography,
} from "mdbreact";
import SaleTable from "./table";
import { useSelector } from "react-redux";
import {
  currency,
  dateFormat,
  getWeekend,
} from "./../../../../../../../services/utilities";

export default function Cluster({
  desiredDay,
  index,
  activeIndex,
  setActiveIndex,
}) {
  const { catalogs } = useSelector(({ sales }) => sales),
    [cluster, setCluster] = useState([]),
    [gross, setGross] = useState([]);

  useEffect(() => {
    if (desiredDay) {
      const _cluster = catalogs.filter(
        (sale) => dateFormat(sale.createdAt) === desiredDay
      );
      setCluster(_cluster);
      setGross(_cluster.reduce((totalSum, sale) => totalSum + sale.amount, 0));
    }
  }, [desiredDay, catalogs]);

  const toggleShow = () => {
    if (activeIndex === index) {
      setActiveIndex(0);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <MDBTypography
      note
      noteColor={
        getWeekend(desiredDay) === "Sunday" ||
        getWeekend(desiredDay) === "Saturday"
          ? "warning"
          : "primary"
      }
      className="text-dark mb-2"
    >
      <span className="d-flex align-items-center justify-content-between">
        <span>
          <strong>{index}. </strong>
          <MDBBadge
            className="text-uppercase"
            color={
              getWeekend(desiredDay) === "Sunday" ||
              getWeekend(desiredDay) === "Saturday"
                ? "danger"
                : "info"
            }
          >
            {getWeekend(desiredDay)}
          </MDBBadge>
          &nbsp;
          <span className="ms-2 me-3">
            {new Intl.DateTimeFormat("en-PH", { dateStyle: "long" }).format(
              new Date(desiredDay)
            )}
          </span>
        </span>
        <span>
          {cluster.length > 0 && (
            <>
              <span>
                {cluster.length} Patient's @ {currency(gross)}
              </span>
              <MDBBtn
                onClick={() => toggleShow()}
                size="sm"
                className="shadow-0"
              >
                <MDBIcon
                  icon={`caret-${index === activeIndex ? "down" : "left"}`}
                  color="white"
                />
              </MDBBtn>
            </>
          )}
        </span>
      </span>
      <MDBCollapse isOpen={index === activeIndex} className="px-4 mt-2">
        <SaleTable cluster={cluster} />
      </MDBCollapse>
    </MDBTypography>
  );
}
