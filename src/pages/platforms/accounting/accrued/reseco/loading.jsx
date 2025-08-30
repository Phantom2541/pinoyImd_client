import { MDBAnimation, MDBProgress } from "mdbreact";

const Loading = () => {
  return (
    <div style={{ width: "50%" }} className="mx-1">
      <MDBAnimation>
        <MDBProgress
          animated
          color="light"
          heigth="100px"
          value={3000}
          id="progress-select"
        ></MDBProgress>
      </MDBAnimation>
    </div>
  );
};

export default Loading;
