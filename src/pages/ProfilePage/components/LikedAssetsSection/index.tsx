/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { AssetsContainer, InventoryAssetItem, SimpleLoader } from "components";
import { useConnectedWeb3Context } from "contexts";
import { useInventoryAssets } from "helpers";
import { transparentize } from "polished";
import React from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    paddingBottom: 40,
  },
  comment: {
    fontSize: theme.spacing(1.6125),
    marginTop: theme.spacing(2),
    color: transparentize(0.4, theme.colors.text.default),
  },
  value: {
    fontSize: theme.spacing(6),
    color: theme.colors.text.default,
  },
}));

interface IProps {
  className?: string;
  userId: string;
}

export const LikedAssetsSection = (props: IProps) => {
  const classes = useStyles();
  const history = useHistory();
  const { userId } = props;

  const {
    assets: inventoryAssets,
    hasMore: hasMoreInventoryItems,
    loadMore: loadMoreInventoryItems,
    loading: inventoryLoading,
  } = useInventoryAssets({
    id: userId || "",
  });

  return (
    <div className={clsx(classes.root, props.className)}>
      <div>
        <AssetsContainer>
          {inventoryAssets.map((asset) => (
            <InventoryAssetItem
              data={asset}
              isFullWidth
              key={asset.id}
              onClick={() => history.push(`/assets/${asset.id}`)}
            />
          ))}
        </AssetsContainer>
      </div>
      {inventoryLoading && <SimpleLoader />}
    </div>
  );
};
