import { Typography, makeStyles } from "@material-ui/core";
import { IOSSwitch } from "components/Switch";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 32,
    borderRadius: 8,
    padding: "4px 12px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.5s",
    backgroundColor: theme.colors.transparent,
    "&:hover": {
      backgroundColor: transparentize(0.9, theme.colors.text.default),
    },
    "& + &": {
      marginTop: 16,
    },
  },
  title: {
    flex: 1,
    color: theme.colors.text.default,
  },
  toggle: {},
}));

interface IProps {
  title: string;
  showToggle?: boolean;
  toggleValue?: boolean;
  onClick: () => void;
}

export const AccountPopoverItem = (props: IProps) => {
  const classes = useStyles();
  const { onClick, showToggle = false, title, toggleValue } = props;

  return (
    <div className={classes.root} onClick={onClick}>
      <Typography className={classes.title} component="div">
        {title}
      </Typography>
      {showToggle && (
        <IOSSwitch checked={toggleValue || false} onChange={onClick} />
      )}
    </div>
  );
};
