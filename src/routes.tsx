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
  {
    exact: true,
    path: "/launch-pad",
    component: lazy(() => import("pages/LaunchPadPage")),
  },
  {
    exact: true,
    path: "/profile",
    component: lazy(() => import("pages/ProfilePage")),
  },
  {
    exact: true,
    path: "/browse",
    component: lazy(() => import("pages/BrowsePage")),
  },
  {
    exact: true,
    path: "/browse/featured",
    component: lazy(() => import("pages/BrowsePage")),
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
