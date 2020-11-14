import { LoadingScreen } from "components";
import React, { Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";

const routes = [
  {
    exact: true,
    path: "/",
    component: lazy(() => import("pages/HomePage")),
  },
  {
    exact: true,
    path: "/trade",
    component: lazy(() => import("pages/TradePage")),
  },
];

const renderRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        {routes.map((route, i) => {
          return <Route key={i} {...route} />;
        })}
      </Switch>
    </Suspense>
  );
};

export default renderRoutes;
