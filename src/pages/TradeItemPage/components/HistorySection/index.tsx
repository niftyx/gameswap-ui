import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import React, { useState } from "react";

import { PriceHistory } from "../PriceHistory";
import { TradeHistory } from "../TradeHistory";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: theme.spacing(6),
    },
  },
  headerItem: {
    userSelect: "none",
    fontSize: theme.spacing(3),
    color: theme.colors.text.third,
    cursor: "pointer",
    transition: "all 0.3s",
    "&.active": {
      color: theme.colors.text.default,
    },
  },
}));

interface IProps {
  className?: string;
}

enum EHistoryMode {
  priceHistory = "Price History",
  tradeHistory = "Trade History",
}
interface IState {
  mode: EHistoryMode;
}

export const HistorySection = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({
    mode: EHistoryMode.priceHistory,
  });

  const setMode = (mode: EHistoryMode) =>
    setState((prevState) => ({ ...prevState, mode }));

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.header}>
        {Object.values(EHistoryMode).map((value) => (
          <span
            className={clsx(
              classes.headerItem,
              state.mode === value ? "active" : ""
            )}
            key={value}
            onClick={() => setMode(value)}
          >
            {value}
          </span>
        ))}
      </div>
      {state.mode === EHistoryMode.priceHistory ? (
        <PriceHistory />
      ) : (
        <TradeHistory />
      )}
    </div>
  );
};
