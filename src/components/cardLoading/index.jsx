import React from "react";
import { MDBAnimation, MDBProgress } from "mdbreact";
import "./style.css";

const widths = [20, 66, 80, 90, 70, 100]; // base widths in percent

function CardLoading() {
  return (
    <div className="cashier-remit-card-loading-wrapper">
      {widths
        .sort(() => Math.random() - 0.5)
        .map((width, index) => (
          <div
            key={`card-line-${index}`}
            className="cashier-remit-card-line"
            style={{ width: `${width}%` }}
          >
            <MDBAnimation
              type="flash"
              infinite
              delay={`${index + 1}00ms`}
              duration="3000ms"
            >
              <MDBProgress
                animated
                color="light"
                value={3000}
                className="cashier-remit-progress-bar"
              />
            </MDBAnimation>
          </div>
        ))}
    </div>
  );
}

export default CardLoading;
