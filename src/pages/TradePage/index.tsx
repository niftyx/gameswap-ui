import { Hidden, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { PageContainer, TradeFilter } from "components";
import { useConnectedWeb3Context } from "contexts";
import { useInventoryAssets } from "helpers";
import { useAllOrders } from "helpers/useAllOrders";
import React, { useState } from "react";
import useCommonStyles from "styles/common";
import { IGraphInventoryAsset } from "types";
import { ISignedOrder } from "utils/types";

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
    display: "flex",
    flexDirection: "column",
  },
  inventory: {
    flex: 1,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  filter: {
    width: theme.spacing(25),
    minWidth: theme.spacing(25),
    margin: `0 ${theme.spacing(2.5)}px`,
  },
}));

interface IState {
  selectedInventoryAssets: IGraphInventoryAsset[];
  selectedTradeOrders: ISignedOrder[];
}

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

  const {
    allLoaded: allOrdersLoaded,
    loadMore: loadMoreAllOrders,
    loading: allOrdersLoading,
    orders: allOrders,
  } = useAllOrders();

  const [state, setState] = useState<IState>({
    selectedInventoryAssets: [],
    selectedTradeOrders: [],
  });

  const setSelectedInventoryAssets = (
    selectedInventoryAssets: IGraphInventoryAsset[]
  ) => {
    setState((prev) => ({ ...prev, selectedInventoryAssets }));
  };

  const setSelectedTradeOrders = (selectedTradeOrders: ISignedOrder[]) => {
    setState((prev) => ({ ...prev, selectedTradeOrders }));
  };

  return (
    <PageContainer>
      <Hidden smDown>
        <div className={classes.content}>
          <InventorySection
            assets={inventoryAssets}
            className={clsx(classes.inventory)}
            loading={inventoryLoading}
            onChangeSelected={setSelectedInventoryAssets}
            onScrollEnd={
              !inventoryLoading && hasMoreInventoryItems
                ? loadMoreInventoryItems
                : () => {}
            }
            selectedAssets={state.selectedInventoryAssets}
          />
          <TradeFilter className={classes.filter} />
          <AssetItemsSection
            className={clsx(classes.assets, commonClasses.scroll)}
            loading={allOrdersLoading}
            onChangeSelected={setSelectedTradeOrders}
            onScrollEnd={
              !allOrdersLoading && !allOrdersLoaded
                ? loadMoreAllOrders
                : () => {}
            }
            orders={allOrders}
            selectedOrders={state.selectedTradeOrders}
          />
        </div>
      </Hidden>
    </PageContainer>
  );
};

export default TradePage;
