import React from "react";
import BloodTyping from "./bloodTyping";
import Cluster from "./cluster";
import Dengue from "./dengue";
import Pregnancy from "./pregnancy";
import Ogtt from "./ogtt";
import Gloucose from "./hba1c";

export default function BodySwitcher({ task, fontSize }) {
  const handleSwitch = () => {
    const { packages = [] } = task;

    if (packages.includes(67) || packages.includes(84)) return Pregnancy;

    if (packages.includes(66)) return BloodTyping;

    if (packages.includes(146)) return Ogtt;

    if (packages.includes(77) || packages.includes(120)) return Dengue;

    if (packages.includes(11)) return Gloucose;

    return Cluster;
  };

  const Component = handleSwitch();
  return <Component task={task} fontSize={fontSize} />;
}
