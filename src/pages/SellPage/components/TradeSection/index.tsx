import { Button, Grid, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { Swap_Mock_Assets } from "config/mockData";
import React from "react";

import { TradeItemAsset } from "../TradeItemAsset";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {},
}));

interface IProps {
  className?: string;
}

export const TradeSection = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, props.className)}>
      <Grid container spacing={3}>
        {Swap_Mock_Assets.map((item) => (
          <Grid item key={item.id} md={2} sm={3} xs={6}>
            <TradeItemAsset data={item} selected={false} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
