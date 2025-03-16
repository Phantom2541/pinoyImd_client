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
    const platforms = Sidebars[activePlatform?.platform];
    if (!Array.isArray(platforms)) return "";
    var basePath = "";
    const sideBars = [];
    console.log("runing");

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

      {/* {Sidebars[activePlatform?.platform]?.map(
        ({ path, component, children }, index) => {
          if (children)
            return children.map((child, cIndex) => (
              <Route
                key={`route-${index}-${cIndex}`}
                exact
                path={`${path}${child.path}`}
                component={child.component || NotExisting}
              />
            ));

          return (
            <Route
              key={`route-${index}`}
              exact
              path={path}
              component={component || NotExisting}
            />
          );
        }
      )} */}

      <Route path="/profile" exact component={Profile} />

      <Route component={NotFound} />
    </Switch>
  );
}
