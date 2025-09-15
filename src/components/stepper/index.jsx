import { MDBIcon } from "mdbreact";
import "./style.css";

/**
 * A horizontal stepper component that displays a progress bar and stepper labels.
 * The width of the progress bar is determined by the activeStep prop.
 *
 * @param {Object} props - Component props.
 * @param {Array} props.steps - Array of objects containing the icon and label for each stepper
 * @param {Number} props.activeStep - The current active stepper
 */

const Stepper = ({ steps = [], activeStep = 0 }) => {
  if (steps.length === 0) return null;
  return (
    <div className="d-flex justify-content-center mb-4">
      <div
        className="position-relative d-flex justify-content-between"
        style={{ width: "95%" }}
      >
        <div className="stepper-reusable-line">
          <div
            className="stepper-reusable-line-fill bg-primary"
            style={{
              width: `${
                activeStep + 1 === 1
                  ? 0
                  : (activeStep + 1 - 1) * (100 / (steps.length - 1))
              }%`,
            }}
          ></div>
        </div>

        {steps.map((step, index) => {
          const { icon = "", label = "" } = step;
          return (
            <div key={index}>
              <div
                className={`stepper-reusable-step ${
                  activeStep >= index ? "active" : ""
                } position-relative`}
              >
                <div className="stepper-reusable-step-circle">
                  {icon ? <MDBIcon far icon={icon} /> : index + 1}
                </div>
                <div
                  className="stepper-reusable-step-label position-absolute "
                  style={{
                    bottom: "-15px",
                    fontWeight: activeStep === index ? 500 : 400,
                    color:
                      activeStep === index
                        ? "#cb8305ff"
                        : activeStep > index
                        ? "#cb8305ff"
                        : "#ccc",
                    width: "100px",
                    fontSize: "13px",
                    left: "50%",
                    transform: `translateX(-50%)`,
                  }}
                >
                  {label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
