import { MDBAnimation, MDBProgress } from "mdbreact";
const Loading = () => {
  return (
    <div className="editable-user-results-list">
      {new Array(5).fill("").map((_, index) => (
        <MDBAnimation
          key={index}
          className="p-1 ml-2 mr-2 mt-1"
          type="flash"
          infinite
          delay={`${index + 1}00ms`}
          duration="3000ms"
        >
          <MDBProgress color="light" value={3000} id="progress-table" />
        </MDBAnimation>
      ))}
    </div>
  );
};

export default Loading;
