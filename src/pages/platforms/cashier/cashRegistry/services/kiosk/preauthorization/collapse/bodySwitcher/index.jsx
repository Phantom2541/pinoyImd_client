import Sendout from "./sendout";
import Validation from "./validation";

const BodySwitcher = ({ item }) => {
  const components = {
    validation: Validation,
    sendout: Sendout,
  };

  const baseKey = item?.client?._id ? "sendout" : "validation";
  const Component = components[baseKey];
  if (Component) return <Component item={item} />;
};

export default BodySwitcher;
