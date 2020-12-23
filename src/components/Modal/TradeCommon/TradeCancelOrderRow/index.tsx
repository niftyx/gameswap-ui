import { assetDataUtils } from "@0x/order-utils";
import { Button, Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { getTokenFromAddress } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import React from "react";
import { formatBigNumber } from "utils";
import { getLogger } from "utils/logger";
import { xBigNumberToEthersBigNumber } from "utils/token";
import { ISignedOrder } from "utils/types";

const logger = getLogger("TradeCancelOrderRow");

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "& + &": {
      marginTop: theme.spacing(1),
    },
  },
  info: {
    color: theme.colors.text.default,
  },
  btn: {
    height: theme.spacing(5),
  },
}));

interface IProps {
  order: ISignedOrder;
  onCancel: () => void;
}

export const TradeCancelOrderRow = (props: IProps) => {
  const classes = useStyles();
  const {
    onCancel,
    order: { takerAssetAmount, takerAssetData },
  } = props;
  const takerInfo = assetDataUtils.decodeAssetDataOrThrow(takerAssetData);
  const { networkId } = useConnectedWeb3Context();

  const token = getTokenFromAddress(
    networkId || 1,
    (takerInfo as any).tokenAddress
  );

  return (
    <div className={classes.root}>
      <Typography className={classes.info} component="span">
        {formatBigNumber(
          xBigNumberToEthersBigNumber(takerAssetAmount),
          token.decimals
        )}
        &nbsp;
        {token.symbol}
      </Typography>
      <Button
        className={classes.btn}
        color="primary"
        onClick={onCancel}
        variant="contained"
      >
        Cancel Order
      </Button>
    </div>
  );
};
