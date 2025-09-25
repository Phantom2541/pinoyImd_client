import React from "react";
import BloodTyping from "./bloodTyping";
import Cluster from "./cluster";
import Dengue from "./dengue";
import Pregnancy from "./pregnancy";
import Ogtt from "./ogtt";
import HBa1c from "./hba1c";
import widal from "./widal";

const packageComponentMap = {
  11: HBa1c,
  66: BloodTyping,
  67: Pregnancy,
  68: Cluster, // HIV
  69: Cluster, // RPR
  70: Cluster, // HBsAg
  77: Dengue,
  84: Pregnancy,
  120: Dengue,
  146: Ogtt,
  121: widal,
};

export default function BodySwitcher({ task, setTask }) {
  const Component = task?.packages?.find((pkg) => packageComponentMap[pkg])
    ? packageComponentMap[task.packages.find((pkg) => packageComponentMap[pkg])]
    : Cluster;

  return <Component task={task} setTask={setTask} />;
}
