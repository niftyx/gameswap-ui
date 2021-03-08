import {
  Button,
  CircularProgress,
  Typography,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import { BasicModal } from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { useConnectedWeb3Context, useGlobal, useTrade } from "contexts";
import { useAssetHistoryFromId } from "helpers";
import { transparentize } from "polished";
import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getAPIService } from "services/api";
import useCommonStyles from "styles/common";
import { EAssetDetailTab } from "utils/enums";
import { capitalizeStr, getAssetObjectWithPrices } from "utils/tools";
import { IAssetItem } from "utils/types";

import { BidsSectionTab } from "../BidsSectionTab";
import { BuySection } from "../BuySection";
import { DetailsSectionTab } from "../DetailsSectionTab";
import { HeaderSection } from "../HeaderSection";
import { InfoSectionTab } from "../InfoSectionTab";
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
    padding: "0 16px",
  },

  goLabel: {
    marginTop: 16,
    fontSize: theme.spacing(2.5),
    color: theme.colors.text.default,
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
    boxShadow: "rgb(18 18 18 / 90%) 0px 14px 40px",
    transition: "opacity 0.18s ease-in-out 0s",
    "&.visible": { backdropFilter: "blur(20px)" },
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

  const assetDataWithPriceInfo = getAssetObjectWithPrices(
    data,
    data.orders || [],
    price,
    networkId || DEFAULT_NETWORK_ID
  );
  const isInSale = (data.orders || []).length > 0;
  const isMine = data.owner?.toLowerCase() === account?.toLowerCase();
  const { openBuyModal } = useTrade();
  const onBuy = () => {
    if (!account) {
      setWalletConnectModalOpened(true);
      return;
    }
    if (data && isInSale) {
      openBuyModal({
        ...data,
        ...assetDataWithPriceInfo.asset,
        orders: data.orders,
      });
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
          state.scroll > 5 ? "visible" : ""
        )}
        data={data}
      />
      <div className={clsx(classes.mainContent)}>
        {/* <HeaderSection className={classes.header} data={data} /> */}

        <Typography className={classes.goLabel} component="div">
          1... 2... 3... Go
        </Typography>

        <TabSection />

        {(!tabName || tabName === EAssetDetailTab.Info) && (
          <InfoSectionTab
            creator={
              historyData.history.length > 0
                ? historyData.history[historyData.history.length - 1].to || ""
                : ""
            }
            data={data}
          />
        )}
        {tabName === EAssetDetailTab.Owners && (
          <TradeHistory tradeHistoryData={historyData} />
        )}
        {tabName === EAssetDetailTab.History && <PriceHistory />}
        {tabName === EAssetDetailTab.Details && (
          <DetailsSectionTab data={data} />
        )}
        {tabName === EAssetDetailTab.Bids && <BidsSectionTab data={data} />}
      </div>

      {isInSale && !isMine && <BuySection data={data} onBuy={onBuy} />}
      {isMine && data.lockedData && (
        <Button
          className={classes.buyNow}
          color="secondary"
          disabled={state.unlocking}
          fullWidth
          onClick={onUnlockData}
          variant="contained"
        >
          {state.unlocking && <CircularProgress color="primary" size={24} />}
          {state.unlocking ? "Unlocking content ..." : "Unlock content"}
        </Button>
      )}
    </div>
  );
};