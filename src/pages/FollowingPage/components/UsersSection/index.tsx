import { Grid, makeStyles } from "@material-ui/core";
import React from "react";

import { UserItem } from "..";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export const UsersSection = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <Grid item key={`${index}`} md={4} sm={6} xs={12}>
            <UserItem verified={index % 2 === 0} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
