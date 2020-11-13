import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import React from "react";
import useCommonStyles from "styles/common";

import { Header } from "./components";

const useStyles = makeStyles((theme) => ({
  container: {
    height: `calc(100vh - ${theme.custom.appHeaderHeight}px)`,
    backgroundColor: theme.colors.background.secondary,
    marginTop: theme.custom.appHeaderHeight,
    overflowY: "auto",
  },
}));

interface IProps {
  children: React.ReactNode;
}

const MainLayout = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  return (
    <>
      <Header />
      <main className={clsx(classes.container, commonClasses.scroll)}>
        {props.children}
      </main>
    </>
  );
};

export default MainLayout;
