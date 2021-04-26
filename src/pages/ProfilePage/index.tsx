import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { LoadingScreen, PageContainer } from "components";
import React, { Suspense, lazy, useEffect } from "react";
import { Route, Switch, useHistory, useParams } from "react-router-dom";
import useCommonStyles from "styles/common";
import { isAddress } from "utils/tools";

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

  const params = useParams();
  const history = useHistory();
  const userId = ((params || {}) as any).id;

  useEffect(() => {
    if (!userId || !isAddress(userId)) {
      history.push("/");
    }
  }, [userId]);

  if (!userId || !isAddress(userId)) {
    return null;
  }

  return (
    <PageContainer className={classes.root}>
      <div className={clsx(classes.content, commonClasses.scroll)}>
        <HeroSection className={classes.heroSection} userId={userId} />
        <AssetsTabSection className={classes.section} />
        <Suspense fallback={<LoadingScreen />}>
          <Switch>
            <Route
              component={lazy(
                () => import("pages/ProfilePage/components/AssetsSection")
              )}
              exact
              path="/users/:id/assets"
            />
            <Route
              component={lazy(
                () => import("pages/ProfilePage/components/OnSaleAssetsSection")
              )}
              exact
              path="/users/:id/on-sale"
            />
            <Route
              component={lazy(
                () =>
                  import("pages/ProfilePage/components/CreatedAssetsSection")
              )}
              exact
              path="/users/:id/created"
            />
            <Route
              component={lazy(
                () => import("pages/ProfilePage/components/LikedAssetsSection")
              )}
              exact
              path="/users/:id/liked"
            />
          </Switch>
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default ProfilePage;
