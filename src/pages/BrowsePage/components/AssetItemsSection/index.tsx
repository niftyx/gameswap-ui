import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import {
  AssetsContainer,
  BrowseAssetItem,
  BrowseToolbar,
  ScrollContainer,
  SimpleLoader,
} from "components";
import React, { useState } from "react";
import { IAssetDetails } from "types";
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
  onScrollEnd?: () => void;
  loading?: boolean;
  assets: IAssetDetails[];
}

interface IState {
  isAuctionActive: boolean;
}

const AssetItemsSection = (props: IProps) => {
  const classes = useStyles();

  const { assets, loading, onScrollEnd } = props;

  const [state, setState] = useState<IState>({
    isAuctionActive: false,
  });

  const onAuction = () => {
    setState((prevState) => ({
      ...prevState,
      isAuctionActive: !prevState.isAuctionActive,
    }));
  };

  console.log("-=-=-=", assets);

  return (
    <ScrollContainer
      className={clsx(classes.root, props.className)}
      onScrollEnd={onScrollEnd}
    >
      <BrowseToolbar
        isAuctionActive={state.isAuctionActive}
        onAuction={onAuction}
      />
      <div className={classes.assets}>
        {state.isAuctionActive ? (
          <AuctionItemsSection />
        ) : (
          <AssetsContainer>
            {assets.map((asset) => (
              <BrowseAssetItem data={asset} isFullWidth key={asset.id} />
            ))}
          </AssetsContainer>
        )}
      </div>
      {loading && <SimpleLoader />}
    </ScrollContainer>
  );
};

export default AssetItemsSection;
