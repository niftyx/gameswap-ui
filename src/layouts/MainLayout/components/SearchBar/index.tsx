import { Input, InputAdornment, makeStyles } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import clsx from "clsx";
import React, { ChangeEvent, useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: theme.spacing(30),
  },
}));

interface IProps {
  className?: string;
  onSearch?: () => void;
}

const SearchBar = (props: IProps) => {
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
      placeholder="Search asset, game or user"
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      }
      value={word}
    />
  );
};

export default SearchBar;
