import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { PageContainer } from "components";
import { transparentize } from "polished";
import React, { lazy } from "react";
import { Route, matchPath, useHistory } from "react-router-dom";
import useCommonStyles from "styles/common";

import { FaqNavbar } from "./components";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "auto",
  },
  content: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: transparentize(0.9, theme.colors.text.default),
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    "& > * + *": {
      marginLeft: theme.spacing(0.5),
    },
    [theme.breakpoints.down("sm")]: {
      "& > * + *": {
        marginLeft: 0,
      },
    },
  },
  mainContent: {
    flex: 1,
  },
  navbar: {
    width: theme.spacing(40),
    [theme.breakpoints.down("sm")]: {
      flex: 1,
      width: "auto",
    },
  },
}));

const FaqPage = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const history = useHistory();
  const isMainPage = !!matchPath(history.location.pathname, {
    exact: true,
    path: "/faq",
  });

  return (
    <PageContainer className={classes.root}>
      <div className={classes.content}>
        <FaqNavbar
          className={clsx(
            classes.navbar,
            isMainPage ? "" : commonClasses.hideBelowWide
          )}
        />
        <div
          className={clsx(
            classes.mainContent,
            isMainPage ? commonClasses.hideBelowWide : ""
          )}
        >
          <Route
            component={lazy(
              () => import("pages/FaqPage/components/FaqDetailsSection")
            )}
            exact
            path="/faq"
          />
          <Route
            component={lazy(
              () => import("pages/FaqPage/components/FaqDetailsSection")
            )}
            exact
            path="/faq/:id"
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default FaqPage;
