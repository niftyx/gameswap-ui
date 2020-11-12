import { Grid, Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import React from "react";
import { formatBigNumber, numberWithCommas } from "utils";
import { IAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1.5),
    width: 204,
    height: 195,
  },
  content: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
}));

interface IProps {
  data: IAssetItem;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const AssetItem = (props: IProps) => {
  const classes = useStyles();
  const { data, onClick } = props;
  return (
    <Grid
      className={clsx(classes.root, props.className)}
      container
      item
      lg={3}
      md={4}
      xs={6}
    >
      <div onClick={onClick}>
        <div className={classes.content}>
          <img alt="asset_img" src={data.image} />
          <Grid container justify="space-between">
            <Grid item>
              <Typography>${numberWithCommas(data.usdPrice)}</Typography>
            </Grid>
            <Grid item>
              <Typography>${formatBigNumber(data.gswapPrice, 2)}</Typography>
            </Grid>
          </Grid>
        </div>
      </div>
    </Grid>
  );
};

export default AssetItem;
