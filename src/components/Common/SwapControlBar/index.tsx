import {
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  makeStyles,
} from "@material-ui/core";
import CachedIcon from "@material-ui/icons/Cached";
import SearchIcon from "@material-ui/icons/Search";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: { margin: "16px 0" },
  content: { display: "flex", alignItems: "center" },
  searchBar: {
    flex: 1,
    backgroundColor: theme.colors.primary85,
    padding: "8px",
    borderRadius: 4,
  },
  select: { marginLeft: 24, padding: 8, borderRadius: 4 },
  reload: {
    transform: "rotate(90deg)",
  },
}));

interface IProps {
  className?: string;
}

export const SwapControlBar = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        <TextField
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          className={classes.searchBar}
          color="primary"
          placeholder="Search..."
        />
        <Select
          className={classes.select}
          disableUnderline
          placeholder="MAX PRICE"
        >
          <MenuItem value="MAx Price">Max Price</MenuItem>
        </Select>
        <IconButton className={classes.reload}>
          <CachedIcon />
        </IconButton>
      </div>
    </div>
  );
};
