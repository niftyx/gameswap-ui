import { Hidden, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { PageContainer, TradeFilter } from "components";
import { useConnectedWeb3Context } from "contexts";
import { useInventoryAssets, useMyOrders } from "helpers";
import { useAllOrders } from "helpers/useAllOrders";
import React from "react";
import useCommonStyles from "styles/common";
import { IGraphInventoryAsset } from "types";

import { AssetItemsSection, InventorySection } from "./components";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    display: "flex",
    height: "100%",
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
}));

const TradePage = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { account } = useConnectedWeb3Context();
  const {
    assets: inventoryAssets,
    hasMore: hasMoreInventoryItems,
    loadMore: loadMoreInventoryItems,
    loading: inventoryLoading,
  } = useInventoryAssets({
    id: account || "",
  });

  const { orders: myOrders } = useMyOrders();

  const {
    allLoaded: allOrdersLoaded,
    loadMore: loadMoreAllOrders,
    loading: allOrdersLoading,
    orders: allOrders,
  } = useAllOrders();

  const finalInventoryAssets: IGraphInventoryAsset[] = inventoryAssets.map(
    (asset) => {
      const relatedOrders = myOrders.filter(
        (order) =>
          order.assetId.eq(asset.assetId) &&
          order.erc721Address === asset.collectionId
      );

      return {
        ...asset,
        isInSale: relatedOrders.length > 0,
        orders: relatedOrders,
      };
    }
  );

  return (
    <PageContainer>
      <Hidden smDown>
        <div className={classes.content}>
          <InventorySection
            assets={finalInventoryAssets}
            className={clsx(classes.inventory)}
            loading={inventoryLoading}
            onScrollEnd={
              !inventoryLoading && hasMoreInventoryItems
                ? loadMoreInventoryItems
                : () => {}
            }
          />
          <TradeFilter className={classes.filter} />
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
      </Hidden>
    </PageContainer>
  );
};

export default TradePage;
