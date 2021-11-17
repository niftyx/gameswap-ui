import { Typography, makeStyles } from "@material-ui/core";
import { TokenAmountInput } from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
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
    backgroundColor: theme.colors.primary85,
    borderRadius: 8,
    padding: 16,
  },
  title: {
    fontSize: 14,
    color: theme.colors.white,
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
      token: getToken(networkId || DEFAULT_NETWORK_ID, "gswap"),
    },
  });

  return (
    <div className={classes.root}>
      <Typography className={classes.title}>Swap with:</Typography>
      <TokenAmountInput
        onChange={(amount) => {
          setState((prev) => ({ ...prev, tokenAmount: amount }));
        }}
        value={state.tokenAmount}
      />
    </div>
  );
};
