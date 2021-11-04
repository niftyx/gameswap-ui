import { Button, makeStyles } from "@material-ui/core";
import CropFreeIcon from "@material-ui/icons/CropFree";
import { ReactComponent as CubeOutlineIcon } from "assets/svgs/cube-outline.svg";
import { ReactComponent as GalleryIcon } from "assets/svgs/gallery.svg";
import { ReactComponent as PictureIcon } from "assets/svgs/picture-in-picture-exit-fill.svg";
import clsx from "clsx";
import { AssetLargeViewer } from "components";
import React from "react";
import { IAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    borderRadius: 8,
    paddingTop: "51%",
    backgroundColor: theme.colors.primary85,
  },
  content: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url(/svgs/backgrounds/grid.svg)",
  },
  img: {
    width: "100%",
    flex: 1,
    margin: 24,
  },
  controlBar: {
    backgroundColor: theme.colors.primary90,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 12,
    position: "relative",
  },
  button: {
    height: 40,
    backgroundColor: theme.colors.transparent,
    border: `1px solid ${theme.colors.primary85}`,
    "& span": { color: theme.colors.primary60 },
    "&.active": {
      backgroundColor: theme.colors.primary40,
      borderColor: theme.colors.primary40,
      "& span": { color: theme.colors.white },
    },
    "&+&": { marginLeft: 16 },
  },
  fullScreenIcon: {
    position: "absolute",
    right: 16,
    color: theme.colors.primary40,
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
        <div className={classes.controlBar}>
          <Button
            className={clsx(classes.button, "active")}
            color="primary"
            variant="contained"
          >
            <CubeOutlineIcon />
            &nbsp; 3D View
          </Button>
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
          >
            <PictureIcon />
            &nbsp; Inspect In-Game
          </Button>
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
          >
            <GalleryIcon />
            &nbsp; Screenshots
          </Button>
          <CropFreeIcon className={classes.fullScreenIcon} />
        </div>
      </div>
    </div>
  );
};
