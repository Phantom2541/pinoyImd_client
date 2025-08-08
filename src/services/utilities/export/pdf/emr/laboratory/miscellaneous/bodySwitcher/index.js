import Dengue from "./dengue";
import Glucose from "./hba1c";
import Ogtt from "./ogtt";
import Pregnancy from "./pregnancy";
import BloodTyping from "./bloodTyping";
import Cluster from "./cluster";

const bodySwitcher = (task) => {
  const { packages = [] } = task;
  if (packages.includes(67) || packages.includes(84)) return Pregnancy(task);
  if (packages.includes(66)) return BloodTyping(task);
  if (packages.includes(146)) return Ogtt(task);
  if (packages.includes(77) || packages.includes(120)) return Dengue(task);
  if (packages.includes(11)) return Glucose(task);
  return Cluster(task);
};

export default bodySwitcher;
