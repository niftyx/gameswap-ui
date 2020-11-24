import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import React from "react";
import {
  RouteComponentProps,
  matchPath,
  useHistory,
  withRouter,
} from "react-router-dom";
import useCommonStyles from "styles/common";

import { Header, Navbar } from "./components";

const useStyles = makeStyles((theme) => ({
  container: {
    height: `calc(100vh - ${theme.custom.appHeaderHeight}px)`,
    backgroundColor: theme.colors.background.secondary,
    marginTop: theme.custom.appHeaderHeight,
    overflowY: "auto",
  },
  containerWithMenuLeft: {
    paddingLeft: Number(theme.custom.appNavbarWidth) + theme.spacing(1.5),
  },
}));

interface IProps {
  children: React.ReactNode;
}

const MainLayout = (props: IProps & RouteComponentProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const history = useHistory();

  const hideNavbarRoutes = ["/trade", "/browse"];

  const hideNavbar = hideNavbarRoutes
    .map(
      (path) =>
        !!matchPath(history.location.pathname, {
          exact: false,
          path,
        })
    )
    .reduce((current, element) => current || element);

  return (
    <>
      <Header />
      <main
        className={clsx(
          classes.container,
          commonClasses.scroll,
          hideNavbar ? "" : classes.containerWithMenuLeft
        )}
      >
        {!hideNavbar && <Navbar />}
        {props.children}
      </main>
    </>
  );
};

export default withRouter(MainLayout);
