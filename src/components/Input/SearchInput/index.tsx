import { Input, InputAdornment, makeStyles } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import clsx from "classnames";
import { transparentize } from "polished";
import React, { ChangeEvent, useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: theme.spacing(30),
    backgroundColor: theme.colors.background.fifth,
    borderRadius: theme.spacing(0.6125),
    padding: `${theme.spacing(1.5)}px ${theme.spacing(1.75)}px`,
    color: transparentize(0.76, theme.colors.text.default),
  },
}));

interface IProps {
  className?: string;
  onSearch?: () => void;
}

export const SearchInput = (props: IProps) => {
  const classes = useStyles();
  const [word, setWord] = useState<string>("");
  const onChangeWord = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    event.persist();
    setWord(event.target.value);
  };

  return (
    <Input
      className={clsx(classes.root, props.className)}
      disableUnderline
      onChange={onChangeWord}
      placeholder="Search"
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      }
      value={word}
    />
  );
};
