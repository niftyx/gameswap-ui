import {
  Button,
  CircularProgress,
  Typography,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import { AssetMorePopover, AssetSharePopover, BasicModal } from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { useConnectedWeb3Context, useGlobal, useTrade } from "contexts";
import { useAssetHistoryFromId } from "helpers";
import { transparentize } from "polished";
import React, { useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { getAPIService } from "services/api";
import useCommonStyles from "styles/common";
import { EAssetDetailTab } from "utils/enums";
import { capitalizeStr, getAssetObjectWithPrices } from "utils/tools";
import { IAssetItem } from "utils/types";

import { BuySection } from "../BuySection";
import { DetailsSectionTab } from "../DetailsSectionTab";
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
    "& > * + *": {
      marginTop: theme.spacing(4),
    },
  },
  mainContent: {
    flex: 1,
    overflowY: "auto",
  },
  header: {
    display: "flex",
  },
  headerLeft: {
    flex: 1,
    marginRight: 24,
  },
  headerRight: { display: "flex", "& > * + *": { marginLeft: 8 } },
  title: {
    left: theme.spacing(2),
    top: theme.spacing(4),
    color: theme.colors.text.default,
    fontSize: theme.spacing(3.25),
  },
  gameType: {
    fontSize: theme.spacing(2.25),
    color: theme.colors.text.sixth,
  },
  priceRow: {
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
  priceUsd: {
    fontSize: theme.spacing(2.5),
    color: transparentize(0.3, theme.colors.text.default),
    maxWidth: 500,
    [theme.breakpoints.down("xs")]: {
      fontSize: theme.spacing(2),
    },
  },
  goLabel: {
    marginTop: 16,
    fontSize: theme.spacing(2.5),
    color: theme.colors.text.default,
  },
  tokenPrice: {
    fontSize: theme.spacing(2.5),
    color: theme.colors.text.default,
    [theme.breakpoints.down("xs")]: {
      fontSize: theme.spacing(2),
    },
  },
  buyNow: {
    height: theme.spacing(6),
    fontSize: theme.spacing(2.5),
    [theme.breakpoints.down("xs")]: {
      minWidth: theme.spacing(25),
      height: theme.spacing(6),
    },
  },
  description: {
    fontSize: theme.spacing(2),
    color: theme.colors.text.sixth,
    maxWidth: 500,
  },
  unlockData: {
    fontSize: theme.spacing(2),
    color: theme.colors.text.default,
    whiteSpace: "pre-line",
    userSelect: "text",
  },
}));

interface IProps {
  className?: string;
  data: IAssetItem;
}

interface IState {
  unlocking: boolean;
  decryptedContent: string;
}

export const InfoContainer = (props: IProps) => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const assetId = ((params || {}) as any).id as string;
  const commonClasses = useCommonStyles();
  const {
    data: { games, price },
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
  });
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

  const game = games.find((e) => e.id === data.gameId);

  return (
    <div className={clsx(classes.root, props.className)}>
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

      <div className={clsx(classes.mainContent, commonClasses.scroll)}>
        <div className={classes.header}>
          <div className={classes.headerLeft}>
            <Typography className={classes.title} component="div">
              {data.name}
            </Typography>
            {game && (
              <Typography className={classes.gameType} component="div">
                {game.title}
              </Typography>
            )}
            {data.description && (
              <Typography className={classes.description} component="div">
                {data.description}
              </Typography>
            )}
            {isInSale && (
              <div>
                <div className={clsx(commonClasses.row, classes.priceRow)}>
                  <Typography className={classes.tokenPrice} component="div">
                    {assetDataWithPriceInfo.minTokenAmountString}
                  </Typography>
                  <Typography className={classes.priceUsd} component="div">
                    ${assetDataWithPriceInfo.minUSDPrice} 1 of 1
                  </Typography>
                </div>
                <Typography className={classes.goLabel} component="div">
                  1... 2... 3... Go
                </Typography>
              </div>
            )}
          </div>
          <div className={classes.headerRight}>
            <AssetMorePopover />
            <AssetSharePopover />
          </div>
        </div>

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
