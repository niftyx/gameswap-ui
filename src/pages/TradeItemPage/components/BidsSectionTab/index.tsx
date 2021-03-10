import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { BidAvatarRowItem, HorizonDivider } from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getTokenFromAddress } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import React from "react";
import { formatBigNumber } from "utils";
import { xBigNumberToEthersBigNumber } from "utils/token";
import { IAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    marginTop: 16,
  },
}));

interface IProps {
  className?: string;
  data: IAssetItem;
}

export const BidsSectionTab = (props: IProps) => {
  const classes = useStyles();

  const { networkId } = useConnectedWeb3Context();
  const { data } = props;

  if (!data.orders) return null;

  return (
    <div className={clsx(classes.root, props.className)}>
      {data.orders.map((order, index) => {
        const token = getTokenFromAddress(
          networkId || DEFAULT_NETWORK_ID,
          order.erc20Address
        );
        return (
          <div key={index}>
            <BidAvatarRowItem
              // address={order.takerAddress}
              address={order.erc20Address}
              comment1="by"
              tokenPrice={`${formatBigNumber(
                xBigNumberToEthersBigNumber(order.takerAssetAmount),
                token.decimals,
                3
              )} ${token.symbol}`}
            />
            {data.orders && index < data.orders.length - 1 && (
              <HorizonDivider />
            )}
          </div>
        );
      })}
    </div>
  );
};
