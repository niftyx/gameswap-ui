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
import { getEtherscanUri, getTokenFromAddress } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { ethers } from "ethers";
import moment from "moment";
import React from "react";
import { formatBigNumber, shortenAddress } from "utils";
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
  {
    id: "ergergegegeg",
    timestamp: 1609988672,
    from: "0x18B13ef88822292E59bfF80210D815F7FBFC9b32",
    type: EHistoryItemType.List,
    price: {
      tokenAddress: "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
      amount: ethers.utils.parseEther("1"),
    },
  },
  {
    id: "guw289234",
    timestamp: 1609998672,
    from: "0x18B13ef88822292E59bfF80210D815F7FBFC9b32",
    to: "0x4Da57b905aF6ADB0AC7cAC18fb6758F95c3709F3",
    type: EHistoryItemType.Sale,
    price: {
      tokenAddress: "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
      amount: ethers.utils.parseEther("1"),
    },
    txHash:
      "0x5979fb266e91ef21ab41b7ad6c28ad63959f33a0c1073a0f99612e62661fb952",
  },
  {
    id: "v82hy4jiotwr",
    timestamp: 1610088672,
    from: "0x4Da57b905aF6ADB0AC7cAC18fb6758F95c3709F3",
    type: EHistoryItemType.List,
    price: {
      tokenAddress: "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
      amount: ethers.utils.parseEther("2"),
    },
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
          {historyItems.reverse().map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <TradingHistoryItemTypeTag type={item.type} />
              </TableCell>
              <TableCell>
                {item.price
                  ? `${formatBigNumber(
                      item.price.amount,
                      getTokenFromAddress(
                        networkId || 1,
                        item.price.tokenAddress
                      ).decimals
                    )} ${
                      getTokenFromAddress(
                        networkId || 1,
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
