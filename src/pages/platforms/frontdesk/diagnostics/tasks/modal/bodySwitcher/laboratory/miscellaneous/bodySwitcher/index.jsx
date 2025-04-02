import React from "react";
import BloodTyping from "./bloodTyping";
import Cluster from "./cluster";
import Dengue from "./dengue";
import Pregnancy from "./pregnancy";
import Ogtt from "./ogtt";
import Glucose from "./hba1c";

const packageComponentMap = {
  11: Glucose,
  66: BloodTyping,
  67: Pregnancy,
  68: Cluster, // HIV
  69: Cluster, // RPR
  70: Cluster, // HBsAg
  77: Dengue,
  84: Pregnancy,
  120: Dengue,
  146: Ogtt,
};

export default function BodySwitcher({ task, setTask }) {
  const Component = task?.packages?.find((pkg) => packageComponentMap[pkg])
    ? packageComponentMap[task.packages.find((pkg) => packageComponentMap[pkg])]
    : Cluster;

  console.log("BodySwitcher task:", task.packages);

  return <Component task={task} setTask={setTask} />;
}
