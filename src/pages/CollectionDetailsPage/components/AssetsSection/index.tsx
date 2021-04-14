/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import {
  AssetsContainer,
  GameDetailsAssetItem,
  SimpleLoader,
} from "components";
import { useAssetsFromCollectionId } from "helpers";
import React from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
  },
}));

interface IProps {
  className?: string;
  collectionId: string;
}

export const AssetsSection = (props: IProps) => {
  const classes = useStyles();
  const { collectionId } = props;
  const { assets, hasMore, loadMore, loading } = useAssetsFromCollectionId(
    collectionId
  );

  const history = useHistory();

  return (
    <div className={clsx(classes.root, props.className)}>
      <div>
        <AssetsContainer>
          {assets.map((asset) => (
            <GameDetailsAssetItem data={asset} key={asset.id} />
          ))}
        </AssetsContainer>
      </div>
      {loading && <SimpleLoader />}
    </div>
  );
};
