import { Typography, makeStyles } from "@material-ui/core";
import { TokenAmountInput } from "components";
import { getToken } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import React, { useState } from "react";
import { ZERO_NUMBER } from "utils/number";
import { ITokenAmount } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "90%",
    margin: "auto",
    maxWidth: 320,
    marginTop: 40,
  },
  box: {
    backgroundColor: theme.colors.primary85,
    borderRadius: 8,
    padding: 16,
  },
  title: {
    fontSize: 14,
    color: theme.colors.white,
    marginBottom: 16,
  },
  balance: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  balanceLabel: {
    color: theme.colors.primary60,
    fontSize: 12,
    "& span": {
      color: theme.colors.primary70,
    },
  },
  fee: {
    fontSize: 11,
    color: theme.colors.primary60,
    marginTop: 12,
    "& span": { color: theme.colors.primary70 },
  },
}));

interface IState {
  tokenAmount: ITokenAmount;
}

export const TokenSection = () => {
  const classes = useStyles();
  const { networkId } = useConnectedWeb3Context();
  const [state, setState] = useState<IState>({
    tokenAmount: {
      amount: ZERO_NUMBER,
      token: getToken("gswap", networkId),
    },
  });

  return (
    <div className={classes.root}>
      <div className={classes.box}>
        <Typography className={classes.title}>Swap with:</Typography>
        <TokenAmountInput
          onChange={(amount) => {
            setState((prev) => ({ ...prev, tokenAmount: amount }));
          }}
          value={state.tokenAmount}
        />
        <div className={classes.balance}>
          <Typography className={classes.balanceLabel}>~$ 350</Typography>
          <Typography className={classes.balanceLabel}>
            <span>Your balance:</span> 175,550.90
          </Typography>
        </div>
      </div>
      <Typography align="center" className={classes.fee}>
        <span>Service fee</span> 5% - 16 GSWAP ($17.5)
      </Typography>
    </div>
  );
};
