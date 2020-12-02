import { Typography, makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import clsx from "classnames";
import { transparentize } from "polished";
import React from "react";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
    borderRadius: theme.spacing(0.5),
    backgroundColor: theme.colors.background.tenth,
  },
  header: {
    position: "relative",
  },
  title: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(3),
  },
  closeIcon: {
    position: "absolute",
    right: 0,
    top: 0,
    cursor: "pointer",
    color: transparentize(0.2, theme.colors.text.default),
  },
  content: {
    marginTop: theme.spacing(2),
  },
}));

interface IProps {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  title: string;
  onClose: () => void;
}

const NoteContainer = (props: IProps) => {
  const classes = useStyles();
  const { onClose, title } = props;
  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.header}>
        <Typography className={classes.title} component="div">
          {title}
        </Typography>
        <span className={classes.closeIcon} onClick={onClose}>
          <CloseIcon />
        </span>
      </div>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

export default NoteContainer;
