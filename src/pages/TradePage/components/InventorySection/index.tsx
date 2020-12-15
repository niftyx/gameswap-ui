import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import {
  AssetsContainer,
  InventoryAssetItem,
  InventoryToolbar,
  Loader,
  NoWallet,
} from "components";
import { MOCK_ASSET_ITEMS } from "config/constants";
import { useConnectedWeb3Context } from "contexts";
import React, { useState } from "react";
import { IGraphInventoryAsset } from "types";
import { IAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {},
  assets: {
    marginTop: theme.spacing(2),
  },
  noWallet: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

interface IProps {
  className?: string;
  onScrollEnd?: () => void;
  loading?: boolean;
  assets: IGraphInventoryAsset[];
}

interface IState {
  selectedId: string;
}

const InventorySection = (props: IProps) => {
  const classes = useStyles();
  const { loading = false, onScrollEnd = () => {}, assets } = props;
  const [state, setState] = useState<IState>({ selectedId: "" });
  const { account } = useConnectedWeb3Context();
  const isConnected = !!account;

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight;
    if (bottom) {
      onScrollEnd();
    }
  };

  return (
    <div
      className={clsx(classes.root, props.className)}
      onScroll={handleScroll}
    >
      {isConnected ? (
        <>
          <InventoryToolbar />
          <div className={classes.assets}>
            <AssetsContainer>
              {assets.map((asset) => (
                <InventoryAssetItem data={asset} key={asset.id} />
              ))}
            </AssetsContainer>
          </div>
          {loading && <Loader />}
        </>
      ) : (
        <div className={classes.noWallet}>
          <NoWallet />
        </div>
      )}
    </div>
  );
};

export default InventorySection;
