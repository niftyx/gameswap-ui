import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import {
  BasicModal,
  PrimaryButton,
  SecondaryButton,
  SimpleLoader,
} from "components";
import { DEFAULT_NETWORK_ID, PRICE_DECIMALS } from "config/constants";
import { getTokenFromAddress } from "config/networks";
import { useConnectedWeb3Context, useGlobal, useTrade } from "contexts";
import { useAssetHistoryFromId, useAssetOrders } from "helpers";
import { transparentize } from "polished";
import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getAPIService } from "services/api";
import useCommonStyles from "styles/common";
import { formatBigNumber, numberWithCommas } from "utils";
import { getHighestBid, getLowestAsk } from "utils/bid";
import { EAssetDetailTab } from "utils/enums";
import { MAX_NUMBER } from "utils/number";
import {
  EthersBigNumberTo0xBigNumber,
  xBigNumberToEthersBigNumber,
} from "utils/token";
import { capitalizeStr } from "utils/tools";
import { IAssetItem } from "utils/types";

import { BidsSectionTab } from "../BidsSectionTab";
import { HeaderSection } from "../HeaderSection";
import { HighestBidInfo } from "../HighestBidInfo";
import { InfoSectionTab } from "../InfoSectionTab";
import { Owners } from "../Owners";
import { PriceHistory } from "../PriceHistory";
import { TabSection } from "../TabSection";
import { TradeHistory } from "../TradeHistory";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  mainContent: {
    flex: 1,
    padding: "24px",
    display: "flex",
    flexDirection: "column",
  },
  top: {
    padding: "0 24px",
    borderBottom: `1px solid ${theme.colors.border.secondary}`,
  },
  highestAskUsd: {
    color: theme.colors.text.default,
    fontSize: 50,
    fontWeight: 700,
  },
  highestAskToken: {
    fontSize: 20,
    color: theme.colors.text.sixth,
    fontWeight: 700,
    marginBottom: 20,
  },
  buyNow: {
    height: theme.spacing(6),
    fontSize: theme.spacing(2.5),
    [theme.breakpoints.down("xs")]: {
      minWidth: theme.spacing(25),
      height: theme.spacing(6),
    },
  },
  unlockData: {
    fontSize: theme.spacing(2),
    color: theme.colors.text.default,
    whiteSpace: "pre-line",
    userSelect: "text",
  },
  headerSticky: {
    position: "sticky",
    top: 0,
    backgroundColor: transparentize(0.9, theme.colors.text.secondary),
    transition: "opacity 0.18s ease-in-out 0s",
    "&.visible": { backdropFilter: "blur(20px)" },
  },
  buttons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    "& > * + *": {
      marginLeft: 24,
    },
    "& > *": {
      flex: 1,
    },
  },
}));

interface IProps {
  className?: string;
  data: IAssetItem;
}

interface IState {
  unlocking: boolean;
  decryptedContent: string;
  scroll: number;
}

export const InfoContainer = (props: IProps) => {
  const classes = useStyles();
  const location = useLocation();
  const params = useParams();
  const assetId = ((params || {}) as any).id as string;
  const commonClasses = useCommonStyles();
  const {
    data: { price },
  } = useGlobal();
  const {
    account,
    library: provider,
    networkId,
    setWalletConnectModalOpened,
  } = useConnectedWeb3Context();
  const { data } = props;
  const { asks, bids, loading: ordersLoading } = useAssetOrders(
    data.collectionId,
    EthersBigNumberTo0xBigNumber(data.tokenId)
  );
  const [state, setState] = useState<IState>({
    unlocking: false,
    decryptedContent: "",
    scroll: 0,
  });

  const setScroll = (scroll: number) =>
    setState((prev) => ({ ...prev, scroll }));

  const historyData = useAssetHistoryFromId(assetId || "");

  const query = new URLSearchParams(location.search.toLowerCase());
  const tabName = capitalizeStr(query.get("tab") || "");

  const apiService = getAPIService();

  const maxOrder = asks.find((order) =>
    xBigNumberToEthersBigNumber(order.takerAssetAmount).eq(MAX_NUMBER)
  );
  const orders = asks.filter(
    (order) =>
      !xBigNumberToEthersBigNumber(order.takerAssetAmount).eq(MAX_NUMBER)
  );
  const highestBid = getHighestBid(
    bids,
    price,
    networkId || DEFAULT_NETWORK_ID
  );

  const highestBidToken = highestBid
    ? getTokenFromAddress(
        networkId || DEFAULT_NETWORK_ID,
        highestBid.erc20Address
      )
    : null;
  const highestAsk = getLowestAsk(
    orders,
    price,
    networkId || DEFAULT_NETWORK_ID
  );
  const highestAskToken = highestAsk
    ? getTokenFromAddress(
        networkId || DEFAULT_NETWORK_ID,
        highestAsk.erc20Address
      )
    : null;

  const isInSale = !!maxOrder || orders.length > 0;
  const isMine = data.owner?.toLowerCase() === account?.toLowerCase();

  const highestAskUsd =
    highestAskToken && highestAsk
      ? `$ ${numberWithCommas(
          formatBigNumber(
            xBigNumberToEthersBigNumber(highestAsk.takerAssetAmount).mul(
              (price as any)[highestAskToken.symbol.toLowerCase()].price
            ),
            highestAskToken.decimals + PRICE_DECIMALS
          )
        )}`
      : "";

  const highAskTokenStr =
    highestAskToken && highestAsk
      ? `${numberWithCommas(
          formatBigNumber(
            xBigNumberToEthersBigNumber(highestAsk.takerAssetAmount),
            highestAskToken.decimals
          )
        )} ${highestAskToken.symbol}`
      : "";

  const {
    openAcceptBidModal,
    openBuyModal,
    openPlaceBidModal,
    openSellModal,
  } = useTrade();

  const onBuy = () => {
    if (!account) {
      setWalletConnectModalOpened(true);
      return;
    }
    if (data && isInSale && highestAskToken && highestAsk) {
      openBuyModal({
        ...data,
        prices: [
          {
            token: highestAskToken,
            amount: xBigNumberToEthersBigNumber(highestAsk.takerAssetAmount),
          },
        ],
        orders: [highestAsk],
      });
    }
  };

  const onSell = () => {
    if (!account) {
      setWalletConnectModalOpened(true);
      return;
    }
    if (data) {
      openSellModal(data);
    }
  };
  const onBid = () => {
    if (!account) {
      setWalletConnectModalOpened(true);
      return;
    }
    openPlaceBidModal({ ...data, bids, orders, maxOrder });
  };

  const onAcceptBid = () => {
    if (!account) {
      setWalletConnectModalOpened(true);
      return;
    }
    if (data && highestBid) {
      openAcceptBidModal(data, highestBid);
    }
  };

  const onCancelSell = () => {
    if (!account) {
      setWalletConnectModalOpened(true);
      return;
    }
    if (data) {
      openSellModal({ ...data, orders: asks, isInSale, maxOrder });
    }
  };

  const onUnlockData = async () => {
    if (!data.lockedData || !provider) {
      return;
    }
    setState((prev) => ({ ...prev, unlocking: true }));
    try {
      const hashedStr = await provider.getSigner().signMessage(data.lockedData);
      const decryptedStr = await apiService.getDecryptedContentData(
        data.lockedData,
        hashedStr
      );
      setState((prev) => ({
        ...prev,
        unlocking: false,
        decryptedContent: decryptedStr,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, unlocking: false }));
    }
  };

  if (ordersLoading) {
    return <SimpleLoader />;
  }

  return (
    <div
      className={clsx(classes.root, props.className, commonClasses.scroll)}
      onScroll={(e) => {
        const scroll = (e.target as HTMLDivElement).scrollTop;
        setScroll(scroll);
      }}
    >
      {state.decryptedContent && (
        <BasicModal
          onClose={() => {
            setState((prev) => ({ ...prev, decryptedContent: "" }));
          }}
          title="Unlocked Content"
          visible={!!state.decryptedContent}
        >
          <div
            className={classes.unlockData}
            dangerouslySetInnerHTML={{ __html: state.decryptedContent }}
          ></div>
        </BasicModal>
      )}
      <HeaderSection
        className={clsx(
          classes.headerSticky,
          state.scroll > 20 ? "visible" : ""
        )}
        data={data}
      />
      <div className={classes.top}>
        {highestAskUsd && highAskTokenStr ? (
          <div>
            <Typography className={classes.highestAskUsd} component="div">
              {highestAskUsd}
            </Typography>
            <Typography className={classes.highestAskToken}>
              {highAskTokenStr}
            </Typography>
          </div>
        ) : null}
        <div className={classes.buttons}>
          {isMine && !highestAsk && (
            <PrimaryButton onClick={onSell}>Sell</PrimaryButton>
          )}
          {isMine && highestAsk && (
            <PrimaryButton onClick={onCancelSell}>Cancel Sell</PrimaryButton>
          )}
          {isMine && highestBid && (
            <SecondaryButton className="accept-bid" onClick={onAcceptBid}>
              Accept bid
            </SecondaryButton>
          )}
          {!isMine && highestAsk && (
            <PrimaryButton onClick={onBuy}>Buy now</PrimaryButton>
          )}
          {!isMine && <SecondaryButton onClick={onBid}>Bid</SecondaryButton>}
        </div>
        {highestBid && highestBidToken && (
          <HighestBidInfo
            bid={highestBid}
            price={price}
            token={highestBidToken}
          />
        )}
      </div>
      <div className={clsx(classes.mainContent)}>
        <TabSection />

        {(!tabName || tabName === EAssetDetailTab.Info) && (
          <InfoSectionTab
            creator={data.creator || ""}
            data={data}
            onUnlockData={onUnlockData}
            unlocking={state.unlocking}
          />
        )}
        {tabName === EAssetDetailTab.Owners && (
          <Owners tradeHistoryData={historyData} />
        )}
        {tabName === EAssetDetailTab.Price && (
          <PriceHistory tradeHistoryData={historyData} />
        )}
        {tabName === EAssetDetailTab.TradeHistory && (
          <TradeHistory tradeHistoryData={historyData} />
        )}
        {tabName === EAssetDetailTab.Bids && <BidsSectionTab data={data} />}
      </div>
    </div>
  );
};
