import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import {
  AssetsContainer,
  InventoryAssetItem,
  InventoryToolbar,
  NoWallet,
  ScrollContainer,
  SimpleLoader,
} from "components";
import { useConnectedWeb3Context, useTrade } from "contexts";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
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
  const history = useHistory();
  const { openSellModal } = useTrade();

  const onSell = (asset: IAssetItem) => {
    openSellModal(asset);
  };

  return (
    <ScrollContainer
      className={clsx(classes.root, props.className)}
      onScrollEnd={onScrollEnd}
    >
      {isConnected ? (
        <>
          <InventoryToolbar />
          <div className={classes.assets}>
            <AssetsContainer>
              {assets.map((asset) => (
                <InventoryAssetItem
                  data={asset}
                  key={asset.id}
                  onClick={onSell}
                  onMore={() => history.push(`/trade/${asset.id}`)}
                />
              ))}
            </AssetsContainer>
          </div>
          {loading && <SimpleLoader />}
        </>
      ) : (
        <div className={classes.noWallet}>
          <NoWallet />
        </div>
      )}
    </ScrollContainer>
  );
};

export default InventorySection;
