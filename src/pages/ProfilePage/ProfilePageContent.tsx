import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React, { useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import useCommonStyles from "styles/common";
import { isAddress } from "utils/tools";

import {
  AssetsSection,
  AssetsTabSection,
  CreatedAssetsSection,
  HeroSection,
  LikedAssetsSection,
  OnSaleAssetsSection,
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

interface IProps {
  userId: string;
  customUrl?: string;
}

export const ProfilePageContent = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const history = useHistory();
  const { customUrl, userId } = props;

  const userIdValid = userId && isAddress(userId);

  useEffect(() => {
    if (!userIdValid) {
      history.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (!userIdValid) {
    return null;
  }

  return (
    <div className={clsx(classes.content, commonClasses.scroll)}>
      <HeroSection className={classes.heroSection} userId={userId} />
      <AssetsTabSection
        className={classes.section}
        customUrl={customUrl}
        userId={userId}
      />
      <Switch>
        <Route
          component={(props: any) => {
            return <AssetsSection {...props} userId={userId} />;
          }}
          exact
          path="/users/:id/assets"
        />
        <Route
          component={(props: any) => {
            return <OnSaleAssetsSection {...props} userId={userId} />;
          }}
          exact
          path="/users/:id/on-sale"
        />
        <Route
          component={(props: any) => {
            return <CreatedAssetsSection {...props} userId={userId} />;
          }}
          exact
          path="/users/:id/created"
        />
        <Route
          component={(props: any) => {
            return <LikedAssetsSection {...props} userId={userId} />;
          }}
          exact
          path="/users/:id/liked"
        />
        {customUrl && (
          <>
            <Route
              component={(props: any) => {
                return <AssetsSection {...props} userId={userId} />;
              }}
              exact
              path={`/${customUrl}/assets`}
            />
            <Route
              component={(props: any) => {
                return <OnSaleAssetsSection {...props} userId={userId} />;
              }}
              exact
              path={`/${customUrl}/on-sale`}
            />
            <Route
              component={(props: any) => {
                return <CreatedAssetsSection {...props} userId={userId} />;
              }}
              exact
              path={`/${customUrl}/created`}
            />
            <Route
              component={(props: any) => {
                return <LikedAssetsSection {...props} userId={userId} />;
              }}
              exact
              path={`/${customUrl}/liked`}
            />
          </>
        )}
      </Switch>
    </div>
  );
};
