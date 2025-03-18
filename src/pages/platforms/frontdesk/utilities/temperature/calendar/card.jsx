import React from "react";
import { useSelector } from "react-redux";
import Indicator from "./indicator";
import Footer from "./footer";

const Card = ({ txt, num, index }) => {
  const { collections } = useSelector(({ temperatures }) => temperatures);

  /**
   * default value for style
   */
  const today = new Date();
  const dateCell = new Date(txt);
  const isFuture = dateCell > today;
  const week = txt?.slice(0, 3);

  const entry = collections?.find(
    (entry) =>
      new Date(entry?.createdAt).toDateString() === dateCell.toDateString()
  );

  return (
    <div
      className={`calendar-card ${num ? "" : "opacity-0 pointer-events-none"}`}
      key={`pos-calendar-${index}`}
    >
      <Indicator num={num} week={week} isFuture={isFuture} />
      <div className="sales-card-body">
        <div className="d-flex"></div>
        <div className="d-flex items-center">
          <div className="sales-card-info mr-4">
            {!isFuture && (
              <>
                <center>
                  <div className="table-responsive mr-2 mt-3">
                    <table className="table table-sm table-bordered">
                      <thead className="thead-light">
                        <tr>
                          <th scope="col">Meridiem</th>
                          <th scope="col">Room</th>
                          <th scope="col">Fridge</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="text-center">
                          <th scope="row">AM</th>
                          <td>{entry?.AM?.room || "-"}</td>
                          <td>{entry?.AM?.ref || "-"}</td>
                        </tr>
                        <tr className="text-center">
                          <th scope="row">PM</th>
                          <td>{entry?.PM?.room || "-"}</td>
                          <td>{entry?.PM?.ref || "-"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </center>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer dateCell={dateCell} txt={txt} />
    </div>
  );
};

export default Card;
