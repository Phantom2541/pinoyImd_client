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

export default function Routes() {
  const { activePlatform } = useSelector(({ auth }) => auth);

  return (
    <Switch>
      {Sidebars[activePlatform]?.map(({ path, component, children }, index) => {
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
      })}

      <Route path="/profile" exact component={Profile} />

      <Route component={NotFound} />
    </Switch>
  );
}
