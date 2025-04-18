import React from "react";
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

export default function Routes() {
  const { activePlatform } = useSelector(({ auth }) => auth);
  const { platform = "" } = activePlatform || {};

  const platformPrefix = platform ? `/${platform.toLowerCase()}` : "";
  const renderSidebars = () => {
    const platforms = Sidebars[platform.toLowerCase()];

    if (!Array.isArray(platforms)) return "Ooops.. platforms must be array";

    const sideBars = [];

    platforms.forEach((element, index) => {
      const { children, component, path = "" } = element;

      const fullPath = `${platformPrefix}${path}`;

      const renderChildren = (c, parentPath = "") => {
        if (!c.children) return;
        c.children.forEach((child, childIndex) => {
          const childFullPath = `${parentPath}${child.path}`;

          sideBars.push(
            <Route
              key={`route-${index}-${childFullPath}`}
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
      <Route path={`${platformPrefix}/profile`} exact component={Profile} />
      <Route path={`${platformPrefix}/contract`} exact component={Contract} />
      <Route component={NotFound} />
    </Switch>
  );
}
