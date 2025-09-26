import BloodTyping from "./bloodTyping";
import Cluster from "./cluster";
import Dengue from "./dengue";
import Pregnancy from "./pregnancy";
import Ogtt from "./ogtt";
import Gloucose from "./hba1c";
import Widal from "./widal";
export default function BodySwitcher({ task, fontSize }) {
  const handleSwitch = () => {
    const { data = [] } = task;

    if (data.includes(67) || data.includes(84)) return Pregnancy;

    if (data.includes(66)) return BloodTyping;

    if (data.includes(146)) return Ogtt;

    if (data.includes(77) || data.includes(120)) return Dengue;

    if (data.includes(11)) return Gloucose;
    if (data.includes(121)) return Widal;

    return Cluster;
  };

  const Component = handleSwitch();
  return <Component task={task} fontSize={fontSize} />;
}
