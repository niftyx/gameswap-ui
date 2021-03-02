import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
} from "@material-ui/core";
import LaunchIcon from "@material-ui/icons/Launch";
import clsx from "classnames";
import { TradingHistoryItemTypeTag } from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getEtherscanUri, getTokenFromAddress } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import moment from "moment";
import React from "react";
import { formatBigNumber, shortenAddress } from "utils";
import { ZERO_NUMBER } from "utils/number";
import { IHistoryItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  hashA: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: theme.colors.text.default,
    "& > * + *": {
      marginLeft: 8,
    },
  },
}));

interface IProps {
  className?: string;
  tradeHistoryData: {
    history: IHistoryItem[];
    loading: boolean;
  };
}

export const TradeHistory = (props: IProps) => {
  const classes = useStyles();
  const { networkId } = useConnectedWeb3Context();
  const {
    tradeHistoryData: { history: historyItems, loading },
  } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      {loading ? (
        <CircularProgress color="primary" size={40} />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Event</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historyItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <TradingHistoryItemTypeTag type={item.type} />
                </TableCell>
                <TableCell>
                  {item.price?.amount.gt(ZERO_NUMBER)
                    ? `${formatBigNumber(
                        item.price.amount,
                        getTokenFromAddress(
                          networkId || DEFAULT_NETWORK_ID,
                          item.price.tokenAddress
                        ).decimals
                      )} ${
                        getTokenFromAddress(
                          networkId || DEFAULT_NETWORK_ID,
                          item.price.tokenAddress
                        ).symbol
                      }`
                    : null}
                </TableCell>
                <TableCell>{shortenAddress(item.from)}</TableCell>
                <TableCell>{item.to && shortenAddress(item.to)}</TableCell>
                <TableCell>
                  {item.txHash ? (
                    <a
                      className={classes.hashA}
                      href={`${getEtherscanUri(
                        networkId || DEFAULT_NETWORK_ID
                      )}tx/${item.txHash}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span>{moment(item.timestamp * 1000).fromNow()}</span>
                      <LaunchIcon />
                    </a>
                  ) : (
                    moment(item.timestamp * 1000).fromNow()
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
