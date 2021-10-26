import { Input, InputAdornment, makeStyles } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import clsx from "clsx";
import { transparentize } from "polished";
import React, { ChangeEvent, useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: theme.spacing(30),
    backgroundColor: theme.colors.primary80,
    borderRadius: theme.spacing(0.6125),
    padding: `${theme.spacing(1.5)}px ${theme.spacing(1.75)}px`,
    color: transparentize(0.76, theme.colors.white),
    fontSize: theme.spacing(2),
    height: theme.spacing(6),
  },
  input: {
    "&::-webkit-input-placeholder": {
      color: transparentize(0.76, theme.colors.white),
    },
    "&::-moz-placeholder": {
      color: transparentize(0.76, theme.colors.white),
    },
    "&:-ms-input-placeholder": {
      color: transparentize(0.76, theme.colors.white),
    },
    "&:-moz-placeholder": {
      color: transparentize(0.76, theme.colors.white),
    },
  },
}));

interface IProps {
  className?: string;
  value?: string;
  onSearch?: () => void;
  onChange?: (_: string) => void;
}

export const SearchInput = (props: IProps) => {
  const classes = useStyles();
  const [word, setWord] = useState<string>(props.value || "");
  const onChangeWord = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    event.persist();
    setWord(event.target.value);
    if (props.onChange) props.onChange(event.target.value);
  };

  return (
    <Input
      className={clsx(classes.root, props.className)}
      classes={{ input: classes.input }}
      disableUnderline
      onChange={onChangeWord}
      placeholder="Search..."
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      }
      value={word}
    />
  );
};
