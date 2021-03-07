import { Typography, makeStyles } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import clsx from "classnames";
import { useGlobal } from "contexts";
import React from "react";
import useCommonStyles from "styles/common";

import { FormCollectionChooseItem } from "../FormCollectionChooseItem";

const useStyles = makeStyles((theme) => ({
  root: {},
  label: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(1.75),
    marginTop: theme.spacing(1),
  },
  content: {
    marginTop: theme.spacing(2.5),
    display: "flex",
    overflowX: "auto",
    overflowY: "hidden",
    flexWrap: "wrap",
  },
  icon: {
    fontSize: 40,
    color: theme.colors.text.default,
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: "50%",
  },
}));

interface IProps {
  comment: string;
  collectionId: string;
  onChange: (_: string) => void;
  onNewCollection: () => void;
}

export const FormCollectionChoose = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { collectionId, comment, onChange, onNewCollection } = props;
  const {
    data: { collections },
  } = useGlobal();

  return (
    <div className={classes.root}>
      <Typography className={classes.label} component="div">
        {comment}
      </Typography>
      <div className={clsx(classes.content, commonClasses.scrollHorizontal)}>
        <FormCollectionChooseItem
          active={false}
          onClick={onNewCollection}
          renderIcon={() => <AddCircleIcon className={classes.icon} />}
          subTitle="Collection"
          title="Create"
        />
        {collections.map((collection) => (
          <FormCollectionChooseItem
            active={collectionId === collection.id}
            key={collection.id}
            onClick={() => {
              if (collectionId !== collection.id) {
                onChange(collection.id);
              }
            }}
            renderIcon={() => (
              <img
                alt="img"
                className={classes.img}
                src={collection.imageUrl}
              />
            )}
            subTitle={" "}
            title={collection.name || ""}
          />
        ))}
      </div>
    </div>
  );
};
