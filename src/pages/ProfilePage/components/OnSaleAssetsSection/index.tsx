/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import {
  AssetsContainer,
  BrowseAssetItem,
  ScrollContainer,
  SimpleLoader,
} from "components";
import { useMyOrders } from "helpers";
import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { isAddress } from "utils/tools";
import { ITradeAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    paddingBottom: 40,
  },
  assets: {
    marginTop: theme.spacing(2),
    overflowY: "auto",
    flex: 1,
    padding: "0 6px",
  },
}));

interface IProps {
  className?: string;
}

const OnSaleAssetsSection = (props: IProps) => {
  const classes = useStyles();
  const params = useParams();
  const history = useHistory();
  const userId = ((params || {}) as any).id;
  const { allLoaded, loadMore, loading, orders } = useMyOrders(userId);

  useEffect(() => {
    if (!userId || !isAddress(userId)) {
      history.push("/");
    }
  }, [userId]);

  if (!userId || !isAddress(userId)) {
    return null;
  }

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
      <ScrollContainer
        className={classes.assets}
        onScrollEnd={() => {
          if (!allLoaded) loadMore();
        }}
      >
        <AssetsContainer>
          {assets.map((asset) => (
            <BrowseAssetItem
              data={asset}
              isOnCart={false}
              key={`${asset.collectionId}${asset.id.toHexString()}`}
              onClick={(id) => history.push(`/assets/${id}`)}
            />
          ))}
        </AssetsContainer>
      </ScrollContainer>
      {loading && <SimpleLoader />}
    </div>
  );
};

export default OnSaleAssetsSection;
