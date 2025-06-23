import LOGO from "../../../assets/iMD.png";
import "./style.css";
const Loading = () => {
  return (
    <div className="vh-100  d-flex align-items-center justify-content-center">
      <div className="subscriber-loading-container">
        <img src={LOGO} alt="logo" className="subscriber-loading " />
      </div>
    </div>
  );
};

export default Loading;
