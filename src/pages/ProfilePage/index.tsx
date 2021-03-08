import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { LoadingScreen, PageContainer } from "components";
import React, { Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";
import useCommonStyles from "styles/common";

import { AssetsTabSection, HeroSection } from "./components";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "auto",
  },
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

const ProfilePage = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  return (
    <PageContainer className={classes.root}>
      <div className={clsx(classes.content, commonClasses.scroll)}>
        <HeroSection className={classes.heroSection} />
        <AssetsTabSection className={classes.section} />
        <Suspense fallback={<LoadingScreen />}>
          <Switch>
            <Route
              component={lazy(
                () => import("pages/ProfilePage/components/AssetsSection")
              )}
              exact
              path="/profile/assets"
            />
            <Route
              component={lazy(
                () => import("pages/ProfilePage/components/OnSaleAssetsSection")
              )}
              exact
              path="/profile/on-sale"
            />
            <Route
              component={lazy(
                () =>
                  import("pages/ProfilePage/components/CreatedAssetsSection")
              )}
              exact
              path="/profile/created"
            />
            <Route
              component={lazy(
                () => import("pages/ProfilePage/components/LikedAssetsSection")
              )}
              exact
              path="/profile/liked"
            />
          </Switch>
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default ProfilePage;
