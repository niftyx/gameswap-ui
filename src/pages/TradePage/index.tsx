import { Hidden, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { PageContainer, TradeFilter } from "components";
import React from "react";
import useCommonStyles from "styles/common";

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

  return (
    <PageContainer>
      <Hidden mdDown>
        <div className={classes.content}>
          <InventorySection
            className={clsx(classes.inventory, commonClasses.scroll)}
          />
          <TradeFilter className={classes.filter} />
          <AssetItemsSection
            className={clsx(classes.assets, commonClasses.scroll)}
          />
        </div>
      </Hidden>
    </PageContainer>
  );
};

export default TradePage;
