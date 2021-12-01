import { Grid, makeStyles } from "@material-ui/core";
import { Swap_Mock_Assets } from "config/mockData";
import React from "react";

import { Item } from "../Item";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export const ItemsSection = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {Swap_Mock_Assets.map((item) => (
          <Grid item key={item.id} lg={2} md={4} sm={6} xs={12}>
            <Item data={item} selected={false} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
