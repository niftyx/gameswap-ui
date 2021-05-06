import { Hidden, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { PageContainer, TradeFilter } from "components";
import { useConnectedWeb3Context } from "contexts";
import { useInventoryAssets } from "helpers";
import { useAllOrders } from "helpers/useAllOrders";
import React, { useState } from "react";
import useCommonStyles from "styles/common";
import { IGraphInventoryAsset } from "types";
import { EMembership } from "utils/enums";
import {
  IInventoryFilter,
  ISignedOrder,
  ITradeFilter,
  ITradeSectionFilter,
} from "utils/types";

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
  inventoryFilter: IInventoryFilter;
  tradeSectionFilter: ITradeSectionFilter;
  tradeFilter: ITradeFilter;
}

const TradePage = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { account } = useConnectedWeb3Context();
  const [state, setState] = useState<IState>({
    selectedInventoryAssets: [],
    selectedTradeOrders: [],
    inventoryFilter: {},
    tradeSectionFilter: {},
    tradeFilter: {
      priceEnabled: false,
      statusEnabled: false,
      collectionEnabled: false,
      saleCurrencyEnabled: false,
      platformEnabled: false,
      membership: EMembership.Basic,
    },
  });

  const {
    assets: inventoryAssets,
    hasMore: hasMoreInventoryItems,
    loadMore: loadMoreInventoryItems,
    loading: inventoryLoading,
    reload: reloadInventoryAssets,
  } = useInventoryAssets({
    ...state.inventoryFilter,
    ownerId: account || "",
  });

  const {
    allLoaded: allOrdersLoaded,
    loadMore: loadMoreAllOrders,
    loading: allOrdersLoading,
    orders: allOrders,
  } = useAllOrders();

  const setSelectedInventoryAssets = (
    selectedInventoryAssets: IGraphInventoryAsset[]
  ) => {
    setState((prev) => ({ ...prev, selectedInventoryAssets }));
  };

  const setSelectedTradeOrders = (selectedTradeOrders: ISignedOrder[]) => {
    setState((prev) => ({ ...prev, selectedTradeOrders }));
  };

  const setInventoryFilter = (filter: IInventoryFilter) => {
    setState((prev) => ({ ...prev, inventoryFilter: filter }));
  };

  const setTradeSectionFilter = (filter: ITradeSectionFilter) => {
    setState((prev) => ({ ...prev, tradeSectionFilter: filter }));
  };

  const updateTradeFilter = (newValues: any) =>
    setState((prevState) => ({
      ...prevState,
      tradeFilter: {
        ...prevState.tradeFilter,
        ...newValues,
      },
    }));

  return (
    <PageContainer>
      <Hidden smDown>
        <div className={classes.content}>
          <InventorySection
            assets={inventoryAssets}
            className={clsx(classes.inventory)}
            filter={state.inventoryFilter}
            loading={inventoryLoading}
            onChangeSelected={setSelectedInventoryAssets}
            onReload={reloadInventoryAssets}
            onScrollEnd={
              !inventoryLoading && hasMoreInventoryItems
                ? loadMoreInventoryItems
                : () => {}
            }
            onUpdateFilter={setInventoryFilter}
            selectedAssets={state.selectedInventoryAssets}
          />
          <TradeFilter
            className={classes.filter}
            filter={state.tradeFilter}
            updateFilter={updateTradeFilter}
          />
          <AssetItemsSection
            className={clsx(classes.assets, commonClasses.scroll)}
            filter={state.tradeSectionFilter}
            loading={allOrdersLoading}
            onChangeSelected={setSelectedTradeOrders}
            onReload={reloadInventoryAssets}
            onScrollEnd={
              !allOrdersLoading && !allOrdersLoaded
                ? loadMoreAllOrders
                : () => {}
            }
            onUpdateFilter={setTradeSectionFilter}
            orders={allOrders}
            selectedOrders={state.selectedTradeOrders}
          />
        </div>
      </Hidden>
    </PageContainer>
  );
};

export default TradePage;
