import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import {
  AssetsContainer,
  BrowseAssetItem,
  BrowseToolbar,
  ScrollContainer,
  SimpleLoader,
} from "components";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { ISignedOrder, ITradeAssetItem } from "utils/types";

import AuctionItemsSection from "../AuctionItemsSection";

const useStyles = makeStyles((theme) => ({
  root: {},
  assets: {
    marginTop: theme.spacing(2),
  },
}));

interface IProps {
  className?: string;
  onScrollEnd?: () => void;
  loading?: boolean;
  orders: ISignedOrder[];
}

interface IState {
  isAuctionActive: boolean;
}

const AssetItemsSection = (props: IProps) => {
  const classes = useStyles();

  const { loading, onScrollEnd, orders } = props;
  const history = useHistory();

  const [state, setState] = useState<IState>({
    isAuctionActive: false,
  });

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

  const onAuction = () => {
    setState((prevState) => ({
      ...prevState,
      isAuctionActive: !prevState.isAuctionActive,
    }));
  };

  return (
    <ScrollContainer
      className={clsx(classes.root, props.className)}
      onScrollEnd={onScrollEnd}
    >
      <BrowseToolbar
        isAuctionActive={state.isAuctionActive}
        onAuction={onAuction}
      />
      <div className={classes.assets}>
        {state.isAuctionActive ? (
          <AuctionItemsSection />
        ) : (
          <AssetsContainer>
            {assets.map((asset) => (
              <BrowseAssetItem
                data={asset}
                isOnCart={false}
                key={`${asset.collectionId}${asset.id.toHexString()}`}
                onMore={(id) => history.push(`/assets/${id}`)}
              />
            ))}
          </AssetsContainer>
        )}
      </div>
      {loading && <SimpleLoader />}
    </ScrollContainer>
  );
};

export default AssetItemsSection;
