import { makeStyles } from "@material-ui/core";
import { PageContainer, SwapControlBar, SwapFilter } from "components";
import { useConnectedWeb3Context } from "contexts";
import React, { useState } from "react";
import { EMembership } from "utils/enums";
import { ITradeFilter } from "utils/types";

import {
  EmptyInventorySection,
  NoWalletSection,
  OfferSection,
  TradeSection,
  YourSwapSection,
} from "./components";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  left: { flex: 1 },
  right: { flex: 1 },
  filter: { width: 256, margin: "0 24px" },
}));

interface IState {
  tradeFilter: ITradeFilter;
}

const SwapPage = () => {
  const classes = useStyles();
  const { account } = useConnectedWeb3Context();
  const [state, setState] = useState<IState>({
    tradeFilter: {
      priceEnabled: false,
      statusEnabled: false,
      collectionEnabled: false,
      saleCurrencyEnabled: false,
      platformEnabled: false,
      membership: EMembership.Basic,
    },
  });

  const updateTradeFilter = (newValues: any) =>
    setState((prevState) => ({
      ...prevState,
      tradeFilter: {
        ...prevState.tradeFilter,
        ...newValues,
      },
    }));

  const isConnected = !!account;

  return (
    <PageContainer className={classes.root}>
      <div className={classes.left}>
        <OfferSection />
        <SwapControlBar />
        {isConnected ? <EmptyInventorySection /> : <NoWalletSection />}
      </div>
      <div className={classes.filter}>
        <SwapFilter
          filter={state.tradeFilter}
          updateFilter={updateTradeFilter}
        />
      </div>
      <div className={classes.right}>
        <YourSwapSection />
        <SwapControlBar />
        <TradeSection />
      </div>
    </PageContainer>
  );
};

export default SwapPage;
