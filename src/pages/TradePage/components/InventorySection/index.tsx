import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import {
  AssetsContainer,
  InventoryAssetItem,
  InventoryToolbar,
  NoWallet,
  ScrollContainer,
  SimpleLoader,
} from "components";
import { useConnectedWeb3Context, useTrade } from "contexts";
import React from "react";
import { useHistory } from "react-router-dom";
import { IGraphInventoryAsset } from "types";
import { IAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {},
  assets: {
    marginTop: theme.spacing(2),
    overflowY: "auto",
    flex: 1,
    padding: "0 6px",
  },
  noWallet: {
    flex: 1,
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

const InventorySection = (props: IProps) => {
  const classes = useStyles();
  const { loading = false, onScrollEnd = () => {}, assets } = props;
  const { account } = useConnectedWeb3Context();
  const isConnected = !!account;
  const history = useHistory();
  const { openSellModal } = useTrade();

  const onSell = (asset: IAssetItem) => {
    openSellModal(asset);
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      {isConnected ? (
        <>
          <InventoryToolbar />
          <ScrollContainer
            className={clsx(classes.assets)}
            onScrollEnd={onScrollEnd}
          >
            <AssetsContainer>
              {assets.map((asset) => (
                <InventoryAssetItem
                  data={asset}
                  key={asset.id}
                  onClick={onSell}
                  onMore={() => history.push(`/assets/${asset.id}`)}
                />
              ))}
            </AssetsContainer>
            {loading && <SimpleLoader />}
          </ScrollContainer>
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
