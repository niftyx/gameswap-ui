import { SignedOrder } from "@0x/types";
import { Button, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { AssetPhoto } from "components/Asset";
import { TokenAmountInput } from "components/Input";
import React from "react";
import { ZERO_NUMBER } from "utils/number";
import { IAssetItem, ITokenAmount } from "utils/types";

import { TradeCancelOrderRow } from "../TradeCancelOrderRow";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
  },
  img: {
    height: theme.spacing(20),
    width: theme.spacing(20),
    margin: `${theme.spacing(2)}px auto`,
  },
  button: {
    height: theme.spacing(6),
    marginTop: theme.spacing(2),
  },
}));

interface IProps {
  onConfirm: () => void;
  onCancel: (order: SignedOrder) => void;
  asset: IAssetItem;
  updatePrice: (_: ITokenAmount) => void;
  className?: string;
}

export const TradePriceInputStep = (props: IProps) => {
  const { asset, onCancel, onConfirm, updatePrice } = props;
  const classes = useStyles();

  if (!asset.price) return null;

  const isInSale = asset.isInSale;

  return (
    <div className={clsx(classes.root, props.className)}>
      {asset.image && (
        <AssetPhoto
          className={classes.img}
          type={asset.imageType}
          uri={asset.image}
        />
      )}
      {isInSale ? (
        <>
          {asset.orders &&
            asset.orders.map((order) => (
              <TradeCancelOrderRow
                key={order.salt.toString()}
                onCancel={() => {
                  onCancel(order);
                }}
                order={order}
              />
            ))}
        </>
      ) : (
        <>
          <TokenAmountInput onChange={updatePrice} value={asset.price} />
          <Button
            className={classes.button}
            color="primary"
            disabled={asset.price.amount.eq(ZERO_NUMBER)}
            fullWidth
            onClick={onConfirm}
            variant="contained"
          >
            Sell
          </Button>
        </>
      )}
    </div>
  );
};
