import {
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
import { getEtherscanUri } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import moment from "moment";
import React from "react";
import { shortenAddress } from "utils";
import { EHistoryItemType } from "utils/enums";
import { ZERO_ADDRESS } from "utils/token";
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
}

const historyItems: IHistoryItem[] = [
  {
    id: "bhjskfowieryiower",
    timestamp: 1609978672,
    from: ZERO_ADDRESS,
    to: "0x18B13ef88822292E59bfF80210D815F7FBFC9b32",
    type: EHistoryItemType.Created,
    txHash:
      "0x5979fb266e91ef21ab41b7ad6c28ad63959f33a0c1073a0f99612e62661fb952",
  },
];

export const TradeHistory = (props: IProps) => {
  const classes = useStyles();
  const { networkId } = useConnectedWeb3Context();

  return (
    <div className={clsx(classes.root, props.className)}>
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
              <TableCell>Price</TableCell>
              <TableCell>{shortenAddress(item.from)}</TableCell>
              <TableCell>{item.to && shortenAddress(item.to)}</TableCell>
              <TableCell>
                {item.txHash ? (
                  <a
                    className={classes.hashA}
                    href={`${getEtherscanUri(networkId || 1)}tx/${item.txHash}`}
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
    </div>
  );
};
