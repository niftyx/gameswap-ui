import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import {
  AssetsContainer,
  BrowseAssetItem,
  BrowseToolbar,
  ScrollContainer,
  SimpleLoader,
} from "components";
import { useConnectedWeb3Context, useTrade } from "contexts";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { IAssetItem, ISignedOrder, ITradeAssetItem } from "utils/types";

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
  const { openBuyModal } = useTrade();
  const { account, setWalletConnectModalOpened } = useConnectedWeb3Context();

  const [state, setState] = useState<IState>({
    isAuctionActive: false,
  });

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

  const onAuction = () => {
    setState((prevState) => ({
      ...prevState,
      isAuctionActive: !prevState.isAuctionActive,
    }));
  };

  const onBuy = (asset: IAssetItem) => {
    if (!account) {
      setWalletConnectModalOpened(true);
      return;
    }
    openBuyModal(asset);
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
                key={asset.id}
                onClick={onBuy}
                onMore={() => history.push(`/assets/${asset.id}`)}
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
