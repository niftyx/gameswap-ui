import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import React from "react";
import { matchPath, useHistory } from "react-router-dom";
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
    paddingLeft: theme.custom.appNavbarWidth,
  },
}));

interface IProps {
  children: React.ReactNode;
}

const MainLayout = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const history = useHistory();

  const hideNavbar = matchPath(history.location.pathname, {
    exact: true,
    path: "/trade",
  });

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

export default MainLayout;
