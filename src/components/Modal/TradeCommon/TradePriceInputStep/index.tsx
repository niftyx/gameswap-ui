import { Button, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { TokenAmountInput } from "components/Input";
import { BigNumber } from "ethers";
import React from "react";
import { ZERO_NUMBER } from "utils/number";
import { IAssetItem, IToken, ITokenAmount } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
  },
  img: {
    height: theme.spacing(20),
    width: theme.spacing(20),
    margin: theme.spacing(2),
  },
  button: {
    height: theme.spacing(6),
    marginTop: theme.spacing(2),
  },
}));

interface IProps {
  onConfirm: () => void;
  asset: IAssetItem;
  updatePrice: (_: ITokenAmount) => void;
  className?: string;
}

export const TradePriceInputStep = (props: IProps) => {
  const { asset, onConfirm, updatePrice } = props;
  const classes = useStyles();

  if (!asset.price) return null;

  return (
    <div className={clsx(classes.root, props.className)}>
      {asset.base64 && (
        <img alt="asset-img" className={classes.img} src={asset.base64} />
      )}
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
    </div>
  );
};
