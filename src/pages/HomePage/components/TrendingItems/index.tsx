import { Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { AssetItem, AssetsContainer, TrendingToolbar } from "components";
import { useTrade } from "contexts";
import React from "react";
import { useHistory } from "react-router-dom";
import { IAssetItem, ISignedOrder, ITradeAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {},
  assets: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  header: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: theme.spacing(3),
    },
  },
  title: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(2),
  },
  toolbar: {
    flex: 1,
  },
}));

interface IProps {
  className?: string;
  onScrollEnd?: () => void;
  loading?: boolean;
  orders: ISignedOrder[];
}

export const TrendingItems = (props: IProps) => {
  const classes = useStyles();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading, onScrollEnd, orders } = props;
  const history = useHistory();
  const { openBuyModal } = useTrade();

  const assets: ITradeAssetItem[] = [];

  orders.forEach((order) => {
    const assetId = order.assetId.toHexString();
    const addedElement = assets.find((asset) => asset.id === assetId);
    if (addedElement) {
      addedElement.orders.push(order);
    } else {
      assets.push({
        id: assetId,
        orders: [order],
      });
    }
  });

  const onBuy = (asset: IAssetItem) => {
    openBuyModal(asset);
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.header}>
        <Typography className={classes.title} component="div">
          TRENDING GAMES
        </Typography>
        <TrendingToolbar className={classes.toolbar} />
      </div>

      <div className={classes.assets}>
        <AssetsContainer>
          {assets.map((asset) => (
            <AssetItem
              data={asset}
              key={asset.id}
              onClick={onBuy}
              onMore={() => history.push(`/assets/${asset.id}`)}
            />
          ))}
        </AssetsContainer>
      </div>
    </div>
  );
};
