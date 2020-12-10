import { AuthGuard, LoadingScreen } from "components";
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
    path: "/trade/:id",
    component: lazy(() => import("pages/TradeItemPage")),
  },
  {
    exact: true,
    path: "/launch-pad",
    component: lazy(() => import("pages/LaunchPadPage")),
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
  {
    exact: false,
    path: "/faq",
    component: lazy(() => import("pages/FaqPage")),
  },
];

const authRoutes = [
  {
    exact: true,
    path: "/profile",
    component: lazy(() => import("pages/ProfilePage")),
  },
  {
    exact: true,
    path: "/create",
    component: lazy(() => import("pages/CreateHomePage")),
  },
  {
    exact: true,
    path: "/create/erc721",
    component: lazy(() => import("pages/CreateERC721Page")),
  },
];

const renderRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        {routes.map((route, i) => {
          return <Route key={i} {...route} />;
        })}
        <AuthGuard>
          {authRoutes.map((route, i) => {
            return <Route key={i} {...route} />;
          })}
        </AuthGuard>
      </Switch>
    </Suspense>
  );
};

export default renderRoutes;
