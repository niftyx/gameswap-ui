import { Button, Grid, Typography, makeStyles } from "@material-ui/core";
import { ReactComponent as JoyStickIcon } from "assets/svgs/create/joy_stick.svg";
import clsx from "clsx";
import React from "react";

import { GameItem } from "..";

const useStyles = makeStyles((theme) => ({
  root: {},
  noWrapper: {
    border: `1px solid ${theme.colors.primary85}`,
    borderRadius: 4,
    padding: "40px 12px",
    textAlign: "center",
  },
  noIcon: { color: theme.colors.primary60 },
  noTitle: { margin: 8, fontSize: 14, color: theme.colors.primary40 },
  noDescription: {
    fontSize: 13,
    color: theme.colors.primary70,
    marginBottom: 8,
    fontWeight: 200,
  },
  explore: {},
}));

export const GamesSection = () => {
  const classes = useStyles();

  const renderNo = () => {
    return (
      <div className={classes.noWrapper}>
        <JoyStickIcon className={classes.noIcon} />
        <Typography className={classes.noTitle}>
          Not following any games
        </Typography>
        <Typography className={classes.noDescription}>
          Looks like you don’t follow any games
        </Typography>
        <Button
          className={clsx(classes.explore, "small")}
          color="primary"
          variant="contained"
        >
          Explore
        </Button>
      </div>
    );
  };
  const renderContent = () => {
    const items = [0, 1, 2, 3, 4, 5, 6, 7];
    return (
      <div>
        <Grid container spacing={3}>
          {items.map((item) => {
            return (
              <Grid item key={`${item}`} lg={3} md={4} sm={6} xs={12}>
                <GameItem />
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      {renderNo()}
      <br />
      <br />
      {renderContent()}
    </div>
  );
};
