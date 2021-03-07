import { InputAdornment, TextField, makeStyles } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import SearchIcon from "@material-ui/icons/Search";
import clsx from "clsx";
import { useGlobal } from "contexts";
import { transparentize } from "polished";
import React, { useState } from "react";
import useCommonStyles from "styles/common";

const useStyles = makeStyles((theme) => ({
  root: {},
  item: {
    userSelect: "none",
    marginTop: 8,
    color: transparentize(0.3, theme.colors.text.default),
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.5s",
    "&:hover": { opacity: 0.7 },
    "& > * + *": {
      marginLeft: 8,
    },
    "& svg": {
      color: theme.colors.background.fourth,
    },
  },
  img: {
    width: 24,
    height: 24,
    borderRadius: "50%",
  },
  search: {
    backgroundColor: theme.colors.background.fifth,
    margin: "4px 0",
    "& .MuiOutlinedInput-input": {
      padding: "10px 12px",
      paddingLeft: 0,
    },
  },
  icon: { color: transparentize(0.3, theme.colors.text.default) },
  content: {
    maxHeight: 140,
    overflowY: "auto",
  },
}));

interface IProps {
  collectionIds: string[];
  onChange: (_: string[]) => void;
  className?: string;
}

export const CollectionFilter = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { collectionIds, onChange } = props;
  const {
    data: { collections },
  } = useGlobal();

  const [keyword, setKeyword] = useState<string>("");

  return (
    <div className={clsx(classes.root, props.className)}>
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className={classes.icon} />
            </InputAdornment>
          ),
        }}
        className={classes.search}
        fullWidth
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Filter"
        value={keyword}
        variant="outlined"
      />
      <div className={clsx(classes.content, commonClasses.scroll)}>
        {collections
          .filter((collection) => {
            if (keyword === "") return true;
            if (
              collection.name
                ?.toLocaleLowerCase()
                .includes(keyword.toLowerCase())
            )
              return true;
            return false;
          })
          .map((collection) => {
            const isSelected = collectionIds.includes(collection.id);

            return (
              <div
                className={classes.item}
                key={collection.id}
                onClick={() => {
                  if (isSelected) {
                    onChange(
                      collectionIds.filter((id) => id !== collection.id)
                    );
                  } else {
                    onChange([...collectionIds, collection.id]);
                  }
                }}
              >
                {isSelected ? (
                  <CheckCircleIcon />
                ) : (
                  <img
                    alt="img"
                    className={classes.img}
                    src={collection.imageUrl}
                  />
                )}
                <span>{collection.name}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
};
