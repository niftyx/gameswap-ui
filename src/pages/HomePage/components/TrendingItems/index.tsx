import { Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { AssetItem, AssetsContainer, TrendingToolbar } from "components";
import React from "react";
import { useHistory } from "react-router-dom";
import { ISignedOrder, ITradeAssetItem } from "utils/types";

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

  const assets: ITradeAssetItem[] = [];

  orders.forEach((order) => {
    const assetId = order.assetId;
    const collectionId = order.erc721Address.toLowerCase();

    const addedElement = assets.find(
      (asset) => asset.id.eq(assetId) && asset.collectionId === collectionId
    );
    if (addedElement) {
      addedElement.orders.push(order);
    } else {
      assets.push({
        id: assetId,
        collectionId: collectionId,
        orders: [order],
      });
    }
  });

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
              key={`${asset.collectionId}${asset.id.toHexString()}`}
              onMore={(id) => history.push(`/assets/${id}`)}
            />
          ))}
        </AssetsContainer>
      </div>
    </div>
  );
};
