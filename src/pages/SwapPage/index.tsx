import { makeStyles } from "@material-ui/core";
import { PageContainer, SwapControlBar } from "components";
import { useConnectedWeb3Context } from "contexts";
import React from "react";

import { OfferSection } from "./components";
import { YourSwapSection } from "./components/YourSwapSection";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  left: { flex: 1 },
  right: { flex: 1 },
  filter: { width: 256, margin: "0 24px" },
}));

const SwapPage = () => {
  const classes = useStyles();
  const { account } = useConnectedWeb3Context();

  const isConnected = !!account;

  return (
    <PageContainer className={classes.root}>
      <div className={classes.left}>
        <OfferSection />
        <SwapControlBar />
      </div>
      <div className={classes.filter}></div>
      <div className={classes.right}>
        <YourSwapSection />
        <SwapControlBar />
      </div>
    </PageContainer>
  );
};

export default SwapPage;
