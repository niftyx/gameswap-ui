import { Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { AssetItem, AssetsContainer, TrendingToolbar } from "components";
import { MOCK_ASSET_ITEMS } from "config/constants";
import React, { useState } from "react";
import { IAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {},
  assets: {
    marginTop: theme.spacing(2),
  },
  header: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: theme.spacing(3),
    },
  },
  title: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(2),
  },
  toolbar: {
    flex: 1,
  },
}));

interface IProps {
  className?: string;
}
interface IState {
  assets: IAssetItem[];
}

export const TrendingItems = (props: IProps) => {
  const classes = useStyles();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, setState] = useState<IState>({ assets: MOCK_ASSET_ITEMS });

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.header}>
        <Typography className={classes.title} component="div">
          TRENDING GAMES
        </Typography>
        <TrendingToolbar className={classes.toolbar} />
      </div>

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
