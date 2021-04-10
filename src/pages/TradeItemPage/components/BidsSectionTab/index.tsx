import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { BidAvatarRowItem, HorizonDivider } from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getTokenFromAddress } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import moment from "moment";
import React from "react";
import { formatBigNumber } from "utils";
import { xBigNumberToEthersBigNumber } from "utils/token";
import { ISignedOrder } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    marginTop: 16,
  },
}));

interface IProps {
  className?: string;
  bids: ISignedOrder[];
}

export const BidsSectionTab = (props: IProps) => {
  const classes = useStyles();

  const { networkId } = useConnectedWeb3Context();
  const { bids } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      {bids.map((order, index) => {
        const token = getTokenFromAddress(
          networkId || DEFAULT_NETWORK_ID,
          order.erc20Address
        );

        const m = moment(Number(order.expirationTimeSeconds.toString()) * 1000);

        return (
          <div key={index}>
            <BidAvatarRowItem
              address={order.makerAddress}
              comment1="by"
              tokenPrice={`${formatBigNumber(
                xBigNumberToEthersBigNumber(order.makerAssetAmount),
                token.decimals,
                3
              )} ${token.symbol} (expire in ${m.fromNow()})`}
            />
            {bids && index < bids.length - 1 && <HorizonDivider />}
          </div>
        );
      })}
    </div>
  );
};
