import { Button, Typography, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import clsx from "clsx";
import React from "react";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    border: `1px solid ${theme.colors.primary85}`,
    borderRadius: 4,
    padding: 24,
    textAlign: "center",
    paddingTop: 48,
  },
  icon: { width: 24, height: 24, display: "inline-block" },
  note1: { color: theme.colors.primary40, fontSize: 14, marginTop: 24 },
  note2: {
    color: theme.colors.primary70,
    fontSize: 13,
    marginBottom: 16,
    marginTop: 16,
  },
  button: {
    height: 32,
    borderRadius: 4,
    backgroundColor: theme.colors.purple60,
  },
}));

interface IProps {
  className?: string;
}

export const EmptyInventorySection = (props: IProps) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        <img alt="info" className={classes.icon} src="/svgs/icons/info.svg" />
        <Typography align="center" className={classes.note1}>
          Inventory Empty
        </Typography>
        <Typography align="center" className={classes.note2}>
          Looks like you don’t have any items in your inventory
        </Typography>
        <Button
          className={classes.button}
          color="primary"
          onClick={() => history.push("/create")}
          variant="contained"
        >
          <AddIcon />
          &nbsp; Create
        </Button>
      </div>
    </div>
  );
};
