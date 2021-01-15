import { Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { getContractAddress, getEtherscanUri } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { transparentize } from "polished";
import React from "react";
import { formatBigNumber, shortenAddress } from "utils";
import { ZERO_NUMBER } from "utils/number";
import { IAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    marginTop: 16,
  },
  title: {
    left: theme.spacing(2),
    top: theme.spacing(4),
    color: theme.colors.text.default,
    fontSize: theme.spacing(2.5),
  },
  itemDetailsItemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemDetailsItemRowLeft: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(2),
  },
  itemDetailsItemRowRight: {
    color: transparentize(0.3, theme.colors.text.default),
    fontSize: theme.spacing(2.5),
  },
}));

interface IProps {
  className?: string;
  data: IAssetItem;
}

export const ChainInfoSection = (props: IProps) => {
  const classes = useStyles();

  const { networkId } = useConnectedWeb3Context();
  const { data } = props;

  const etherUri = getEtherscanUri(networkId || 1);
  const erc721 = getContractAddress(networkId || 1, "erc721");

  return (
    <div className={clsx(classes.root, props.className)}>
      <div>
        <Typography className={classes.title} component="div">
          Chain Info
        </Typography>
      </div>
      <div>
        <div className={classes.itemDetailsItemRow}>
          <Typography
            className={classes.itemDetailsItemRowLeft}
            component="div"
          >
            Contract Address
          </Typography>
          <a
            className={classes.itemDetailsItemRowRight}
            href={`${etherUri}address/${erc721}`}
            rel="noreferrer"
            target="_blank"
          >
            {shortenAddress(erc721)}
          </a>
        </div>
        <div className={classes.itemDetailsItemRow}>
          <Typography
            className={classes.itemDetailsItemRowLeft}
            component="div"
          >
            TokenId
          </Typography>
          <Typography
            className={classes.itemDetailsItemRowRight}
            component="div"
          >
            {formatBigNumber(data.tokenId || ZERO_NUMBER, 0, 0)}
          </Typography>
        </div>
        <div className={classes.itemDetailsItemRow}>
          <Typography
            className={classes.itemDetailsItemRowLeft}
            component="div"
          >
            Blockchain
          </Typography>
          <Typography
            className={classes.itemDetailsItemRowRight}
            component="div"
          >
            Ethereum
          </Typography>
        </div>
      </div>
    </div>
  );
};
