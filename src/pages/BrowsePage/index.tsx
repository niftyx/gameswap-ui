import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { BrowseFilter, PageContainer } from "components";
import { useBrowseAssets } from "helpers";
import { useAllOrders } from "helpers/useAllOrders";
import React from "react";
import { matchPath, useHistory } from "react-router-dom";
import useCommonStyles from "styles/common";

import { AssetItemsSection, FeaturedItemsSection } from "./components";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  mainContent: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  assets: {
    flex: 1,
    height: "100%",
    overflowY: "auto",
    overflowX: "hidden",
  },
  inventory: {
    flex: 1,
    height: "100%",
    overflowY: "auto",
    overflowX: "hidden",
  },
  filter: {
    width: theme.spacing(25),
    minWidth: theme.spacing(25),
    margin: `0 ${theme.spacing(2.5)}px`,
  },
  featuredItems: {
    marginBottom: theme.spacing(2),
  },
}));

const BrowsePage = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const history = useHistory();
  const {
    allLoaded: allOrdersLoaded,
    loadMore: loadMoreAllOrders,
    loading: allOrdersLoading,
    orders: allOrders,
  } = useAllOrders();

  return (
    <PageContainer>
      <div className={classes.content}>
        <FeaturedItemsSection className={classes.featuredItems} />

        <div className={classes.mainContent}>
          <BrowseFilter className={classes.filter} />
          <AssetItemsSection
            className={clsx(classes.assets, commonClasses.scroll)}
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

export default BrowsePage;
