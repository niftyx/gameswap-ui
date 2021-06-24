import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { AssetLargeViewer } from "components";
import React from "react";
import { IAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    paddingTop: "51%",
    backgroundColor: theme.colors.background.sixth,
  },
  content: {
    position: "absolute",
    left: theme.spacing(3),
    right: theme.spacing(3),
    bottom: theme.spacing(3),
    top: theme.spacing(3),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url(/svgs/backgrounds/grid.svg)",
  },
  img: {
    width: "80%",
    height: "80%",
  },
}));

interface IProps {
  className?: string;
  data: IAssetItem;
}

export const ItemViewSection = (props: IProps) => {
  const classes = useStyles();
  const { data } = props;
  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        <AssetLargeViewer
          className={classes.img}
          model={data.model || ""}
          preview={false}
          type={data.imageType}
          uri={data.image}
        />
      </div>
    </div>
  );
};
