import { MenuItem, Select, makeStyles } from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import clsx from "clsx";
import React from "react";
import { ICollection, IGame } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.spacing(3),
    width: 1,
    backgroundColor: theme.colors.transparent,
    minWidth: theme.spacing(24),
  },
  input: {
    color: theme.colors.white,
  },
}));

interface IProps {
  className?: string;
  collections: ICollection[];
  selectedCollectionId?: string;
  onUpdate: (_?: string) => void;
}

export const CollectionSelect = (props: IProps) => {
  const classes = useStyles();
  const { collections, onUpdate, selectedCollectionId } = props;
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
      value={selectedCollectionId ? selectedCollectionId : "all"}
    >
      <MenuItem value={"all"}>All Collections</MenuItem>
      {collections.map((collection) => (
        <MenuItem key={collection.id} value={collection.id}>
          {collection.name}
        </MenuItem>
      ))}
    </Select>
  );
};
