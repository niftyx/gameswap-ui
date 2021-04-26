import { AuthGuard, LoadingScreen } from "components";
import { MainLayout } from "layouts";
import React, { Fragment, Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

const routes = [
  {
    path: "/",
    layout: MainLayout,
    routes: [
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
        path: "/assets/:id",
        component: lazy(() => import("pages/TradeItemPage")),
      },
      {
        exact: true,
        path: "/games/:id",
        component: lazy(() => import("pages/GameDetailsPage")),
      },
      {
        exact: true,
        path: "/collections/:id",
        component: lazy(() => import("pages/CollectionDetailsPage")),
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
      {
        exact: true,
        path: "/create/game",
        component: lazy(() => import("pages/CreateGamePage")),
      },
      {
        exact: true,
        path: "/create/collection",
        component: lazy(() => import("pages/CreateCollectionPage")),
      },
      {
        exact: false,
        path: "/users/:id",
        component: lazy(() => import("pages/ProfilePage")),
      },
      {
        exact: true,
        path: "/settings",
        component: lazy(() => import("pages/ProfileSettingsPage")),
        guard: AuthGuard,
      },
      // eslint-disable-next-line react/display-name
      { path: "*", component: () => <Redirect to="/" /> },
    ],
  },
];

export const renderRoutes = (routes: any[]) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        {routes.map((route, i) => {
          const Guard = route.guard || Fragment;
          const Layout = route.layout || Fragment;
          const Component = route.component;

          return (
            <Route
              exact={route.exact}
              key={i}
              path={route.path}
              render={(props) => (
                <Guard>
                  <Layout>
                    {route.routes ? (
                      renderRoutes(route.routes)
                    ) : (
                      <Component {...props} />
                    )}
                  </Layout>
                </Guard>
              )}
            />
          );
        })}
      </Switch>
    </Suspense>
  );
};

export default routes;
