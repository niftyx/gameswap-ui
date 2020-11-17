import { Hidden, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { PageContainer, TradeFilter } from "components";
import React from "react";
import useCommonStyles from "styles/common";

import { HeroCarousel, TrendingGames } from "./components";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    height: "100%",
  },
  heroCarousel: {
    height: "50%",
  },
}));

const HomePage = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  return (
    <PageContainer className={classes.root}>
      <div className={clsx(classes.content, commonClasses.scroll)}>
        <HeroCarousel className={classes.heroCarousel} />
        <TrendingGames />
      </div>
    </PageContainer>
  );
};

export default HomePage;
