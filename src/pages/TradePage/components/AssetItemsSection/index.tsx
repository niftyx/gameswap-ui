import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { AssetItem, AssetsContainer, AssetsToolbar } from "components";
import { MOCK_ASSET_ITEMS } from "config/constants";
import { useGlobal } from "contexts";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
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
  const {
    data: { itemCartIds },
    isInItemCart,
    toggleItemCart,
  } = useGlobal();
  const history = useHistory();
  const [state, setState] = useState<IState>({ assets: MOCK_ASSET_ITEMS });

  const selectedItems: IAssetItem[] = state.assets.filter((item) =>
    isInItemCart(item.id)
  );
  let totalPrice = 0;
  selectedItems.forEach((element: IAssetItem) => {
    totalPrice = totalPrice + element.usdPrice;
  });

  const renderCartContent = () => {
    return <div>Cart</div>;
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <AssetsToolbar
        cartItemCount={itemCartIds.length}
        renderCartContent={renderCartContent}
        totalPrice={totalPrice}
      />
      <div className={classes.assets}>
        <AssetsContainer>
          {state.assets.map((asset) => (
            <AssetItem
              data={asset}
              isOnCart={isInItemCart(asset.id) as any}
              key={asset.id}
              onClick={() => history.push(`/trade/${asset.id}`)}
              onToggleCart={() => toggleItemCart(asset.id)}
            />
          ))}
        </AssetsContainer>
      </div>
    </div>
  );
};

export default AssetItemsSection;
