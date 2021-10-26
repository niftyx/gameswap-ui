import { MenuItem, Select, makeStyles } from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import clsx from "clsx";
import React from "react";
import { IGame } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.spacing(3),
    width: 1,
    backgroundColor: theme.colors.transparent,
    minWidth: theme.spacing(18),
  },
  input: {
    color: theme.colors.white,
  },
}));

interface IProps {
  className?: string;
  games: IGame[];
  selectedGameId?: string;
  onUpdate: (_?: string) => void;
}

export const GamesSelect = (props: IProps) => {
  const classes = useStyles();
  const { games, onUpdate, selectedGameId } = props;
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
      value={selectedGameId ? selectedGameId : "all"}
    >
      <MenuItem value={"all"}>All Games</MenuItem>
      {games.map((game) => (
        <MenuItem key={game.id} value={game.id}>
          {game.name}
        </MenuItem>
      ))}
    </Select>
  );
};
