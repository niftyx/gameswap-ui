import { makeStyles } from "@material-ui/core";
import React from "react";

import { Header } from "./components";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100vh",
    backgroundColor: theme.colors.background.secondary,
    paddingTop: theme.custom.appHeaderHeight,
    overflowY: "auto",
  },
}));

interface IProps {
  children: React.ReactNode;
}

const MainLayout = (props: IProps) => {
  const classes = useStyles();
  return (
    <>
      <Header />
      <main className={classes.container}>{props.children}</main>
    </>
  );
};

export default MainLayout;
