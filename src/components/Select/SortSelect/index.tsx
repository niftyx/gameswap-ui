import { MenuItem, Select, makeStyles } from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.spacing(3),
    width: 1,
    backgroundColor: theme.colors.transparent,
    minWidth: theme.spacing(8),
  },
  input: {
    color: theme.colors.text.third,
  },
}));

interface IProps {
  className?: string;
}

export const SortSelect = (props: IProps) => {
  const classes = useStyles();
  return (
    <Select
      IconComponent={KeyboardArrowDownIcon}
      className={clsx(classes.root, props.className)}
      defaultValue="20"
      disableUnderline
      inputProps={{ className: classes.input }}
    >
      <MenuItem value="20">Sort</MenuItem>
      <MenuItem value="30">Test</MenuItem>
      <MenuItem value="40">Test</MenuItem>
    </Select>
  );
};
