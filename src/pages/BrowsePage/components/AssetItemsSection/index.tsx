import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { AssetItem, AssetsContainer, BrowseToolbar } from "components";
import { MOCK_ASSET_ITEMS } from "config/constants";
import React, { useState } from "react";
import { IAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {},
  assets: {
    marginTop: theme.spacing(2),
  },
}));

interface IProps {
  className?: string;
}

interface IState {
  assets: IAssetItem[];
}

const AssetItemsSection = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ assets: MOCK_ASSET_ITEMS });

  return (
    <div className={clsx(classes.root, props.className)}>
      <BrowseToolbar />
      <div className={classes.assets}>
        <AssetsContainer>
          {state.assets.map((asset) => (
            <AssetItem data={asset} isFullWidth key={asset.id} />
          ))}
        </AssetsContainer>
      </div>
    </div>
  );
};

export default AssetItemsSection;
