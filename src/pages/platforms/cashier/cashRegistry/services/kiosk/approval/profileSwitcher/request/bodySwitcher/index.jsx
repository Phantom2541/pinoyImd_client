import Card from "./card";
import Form from "./form";
import ValidID from "./validId";

const BodySwitcher = ({ active = "form" }) => {
  const componentMap = {
    card: Card,
    id: ValidID,
    form: Form,
  };
  const Component = componentMap[active];
  return <Component />;
};
export default BodySwitcher;
