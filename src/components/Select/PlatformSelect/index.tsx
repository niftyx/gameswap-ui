import { MenuItem, Select, makeStyles } from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import clsx from "clsx";
import React from "react";
import { EPlatform } from "utils/enums";
import { IGame } from "utils/types";

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
  selectedPlatform?: string;
  onUpdate: (_?: string) => void;
}

export const PlatformSelect = (props: IProps) => {
  const classes = useStyles();
  const { onUpdate, selectedPlatform } = props;
  return (
    <Select
      IconComponent={KeyboardArrowDownIcon}
      className={clsx(classes.root, props.className)}
      disableUnderline
      inputProps={{ className: classes.input }}
      onChange={(event) => {
        if (event.target.value === "all") {
          onUpdate();
        } else {
          onUpdate(String(event.target.value) || "");
        }
      }}
      value={selectedPlatform ? selectedPlatform : "all"}
    >
      <MenuItem value={"all"}>All</MenuItem>
      {Object.keys(EPlatform).map((platform) => (
        <MenuItem key={platform} value={(EPlatform as any)[platform]}>
          {platform}
        </MenuItem>
      ))}
    </Select>
  );
};
