import Flow from "./flow";
import Others from "./others";
import Quantitative from "./quantitative";
import Regurgitation from "./regurgitation";
import Tissue from "./tissue";

const RawResult = () => {
  return (
    <>
      <Quantitative />
      <Flow />
      <Regurgitation />
      <Tissue />
      <Others />
    </>
  );
};
export default RawResult;
