import { Grid, Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { AssetsContainer, InventoryAssetItem, SimpleLoader } from "components";
import { useConnectedWeb3Context } from "contexts";
import { useInventoryAssets } from "helpers";
import { transparentize } from "polished";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import useCommonStyles from "styles/common";
import { EProfileTab } from "utils/enums";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
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
  tab: EProfileTab;
}

export const AssetsSection = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { account } = useConnectedWeb3Context();
  const {
    assets: inventoryAssets,
    hasMore: hasMoreInventoryItems,
    loadMore: loadMoreInventoryItems,
    loading: inventoryLoading,
  } = useInventoryAssets({
    id: account || "",
  });
  const history = useHistory();

  return (
    <div className={clsx(classes.root, props.className)}>
      <div>
        <AssetsContainer>
          {inventoryAssets.map((asset) => (
            <InventoryAssetItem
              data={asset}
              isFullWidth
              key={asset.id}
              onMore={() => history.push(`/assets/${asset.id}`)}
            />
          ))}
        </AssetsContainer>
      </div>
      {inventoryLoading && <SimpleLoader />}
    </div>
  );
};
