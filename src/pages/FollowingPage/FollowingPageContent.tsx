import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { CollectionsSection } from "pages/GameDetailsPage/components";
import React from "react";
import { Route, Switch } from "react-router";
import useCommonStyles from "styles/common";

import {
  CategoriesSection,
  GamesSection,
  HeroSection,
  ItemsSection,
  TabSection,
  UsersSection,
} from "./components";

const useStyles = makeStyles((theme) => ({
  content: {
    height: "100%",
  },
  heroSection: {
    minHeight: "50%",
    marginLeft: -theme.spacing(2),
    marginRight: -theme.spacing(2),
    marginTop: -theme.spacing(2),
  },
  section: {
    marginTop: 8,
    marginBottom: 16,
  },
}));

export const FollowingPageContent = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  return (
    <div className={clsx(classes.content, commonClasses.scroll)}>
      <HeroSection />
      <TabSection />
      <Switch>
        <Route
          component={(props: any) => {
            return <GamesSection {...props} />;
          }}
          exact
          path="/following/games"
        />
        <Route
          component={(props: any) => {
            return <CategoriesSection {...props} />;
          }}
          exact
          path="/following/categories"
        />
        <Route
          component={(props: any) => {
            return <UsersSection {...props} />;
          }}
          exact
          path="/following/users"
        />
        <Route
          component={(props: any) => {
            return <CollectionsSection {...props} />;
          }}
          exact
          path="/following/collections"
        />
        <Route
          component={(props: any) => {
            return <ItemsSection {...props} />;
          }}
          exact
          path="/following/items"
        />
      </Switch>
    </div>
  );
};
