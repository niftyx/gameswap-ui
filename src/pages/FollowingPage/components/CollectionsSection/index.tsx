import { Grid, makeStyles } from "@material-ui/core";
import React from "react";

import { CollectionItem } from "../CollectionItem";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export const CollectionsSection = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
          <Grid item key={`${index}`} lg={2} md={4} sm={6} xs={12}>
            <CollectionItem />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
