import { MDBAnimation, MDBProgress } from "mdbreact";

const Loading = ({ loadingFor = "info" }) => {
  return (
    <MDBAnimation>
      <MDBProgress
        animated
        color="light"
        value={3000}
        id={`portal-${loadingFor}-loading`}
      ></MDBProgress>
    </MDBAnimation>
  );
};

export default Loading;
