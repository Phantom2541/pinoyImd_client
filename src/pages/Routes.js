import { Route, Switch } from "react-router-dom";
import { Sidebars } from "../services/fakeDb";

//404
import NotFound from "./notFound";

//400
import NotExisting from "./notExisting";

//global
import Profile from "../components/profile";
import Contract from "../components/contract";

import { useSelector } from "react-redux";
import { Attendances } from "./platforms/hr";

export default function Routes() {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { platform = "Patron" } = activePlatform || {};
  let category = "diagnostic";
  const diagnostics = [
    "diagnostic",
    "laboratory",
    "radiology",
    "pharmacy",
    "infirmary",
    "hospital",
    "rehabilitation",
  ];
  if (
    !diagnostics.includes(activePlatform.branch?.category) &&
    activePlatform.branch.category
  ) {
    category = activePlatform.branch.category.toLowerCase();
  }
  const platformPrefix = platform
    ? `/${platform.toLowerCase().replace(/\s+/g, "")}`
    : "";

  const renderSidebars = () => {
    const group = Sidebars[category];
    if (!group) return "❌ No such category group";

    const sidebar = group[platform?.toLowerCase()?.replace(/\s+/g, "_")];
    if (!Array.isArray(sidebar)) return "❌ Sidebar must be array";
    const sideBars = [];

    console.log("Routes sidebar:", sidebar);

    sidebar.forEach((element, index) => {
      const { children, component, path = "" } = element;

      const fullPath = `${platformPrefix}${path}`;
      const renderChildren = (c, parentPath = "") => {
        if (!c.children) return;
        c.children.forEach((child, i) => {
          const childFullPath = `${parentPath}${child.path}`;
          sideBars.push(
            <Route
              key={`route-${index}-${i}-${childFullPath}`}
              exact
              path={childFullPath}
              component={child.component || NotExisting}
            />
          );

          renderChildren(child, childFullPath);
        });
      };

      if (children) {
        renderChildren(element, fullPath);
      }
      console.log("fullPath Darrel:", fullPath);

      if (!children) {
        sideBars.push(
          <Route
            key={`route-${index}-${fullPath}`}
            exact
            path={fullPath}
            component={component || NotExisting}
          />
        );
      }
    });

    return sideBars;
  };

  return (
    <Switch>
      {renderSidebars()}
      <Route path={`${platformPrefix}/profile`} exact component={Profile} />
      <Route path={`${platformPrefix}/shifts`} exact component={Attendances} />
      <Route path={`${platformPrefix}/contract`} exact component={Contract} />
      <Route component={NotFound} />
    </Switch>
  );
}
