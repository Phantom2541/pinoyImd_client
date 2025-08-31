import { useState, useEffect } from "react";
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
const diagnostics = [
  "diagnostic",
  "clinic",
  "laboratory",
  "radiology",
  "pharmacy",
  "infirmary",
  "hospital",
  "rehabilitation",
];

// pag binago ito, dapat pati ang SideNavigation
// dapat i-update din ang SideNavigation para sa platformPrefix
export default function Routes() {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { platform = "" } = activePlatform || {};
  const [isDiagnostics, setIsDiagnostics] = useState(true);
  const platformPrefix = platform
    ? `/${platform.toLowerCase().replace(/\s+/g, "")}`
    : "";
  useEffect(() => {
    if (diagnostics.includes(activePlatform?.branch?.category?.toLowerCase())) {
      setIsDiagnostics(true);
    } else {
      setIsDiagnostics(false);
    }
  }, [activePlatform]);

  const renderSidebars = () => {
    const group = isDiagnostics ? Sidebars.diagnostics : Sidebars.suppliers;
    const sidebar = platformPrefix
      ? group[platform?.toLowerCase()?.replace(/\s+/g, "_").replace(/_/g, "")]
      : Sidebars.patron;

    if (!Array.isArray(sidebar)) return "❌ Sidebar must be array";
    const sideBars = [];

    console.log("group", group);

    sidebar.forEach((element, index) => {
      const { children, component, path = "" } = element;
      const fullPath = `${platformPrefix ? platformPrefix : "/patron"}${path}`;
      console.log(fullPath);
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
      <Route
        path={`${platformPrefix || "/patron"}/profile`}
        exact
        component={Profile}
      />
      <Route path={`${platformPrefix}/shifts`} exact component={Attendances} />
      <Route path={`${platformPrefix}/contract`} exact component={Contract} />
      <Route component={NotFound} />
    </Switch>
  );
}
