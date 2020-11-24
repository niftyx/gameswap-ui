import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { AssetItem, AssetsContainer, BrowseToolbar } from "components";
import { MOCK_ASSET_ITEMS } from "config/constants";
import React, { useState } from "react";
import { IAssetItem } from "utils/types";

import AuctionItemsSection from "../AuctionItemsSection";

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
  isAuctionActive: boolean;
}

const AssetItemsSection = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({
    assets: MOCK_ASSET_ITEMS,
    isAuctionActive: false,
  });

  const onAuction = () => {
    setState((prevState) => ({
      ...prevState,
      isAuctionActive: !prevState.isAuctionActive,
    }));
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <BrowseToolbar
        isAuctionActive={state.isAuctionActive}
        onAuction={onAuction}
      />
      <div className={classes.assets}>
        {state.isAuctionActive ? (
          <AuctionItemsSection />
        ) : (
          <AssetsContainer>
            {state.assets.map((asset) => (
              <AssetItem data={asset} isFullWidth key={asset.id} />
            ))}
          </AssetsContainer>
        )}
      </div>
    </div>
  );
};

export default AssetItemsSection;
