import React from "react";
import { Route, Switch } from "react-router-dom";
import { Sidebars } from "../services/fakeDb";

//404
import NotFound from "./notFound";

//400
import NotExisting from "./notExisting";

//global
import Profile from "../components/profile";

import { useSelector } from "react-redux";
import UnsetApply from "./platforms/guest/apply";

export default function Routes() {
  const { activePlatform } = useSelector(({ auth }) => auth);

  const renderSidebars = () => {
    const platforms = Sidebars[activePlatform?.platform?.toLowerCase()];
    if (!Array.isArray(platforms)) return "Ooops.. platforms must be array";
    var basePath = "";
    const sideBars = [];

    platforms.forEach((element, index) => {
      const { children, component, path = "" } = element;
      basePath = path;

      const renderChildren = (c, parentPath = "") => {
        if (!c.children) return;
        c.children.forEach((child, index) => {
          const childBasePath = `${parentPath}${child.path}`;

          sideBars.push(
            <Route
              key={`route-${index}-${childBasePath}`}
              exact
              path={childBasePath}
              component={child.component || NotExisting}
            />
          );

          renderChildren(child, childBasePath);
        });
      };

      if (children) {
        renderChildren(element, path);
      }
      if (!children) {
        sideBars.push(
          <Route
            key={`route-${index}-${path}`}
            exact
            path={basePath}
            component={component || NotExisting}
          />
        );
      }
    });
    return sideBars;
  };
  const { platform = "" } = activePlatform;

  return (
    <Switch>
      {!platform && <Route exact path={`/dashboard`} component={UnsetApply} />}

      {renderSidebars()}

      <Route path="/profile" exact component={Profile} />
      <Route path="/apply" exact component={UnsetApply} />

      <Route component={NotFound} />
    </Switch>
  );
}
