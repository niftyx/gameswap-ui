import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import {
  AssetsContainer,
  AssetsToolbar,
  ScrollContainer,
  SimpleLoader,
  TradeAssetItem,
} from "components";
import { CartContentWrapper, CartEmpty } from "components/Cart";
import { useConnectedWeb3Context, useGlobal, useTrade } from "contexts";
import React from "react";
import { useHistory } from "react-router-dom";
import { IAssetItem, ISignedOrder, ITradeAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {},
  assets: {
    marginTop: theme.spacing(2),
    overflowY: "auto",
    flex: 1,
    padding: "0 6px",
  },
}));

interface IProps {
  className?: string;
  onScrollEnd?: () => void;
  loading?: boolean;
  orders: ISignedOrder[];
  selectedOrders: ISignedOrder[];
  onChangeSelected: (_: ISignedOrder[]) => void;
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
  const {
    loading,
    onChangeSelected,
    onScrollEnd,
    orders,
    selectedOrders,
  } = props;
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
    <div className={clsx(classes.root, props.className)}>
      <AssetsToolbar
        cartItemCount={itemCartIds.length}
        renderCartContent={renderCartContent}
        totalPrice={totalPrice}
      />
      <ScrollContainer className={classes.assets} onScrollEnd={onScrollEnd}>
        <AssetsContainer>
          {assets.map((asset) => {
            const selected = !!selectedOrders.find(
              (sel) =>
                sel.erc721Address === asset.collectionId &&
                sel.assetId.eq(asset.id)
            );
            return (
              <TradeAssetItem
                data={asset}
                isOnCart={false}
                key={`${asset.collectionId}${asset.id.toHexString()}`}
                onClick={() => {
                  if (selected) {
                    onChangeSelected(
                      selectedOrders.filter(
                        (sel) =>
                          !(
                            sel.erc721Address === asset.collectionId &&
                            sel.assetId.eq(asset.id)
                          )
                      )
                    );
                  } else {
                    onChangeSelected([...selectedOrders, ...asset.orders]);
                  }
                }}
                onMore={(id) => history.push(`/assets/${id}`)}
                selected={selected}
              />
            );
          })}
        </AssetsContainer>
        {loading && <SimpleLoader />}
      </ScrollContainer>
    </div>
  );
};

export default AssetItemsSection;
