import { makeStyles } from "@material-ui/core";
import { ReactComponent as GavelIcon } from "assets/svgs/gavel.svg";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 33,
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 18px",
    color: theme.colors.white,
    fontSize: 12,
    borderRadius: 16,
    backgroundColor: theme.colors.primary100,
  },
}));

interface IProps {
  className?: string;
  onClick: () => void;
}

export const PlaceBidButton = (props: IProps) => {
  const classes = useStyles();
  const { onClick } = props;
  return (
    <div className={clsx(classes.root, props.className)} onClick={onClick}>
      <GavelIcon />
      &nbsp; PLACE BID
    </div>
  );
};
