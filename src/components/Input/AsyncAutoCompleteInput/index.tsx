import {
  Avatar,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import SearchIcon from "@material-ui/icons/Search";
import { Autocomplete } from "@material-ui/lab";
import clsx from "clsx";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
  input: {
    backgroundColor: theme.colors.background.third,
    padding: 8,
    borderRadius: 4,
  },
  paper: { margin: "8px -8px 8px -8px", borderRadius: 4 },
  item: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  itemText: { flex: 1 },
  itemAvatar: { width: 24, height: 24, marginRight: 12 },
  itemChecked: { marginLeft: 12 },
}));

interface IProps {
  className?: string;
  getOptions: (
    _: string
  ) => Promise<{ value: string; label: string; image: string }[]>;
  onSelect: (_?: string) => void;
  preselected: string[];
}

interface IState {
  keyword: string;
  options: { value: string; label: string; image: string }[];
  loading: boolean;
  opened: boolean;
}

let timerId: any = undefined;
const delay = 1000;

export const AsyncAutoCompleteInput = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({
    keyword: "",
    options: [],
    loading: false,
    opened: false,
  });
  const { getOptions, onSelect, preselected } = props;

  const handleGetData = () => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(async () => {
      setState((prev) => ({ ...prev, loading: true, options: [] }));
      const options = await getOptions(state.keyword);
      setState((prev) => ({ ...prev, loading: false, options: options }));
      timerId = null;
    }, delay);
  };

  useEffect(() => {
    if (state.opened && state.options.length === 0) {
      handleGetData();
    }
  }, [state.opened]);

  return (
    <div className={clsx(classes.root, props.className)}>
      <Autocomplete
        classes={{ paper: classes.paper }}
        getOptionLabel={(option) => option.label}
        getOptionSelected={(option, value) => option.value === value.value}
        id="asynchronous-input"
        inputValue={state.keyword}
        loading={state.loading}
        loadingText="Loading ..."
        onChange={(event, value, reason, details) => {
          if (reason === "select-option" && details) {
            onSelect(details.option.value);
            setState((prev) => ({ ...prev, keyword: "" }));
          } else if (reason === "clear") {
            onSelect();
          }
        }}
        onClose={() => setState((prev) => ({ ...prev, opened: false }))}
        onInputChange={(event, value, reason) => {
          setState((prev) => ({ ...prev, keyword: value }));
          if (reason === "input") {
            handleGetData();
          }
        }}
        onOpen={() => setState((prev) => ({ ...prev, opened: true }))}
        options={state.options}
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {state.loading ? (
                    <CircularProgress color="primary" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              disableUnderline: true,
            }}
            className={classes.input}
            placeholder="Search ..."
            variant="standard"
          />
        )}
        renderOption={(option) => {
          const isSelected = preselected.includes(option.value);
          return (
            <div className={classes.item}>
              <Avatar className={classes.itemAvatar} src={option.image} />
              <Typography className={classes.itemText}>
                {option.label}
              </Typography>
              {isSelected && <CheckIcon className={classes.itemChecked} />}
            </div>
          );
        }}
      />
    </div>
  );
};
