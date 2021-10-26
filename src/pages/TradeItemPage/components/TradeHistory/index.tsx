import { CircularProgress, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { OwnerAvatarRowItem } from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getToken, getTokenFromAddress } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import moment from "moment";
import React from "react";
import { formatBigNumber, formatToShortNumber } from "utils";
import { EHistoryItemType } from "utils/enums";
import { ZERO_NUMBER } from "utils/number";
import { IHistoryItem, IToken } from "utils/types";

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
    color: theme.colors.white,
    "& > * + *": {
      marginLeft: 8,
    },
  },
  ownerItem: {
    borderBottom: `1px solid ${theme.colors.white}`,
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
        historyItems.map((item) => {
          let roleStr = "";
          let token: IToken;
          switch (item.type) {
            case EHistoryItemType.Created:
              roleStr = `Minted ${moment(item.timestamp * 1000).fromNow()}`;
              break;
            case EHistoryItemType.Transfer:
              roleStr = `Transferred ${moment(
                item.timestamp * 1000
              ).fromNow()}`;
              break;
            case EHistoryItemType.Sale:
              token = item.price
                ? getTokenFromAddress(
                    networkId || DEFAULT_NETWORK_ID,
                    item.price.tokenAddress
                  )
                : getToken(networkId || DEFAULT_NETWORK_ID, "wavax");
              roleStr = `Bought for ${formatToShortNumber(
                formatBigNumber(
                  item.price?.amount || ZERO_NUMBER,
                  token.decimals
                )
              )} ${token.symbol} ${moment(item.timestamp * 1000).fromNow()}`;
              break;
            default:
              break;
          }
          return (
            <OwnerAvatarRowItem
              address={item.to}
              className={classes.ownerItem}
              href={item.to ? `/users/${item.to}` : undefined}
              key={item.timestamp}
              roleName={roleStr}
            />
          );
        })
      )}
    </div>
  );
};
