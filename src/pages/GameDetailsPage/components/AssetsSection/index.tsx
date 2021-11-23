import { CircularProgress, Typography, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import clsx from "clsx";
import { AssetsContainer, GameDetailsAssetItem } from "components";
import { useAssetsFromGameId } from "helpers";
import React from "react";
import { NavLink } from "react-router-dom";
import useCommonStyles from "styles/common";

const useStyles = makeStyles((theme) => ({
  root: {},
  loadWrapper: {
    width: "100%",
    height: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  create: {
    display: "inline-flex",
    height: 32,
    minWidth: 150,
    textDecoration: "none",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 16px",
    backgroundColor: theme.colors.purple60,
    color: theme.colors.white,
    borderRadius: 4,
    transition: "all 0.4s",
    fontSize: 13,
    "&:hover": {
      backgroundColor: theme.colors.purple40,
    },
  },
  noWrapper: {
    width: "100%",
    border: `1px solid ${theme.colors.primary85}`,
    textAlign: "center",
    padding: 40,
    borderRadius: 4,
    "& > *+*": {
      marginTop: 8,
    },
  },
  noIcon: {},
  noTitle: { color: theme.colors.primary40, fontSize: 14 },
  noDescription: { color: theme.colors.primary70, fontSize: 13 },
}));

interface IProps {
  className?: string;
  gameId: string;
}

export const AssetsSection = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { gameId } = props;
  const { assets, loading } = useAssetsFromGameId(gameId);

  return (
    <div className={clsx(classes.root, props.className)}>
      {loading && (
        <div className={classes.loadWrapper}>
          <CircularProgress color="primary" size={40} />
        </div>
      )}
      {assets.length > 0 && !loading && (
        <AssetsContainer>
          {assets.map((asset) => (
            <GameDetailsAssetItem data={asset} key={asset.id} />
          ))}
        </AssetsContainer>
      )}
      {!loading && assets.length === 0 && (
        <div className={classes.noWrapper}>
          <img
            alt="icon"
            className={classes.noIcon}
            src="/svgs/icons/skull.svg"
          />
          <Typography className={classes.noTitle}>No Assets</Typography>
          <Typography className={classes.noDescription}>
            Looks like there are no assets for this game
          </Typography>
          <NavLink className={clsx(classes.create)} to="/create/erc721">
            <AddIcon />
            &nbsp; Create Asset
          </NavLink>
        </div>
      )}
    </div>
  );
};
