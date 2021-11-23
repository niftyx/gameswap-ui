import { Button, Typography, makeStyles } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 40,
    color: theme.colors.white,
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    marginRight: 16,
  },
  img: { width: 18, height: 18 },
  label: {
    fontSize: 13,
  },
  arrow: {},
}));

export const NetworkSwitch = () => {
  const classes = useStyles();

  return (
    <Button className={classes.root} color="secondary" variant="contained">
      <img alt="eth" className={classes.img} src="/tokens/eth.svg" />
      &nbsp;&nbsp;
      <Typography>Ethereum</Typography>&nbsp;&nbsp;
      <ExpandMoreIcon />
    </Button>
  );
};
