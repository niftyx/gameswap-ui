import { makeStyles } from "@material-ui/core";
import { BuyFilter, PageContainer, SwapControlBar } from "components";
import { useConnectedWeb3Context } from "contexts";
import React, { useState } from "react";
import { EMembership } from "utils/enums";
import { ITradeFilter } from "utils/types";

import { TradeSection, YourSwapSection } from "./components";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  right: { flex: 1 },
  filter: { width: 256, marginRight: 24 },
}));

interface IState {
  tradeFilter: ITradeFilter;
}

const BrowsePage = () => {
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
      <div className={classes.filter}>
        <BuyFilter
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

export default BrowsePage;
