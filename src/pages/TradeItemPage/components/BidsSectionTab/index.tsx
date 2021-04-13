import { Button, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { BidAvatarRowItem, HorizonDivider, SimpleLoader } from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getTokenFromAddress } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { useAssetBids } from "helpers";
import moment from "moment";
import React from "react";
import useCommonStyles from "styles/common";
import { formatBigNumber } from "utils";
import {
  EthersBigNumberTo0xBigNumber,
  xBigNumberToEthersBigNumber,
} from "utils/token";
import { IAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    width: "100%",
    position: "relative",
    marginTop: 16,
    overflowY: "auto",
  },
}));

interface IProps {
  className?: string;
  data: IAssetItem;
}

export const BidsSectionTab = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const { networkId } = useConnectedWeb3Context();
  const { data } = props;
  const { bids, hasMore, loadBids, loading: ordersLoading } = useAssetBids(
    data.collectionId,
    EthersBigNumberTo0xBigNumber(data.tokenId)
  );

  return (
    <div className={clsx(classes.root, props.className)}>
      {bids.map((order, index) => {
        const token = getTokenFromAddress(
          networkId || DEFAULT_NETWORK_ID,
          order.erc20Address
        );

        const m = moment(Number(order.salt.toString()));

        return (
          <div key={index}>
            <BidAvatarRowItem
              address={order.makerAddress}
              comment1="by"
              tokenPrice={`${formatBigNumber(
                xBigNumberToEthersBigNumber(order.makerAssetAmount),
                token.decimals,
                3
              )} ${token.symbol} ${m.fromNow()}`}
            />
            {bids && index < bids.length - 1 && <HorizonDivider />}
          </div>
        );
      })}
      {!ordersLoading && hasMore && (
        <div className={commonClasses.textCenter}>
          <Button onClick={loadBids} variant="outlined">
            Load More
          </Button>
        </div>
      )}
      {ordersLoading && <SimpleLoader />}
    </div>
  );
};
