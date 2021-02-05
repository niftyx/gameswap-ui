import { Divider, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { PageContainer } from "components";
import { useAllOrders } from "helpers/useAllOrders";
import { transparentize } from "polished";
import React from "react";
import useCommonStyles from "styles/common";

import { HeroCarousel, TrendingGames, TrendingItems } from "./components";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "auto",
  },
  content: {
    height: "100%",
  },
  heroCarousel: {
    minHeight: "50%",
    marginLeft: -theme.spacing(2),
  },
  trendingGames: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  divider: {
    backgroundColor: transparentize(0.94, theme.colors.text.default),
  },
  trendingItems: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const HomePage = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const {
    allLoaded: allOrdersLoaded,
    loadMore: loadMoreAllOrders,
    loading: allOrdersLoading,
    orders: allOrders,
  } = useAllOrders();

  return (
    <PageContainer className={classes.root}>
      <div className={clsx(classes.content, commonClasses.scroll)}>
        <HeroCarousel className={classes.heroCarousel} />
        <TrendingGames className={classes.trendingGames} />
        <Divider className={classes.divider} />
        <TrendingItems
          className={classes.trendingItems}
          loading={allOrdersLoading}
          onScrollEnd={
            !allOrdersLoading && !allOrdersLoaded ? loadMoreAllOrders : () => {}
          }
          orders={allOrders}
        />
      </div>
    </PageContainer>
  );
};

export default HomePage;
