import {
  InputAdornment,
  MenuItem,
  Select,
  makeStyles,
} from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import SortIcon from "@material-ui/icons/Sort";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.spacing(3),
    width: 1,
    backgroundColor: theme.colors.transparent,
    minWidth: theme.spacing(12),
  },
  input: {
    color: theme.colors.text.third,
  },
  sortIcon: {
    color: theme.colors.text.third,
    transform: "scaleX(-1)",
    filter: "FlipH",
  },
}));

interface IProps {
  className?: string;
}

export const PriceSelect = (props: IProps) => {
  const classes = useStyles();
  return (
    <Select
      IconComponent={KeyboardArrowDownIcon}
      className={clsx(classes.root, props.className)}
      defaultValue="20"
      disableUnderline
      inputProps={{ className: classes.input }}
      startAdornment={
        <InputAdornment position="start">
          <SortIcon className={classes.sortIcon} />
        </InputAdornment>
      }
    >
      <MenuItem value="20">Price</MenuItem>
      <MenuItem value="30">Test</MenuItem>
      <MenuItem value="40">Test</MenuItem>
    </Select>
  );
};
