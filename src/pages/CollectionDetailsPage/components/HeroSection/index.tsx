import {
  Avatar,
  CircularProgress,
  Typography,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getEtherscanUri } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { useCollectionDetails } from "helpers";
import { transparentize } from "polished";
import React, { useState } from "react";
import { shortenAddress, waitSeconds } from "utils";

const AVATAR_SIZE = 60;

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  fakeImage: {
    opacity: 0,
    position: "absolute",
    left: 0,
    top: 0,
    width: 100,
    height: 100,
  },
  imgItem: {
    height: "35vh",
    backgroundPositionY: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPositionX: "center",
    backgroundColor: theme.colors.background.fourth,
    opacity: 0,
    transition: "all 0.5s",
    position: "relative",
    "&:before": {
      content: `" "`,
      backgroundImage: theme.colors.background.gradient1,
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    "&.visible": {
      opacity: 0.5,
    },
  },
  mainContent: {
    position: "absolute",
    left: theme.spacing(3),
    right: theme.spacing(3),
    bottom: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    opacity: 0,
    transition: "all 0.5s",
    "&.visible": {
      opacity: 1,
    },
  },
  comment: { color: theme.colors.text.default, fontSize: 13 },
  title: {
    color: theme.colors.text.default,
    fontSize: 90,
    fontWeight: "bold",
    letterSpacing: "-5px",
  },
  address: {
    color: theme.colors.text.default,
    marginLeft: 8,
    textDecoration: "none",
  },
  row: {
    display: "flex",
    width: "100%",
    alignItems: "center",
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    marginRight: theme.spacing(3),
    borderRadius: "50%",
    overflow: "hidden",
    border: `1px solid ${transparentize(0.8, theme.colors.text.default)}`,
  },
  loadWrapper: {
    position: "absolute",
    left: 24,
    right: 24,
    top: 24,
    bottom: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

interface IProps {
  className?: string;
  collectionId: string;
}

interface IState {
  imageLoaded: boolean;
}

export const HeroSection = (props: IProps) => {
  const classes = useStyles();
  const context = useConnectedWeb3Context();
  const { networkId } = context;
  const { collectionId } = props;
  const [state, setState] = useState<IState>({ imageLoaded: false });
  const etherscan = getEtherscanUri(networkId || DEFAULT_NETWORK_ID);
  const { collection, loading: collectionLoading } = useCollectionDetails(
    collectionId
  );
  const setImageLoaded = (imageLoaded: boolean) =>
    setState((prev) => ({ ...prev, imageLoaded }));

  const headerImage = "";
  const dataVisible = state.imageLoaded || !headerImage;

  return (
    <div className={clsx(classes.root, props.className)}>
      {(!dataVisible || collectionLoading) && (
        <div className={classes.loadWrapper}>
          <CircularProgress size={40} />
        </div>
      )}
      {collection && (
        <>
          {headerImage && (
            <img
              alt="fake"
              className={classes.fakeImage}
              onLoad={async () => {
                await waitSeconds(1);
                setImageLoaded(true);
              }}
              src={headerImage}
            />
          )}
          <div
            className={clsx(classes.imgItem, dataVisible ? "visible" : "")}
            style={{
              backgroundImage: state.imageLoaded ? `url(${headerImage})` : "",
            }}
          />
          <div
            className={clsx(classes.mainContent, dataVisible ? "visible" : "")}
          >
            <Typography className={classes.comment} component="div">
              COLLECTION
            </Typography>
            <Typography className={classes.title} component="div">
              {collection.name}
            </Typography>
            <div className={classes.row}>
              <Avatar className={classes.avatar} src={collection.imageUrl} />

              <a
                className={classes.address}
                href={`${etherscan}tokens/${collection.id}/inventory`}
                rel="noreferrer"
                target="_blank"
              >
                {shortenAddress(collection.id)}
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
