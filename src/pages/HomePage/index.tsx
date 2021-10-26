import { Divider, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { PageContainer } from "components";
import { useAllOrders } from "helpers/useAllOrders";
import { transparentize } from "polished";
import React from "react";
import useCommonStyles from "styles/common";

import {
  FeaturedCollections,
  HeroCarousel,
  TrendingGames,
  TrendingItems,
} from "./components";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "auto",
    padding: 0,
  },
  content: {
    height: "100%",
  },
  heroCarousel: {
    minHeight: "50%",
  },
  restContent: { padding: "16px 24px" },
  section: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  divider: {
    backgroundColor: transparentize(0.94, theme.colors.white),
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
        <div className={classes.restContent}>
          <TrendingGames className={classes.section} />
          <Divider className={classes.divider} />
          <FeaturedCollections className={classes.section} />
          <Divider className={classes.divider} />
          <TrendingItems
            className={classes.section}
            loading={allOrdersLoading}
            onScrollEnd={
              !allOrdersLoading && !allOrdersLoaded
                ? loadMoreAllOrders
                : () => {}
            }
            orders={allOrders}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
