import React, { useEffect, useState } from "react";
import { MDBContainer, MDBTypography } from "mdbreact";
import Cluster from "./card";
import { useSelector } from "react-redux";
import { dateFormat } from "./../../../../../../services/utilities";

export default function POS({ activeIndex, setActiveIndex }) {
  const { catalogs } = useSelector(({ sales }) => sales),
    [daily, setDaily] = useState([]);
  useEffect(() => {
    const dailyArr = Array.from(
      new Set(
        catalogs?.map(({ createdAt }) => {
          const dateObj = new Date(createdAt);
          const year = dateObj.getUTCFullYear();
          const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
          const day = dateObj.getUTCDate().toString().padStart(2, "0");
          return `${year}-${month}-${day}`;
        })
      )
    );
    setDaily(dailyArr);
  }, [catalogs]);
  return (
    <MDBContainer>
      {!!daily.length ? (
        daily.map((desiredDay, index) => (
          <Cluster
            key={`${index}-desiredDay`}
            desiredDay={dateFormat(desiredDay)}
            index={index + 1}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        ))
      ) : (
        <MDBTypography note noteColor="info">
          <strong>No Transaction Yet </strong>
        </MDBTypography>
      )}
    </MDBContainer>
  );
}
