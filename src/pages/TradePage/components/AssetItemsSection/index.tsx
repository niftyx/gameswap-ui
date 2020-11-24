import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { AssetItem, AssetsContainer, AssetsToolbar } from "components";
import { MOCK_ASSET_ITEMS } from "config/constants";
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
  const history = useHistory();
  const [state, setState] = useState<IState>({ assets: MOCK_ASSET_ITEMS });

  return (
    <div className={clsx(classes.root, props.className)}>
      <AssetsToolbar />
      <div className={classes.assets}>
        <AssetsContainer>
          {state.assets.map((asset) => (
            <AssetItem
              data={asset}
              key={asset.id}
              onClick={() => history.push(`/trade/${asset.id}`)}
            />
          ))}
        </AssetsContainer>
      </div>
    </div>
  );
};

export default AssetItemsSection;
