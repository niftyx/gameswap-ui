import { MenuItem, Select, makeStyles } from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import clsx from "clsx";
import React from "react";
import { ESortDirection } from "utils/enums";

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.spacing(3),
    width: 1,
    backgroundColor: theme.colors.transparent,
    minWidth: theme.spacing(18),
  },
  input: {
    color: theme.colors.text.third,
  },
}));

interface IProps {
  className?: string;
  sortDir?: ESortDirection;
  onUpdate: (_?: ESortDirection) => void;
}

export const SortSelect = (props: IProps) => {
  const classes = useStyles();
  const { onUpdate, sortDir } = props;
  return (
    <Select
      IconComponent={KeyboardArrowDownIcon}
      className={clsx(classes.root, props.className)}
      disableUnderline
      inputProps={{ className: classes.input }}
      onChange={(event) => {
        const newValue = event.target.value;
        if (newValue === "no") {
          onUpdate();
        } else {
          onUpdate(newValue as ESortDirection);
        }
      }}
      value={sortDir ? sortDir : "no"}
    >
      <MenuItem value={"no"}>No Sort</MenuItem>
      {Object.values(ESortDirection).map((dir) => (
        <MenuItem key={dir} value={dir}>
          {dir === ESortDirection.asc ? "Amount: Min" : "Amount: Max"}
        </MenuItem>
      ))}
    </Select>
  );
};
