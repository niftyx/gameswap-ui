import { Hidden, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { PageContainer, TradeFilter } from "components";
import React from "react";
import useCommonStyles from "styles/common";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    display: "flex",
    height: "100%",
  },
}));

const HomePage = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  return <PageContainer>hhh</PageContainer>;
};

export default HomePage;
