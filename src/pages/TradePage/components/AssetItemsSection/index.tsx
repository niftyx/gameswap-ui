import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import {
  AssetsContainer,
  AssetsToolbar,
  ScrollContainer,
  SimpleLoader,
  TradeAssetItem,
} from "components";
import { CartContentWrapper, CartEmpty } from "components/Cart";
import { useConnectedWeb3Context, useGlobal, useTrade } from "contexts";
import { logger } from "ethers";
import React from "react";
import { useHistory } from "react-router-dom";
import { IAssetItem, ISignedOrder, ITradeAssetItem } from "utils/types";

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

const AssetItemsSection = (props: IProps) => {
  const classes = useStyles();
  const {
    clearItemCart,
    data: { itemCartIds },
    isInItemCart,
  } = useGlobal();
  const { account, setWalletConnectModalOpened } = useConnectedWeb3Context();
  const history = useHistory();
  const { loading, onScrollEnd, orders } = props;
  const { openBuyModal } = useTrade();

  const assets: ITradeAssetItem[] = [];

  orders.forEach((order) => {
    const assetId = order.assetId;
    const collectionId = order.erc721Address;

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

  let totalPrice = 0;

  totalPrice = 1;

  const onBuy = (asset: IAssetItem) => {
    if (!account) {
      setWalletConnectModalOpened(true);
      return;
    }
    openBuyModal(asset);
  };

  const onTrade = () => {};
  const onClear = () => {
    clearItemCart();
  };

  const renderCartContent = ({ handleClose }: { handleClose?: () => void }) => {
    const itemsCount = 0;
    return (
      <>
        {!itemsCount ? (
          <CartEmpty />
        ) : (
          <CartContentWrapper
            itemsCount={itemsCount}
            onClear={() => {
              if (handleClose) handleClose();
              onClear();
            }}
            onTrade={onTrade}
            totalPrice={totalPrice}
          >
            {/* {selectedItems.map((item: IAssetItem) => (
              <CartContentItem
                data={item}
                key={item.id}
                onRemove={() => toggleItemCart(item.id)}
              />
            ))} */}
          </CartContentWrapper>
        )}
      </>
    );
  };

  return (
    <ScrollContainer
      className={clsx(classes.root, props.className)}
      onScrollEnd={onScrollEnd}
    >
      <AssetsToolbar
        cartItemCount={itemCartIds.length}
        renderCartContent={renderCartContent}
        totalPrice={totalPrice}
      />
      <div className={classes.assets}>
        <AssetsContainer>
          {assets.map((asset) => (
            <TradeAssetItem
              data={asset}
              isOnCart={false}
              key={`${asset.collectionId}${asset.id.toHexString()}`}
              onClick={onBuy}
              onMore={(id) => history.push(`/assets/${id}`)}
            />
          ))}
        </AssetsContainer>
      </div>
      {loading && <SimpleLoader />}
    </ScrollContainer>
  );
};

export default AssetItemsSection;
