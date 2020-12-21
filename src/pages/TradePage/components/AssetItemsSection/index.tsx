import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import {
  AssetsContainer,
  AssetsToolbar,
  ScrollContainer,
  SimpleLoader,
  TradeAssetItem,
} from "components";
import {
  CartContentItem,
  CartContentWrapper,
  CartEmpty,
} from "components/Cart";
import { useGlobal, useTrade } from "contexts";
import React, { useState } from "react";
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

interface IState {
  selectedId: string;
}

const AssetItemsSection = (props: IProps) => {
  const classes = useStyles();
  const {
    clearItemCart,
    data: { itemCartIds },
    isInItemCart,
    toggleItemCart,
  } = useGlobal();
  const history = useHistory();
  const { loading, onScrollEnd, orders } = props;
  const { openBuyModal } = useTrade();
  const [state, setState] = useState<IState>({ selectedId: "" });

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

  const selectedItems: ITradeAssetItem[] = assets.filter((item) =>
    isInItemCart(item.id)
  );

  let totalPrice = 0;
  selectedItems.forEach((element: ITradeAssetItem) => {
    // totalPrice = totalPrice + element.usdPrice;
  });

  totalPrice = 1;

  const onBuy = (asset: IAssetItem) => {
    openBuyModal(asset);
  };

  const onTrade = () => {};
  const onClear = () => {
    clearItemCart();
  };

  const renderCartContent = ({ handleClose }: { handleClose?: () => void }) => {
    const itemsCount = selectedItems.length;
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
              isOnCart={isInItemCart(asset.id) as any}
              key={asset.id}
              onClick={onBuy}
              onMore={() => history.push(`/trade/${asset.id}`)}
            />
          ))}
        </AssetsContainer>
      </div>
      {loading && <SimpleLoader />}
    </ScrollContainer>
  );
};

export default AssetItemsSection;
