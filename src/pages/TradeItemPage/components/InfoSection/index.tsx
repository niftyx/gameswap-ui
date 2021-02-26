import {
  Avatar,
  Button,
  CircularProgress,
  Typography,
  makeStyles,
} from "@material-ui/core";
import clsx from "classnames";
import { BasicModal } from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { useConnectedWeb3Context, useGlobal, useTrade } from "contexts";
import { transparentize } from "polished";
import React, { useState } from "react";
import { getAPIService } from "services/api";
import useCommonStyles from "styles/common";
import { getAssetObjectWithPrices } from "utils/tools";
import { IAssetAttribute, IAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    "& > * + *": {
      marginTop: theme.spacing(4),
    },
  },
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
      marginLeft: theme.spacing(3),
    },
  },
  priceUsd: {
    fontSize: theme.spacing(7.5),
    color: theme.colors.text.default,
    maxWidth: 500,
    [theme.breakpoints.down("xs")]: {
      fontSize: theme.spacing(4),
    },
  },
  priceChange: {
    borderRadius: theme.spacing(0.5),
    padding: "5px 14px",
    fontSize: theme.spacing(2.5),
    fontWeight: 500,
    [theme.breakpoints.down("xs")]: {
      fontSize: theme.spacing(1.5),
    },
    "&.positive": {
      color: theme.colors.text.positive,
      backgroundColor: transparentize(0.73, theme.colors.text.positive),
    },
    "&.negative": {
      color: theme.colors.text.negative,
      backgroundColor: transparentize(0.73, theme.colors.text.negative),
    },
  },
  gswap: {
    fontSize: theme.spacing(3),
    color: theme.colors.text.sixth,
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
  avatar: {
    width: theme.spacing(6.25),
    height: theme.spacing(6.25),
    marginRight: theme.spacing(1.5),
  },
  name: {
    fontSize: theme.spacing(3),
    color: theme.colors.text.default,
    fontWeight: "bold",
    marginRight: theme.spacing(3.5),
  },
  address: {
    fontSize: theme.spacing(2),
    color: theme.colors.text.default,
    wordBreak: "break-all",
  },
  description: {
    fontSize: theme.spacing(2),
    color: theme.colors.text.sixth,
    maxWidth: 500,
  },
  groupLabel: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(1.6125),
  },
  itemDetailsItemRow: {
    alignItems: "flex-start",
    marginTop: theme.spacing(3),
  },
  itemDetailsItemRowTitle: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(2),
    fontWeight: "bold",
    marginRight: theme.spacing(2),
  },
  itemDetailsItemRowContent: {
    flex: 1,
    color: theme.colors.text.sixth,
    fontSize: theme.spacing(2),
  },
  tags: {
    marginTop: theme.spacing(4),
  },
  tagWrapper: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: theme.spacing(2),
  },
  tag: {
    fontSize: theme.spacing(2),
    padding: "14px 26px",
    color: transparentize(0.18, theme.colors.text.default),
    backgroundColor: transparentize(0.44, theme.colors.background.ninth),
    borderRadius: theme.spacing(1),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    textTransform: "capitalize",
    [theme.breakpoints.down("xs")]: {
      padding: "10px 20px",
    },
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

export const InfoSection = (props: IProps) => {
  const classes = useStyles();
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
      <div>
        <Typography className={classes.title} component="div">
          {data.name}
        </Typography>
        {game && (
          <Typography className={classes.gameType} component="div">
            {game.title}
          </Typography>
        )}
      </div>
      {isInSale && (
        <div>
          <div className={clsx(commonClasses.row, classes.priceRow)}>
            <Typography className={classes.priceUsd} component="div">
              $ {assetDataWithPriceInfo.minUSDPrice}
            </Typography>
            {/* <Typography
            className={clsx(classes.priceChange, "positive")}
            component="div"
          >
            17.7%
          </Typography> */}
          </div>
          <Typography className={classes.gswap} component="div">
            {assetDataWithPriceInfo.minTokenAmountString}
          </Typography>
        </div>
      )}
      <div>
        {isInSale && !isMine && (
          <Button
            className={classes.buyNow}
            color="primary"
            fullWidth
            onClick={onBuy}
            variant="contained"
          >
            BUY NOW
          </Button>
        )}
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
      <div className={commonClasses.row}>
        <Avatar className={classes.avatar} src="/svgs/mock/avatar.svg" />
        <div>
          <div className={commonClasses.row}>
            <Typography className={classes.address} component="div">
              {data.owner}
            </Typography>
            {/* <ProfileMarker
              marker={EProfileMarker.ProTrader}
              showLabel={false}
            /> */}
          </div>
          {isInSale && (
            <Typography className={classes.description} component="div">
              Seller
            </Typography>
          )}
        </div>
      </div>
      <div>
        <Typography className={classes.groupLabel} component="div">
          ITEM DETAILS
        </Typography>
        {(data.attributes || []).map((attribute: IAssetAttribute, index) => (
          <div
            className={clsx(commonClasses.row, classes.itemDetailsItemRow)}
            key={index}
          >
            <Typography
              className={classes.itemDetailsItemRowTitle}
              component="div"
            >
              {attribute.key}
            </Typography>
            <Typography
              className={classes.itemDetailsItemRowContent}
              component="div"
            >
              {attribute.value}
            </Typography>
          </div>
        ))}

        <div className={clsx(commonClasses.row, classes.itemDetailsItemRow)}>
          <Typography
            className={classes.itemDetailsItemRowTitle}
            component="div"
          >
            Description
          </Typography>
          <Typography
            className={classes.itemDetailsItemRowContent}
            component="div"
          >
            {data.description}
          </Typography>
        </div>
        {/* <div className={classes.tags}>
          <Typography className={classes.groupLabel} component="div">
            TAGS
          </Typography>
          <div className={classes.tagWrapper}>
            {itemDetails.tags.map((tag) => (
              <span className={classes.tag} key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};
