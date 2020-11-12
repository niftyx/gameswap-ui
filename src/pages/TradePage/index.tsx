import { Hidden, makeStyles } from "@material-ui/core";
import { PageContainer, TradeFilter } from "components";
import React from "react";

import { AssetItemsSection, InventorySection } from "./components";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    display: "flex",
  },
  assets: {
    flex: 1,
  },
  inventory: {
    flex: 1,
  },
  filter: {
    width: theme.spacing(25),
    margin: `0 ${theme.spacing(2.5)}px`,
  },
}));

const TradePage = () => {
  const classes = useStyles();
  return (
    <PageContainer>
      <Hidden mdDown>
        <div className={classes.content}>
          <InventorySection className={classes.inventory} />
          <TradeFilter className={classes.filter} />
          <AssetItemsSection className={classes.assets} />
        </div>
      </Hidden>
    </PageContainer>
  );
};

export default TradePage;
