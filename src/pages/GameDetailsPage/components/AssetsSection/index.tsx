import { CircularProgress, makeStyles } from "@material-ui/core";
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
    height: theme.spacing(4.5),
    minWidth: 180,
    textDecoration: "none",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 16px",
  },
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
        <NavLink
          className={clsx(classes.create, commonClasses.transparentButton)}
          to="/create/erc721"
        >
          Create Asset
        </NavLink>
      )}
    </div>
  );
};
