import { Grid, Typography, makeStyles } from "@material-ui/core";
import { ReactComponent as GswapIcon } from "assets/svgs/gameswap_token.svg";
import clsx from "classnames";
import React from "react";
import { formatBigNumber, numberWithCommas } from "utils";
import { IAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {},
  contentContainer: {
    width: "100%",
    paddingTop: "95%",
    position: "relative",
  },
  content: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute",
    backgroundColor: theme.colors.background.sixth,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: theme.spacing(1),
  },
  img: {
    height: "80%",
  },
  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  usd: {
    color: theme.colors.text.default,
    fontSize: 17,
    lineHeight: "23px",
  },
  gswap: {
    display: "flex",
    alignItems: "center",
    color: theme.colors.text.secondary,
  },
  gswapValue: {
    fontSize: 15,
    lineHeight: "20px",
  },
}));

interface IProps {
  data: IAssetItem;
  className?: string;
  isFullWidth?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const AssetItem = (props: IProps) => {
  const classes = useStyles();
  const { data, isFullWidth = false, onClick } = props;

  const respnsive = isFullWidth
    ? { xl: 2, lg: 3, md: 3, xs: 6 }
    : { xl: 3, lg: 4, md: 4, xs: 6 };

  return (
    <Grid
      className={clsx(classes.root, props.className)}
      item
      {...(respnsive as any)}
    >
      <div className={classes.contentContainer} onClick={onClick}>
        <div className={classes.content}>
          <img alt="asset_img" className={classes.img} src={data.image} />
          <div className={classes.bottom}>
            <Typography className={classes.usd} component="div">
              ${numberWithCommas(data.usdPrice)}
            </Typography>
            <div className={classes.gswap}>
              <GswapIcon />
              <Typography className={classes.gswapValue} component="div">
                {formatBigNumber(data.gswapPrice, 2)}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </Grid>
  );
};

export default AssetItem;
