import { IconButton, Modal, Typography, makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import clsx from "classnames";
import React from "react";
import useCommonStyles from "styles/common";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.colors.border.primary}`,
    boxShadow: theme.shadows[5],
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    outline: "none",
    maxHeight: "80vh",
    userSelect: "none",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
  },
  title: {
    fontSize: theme.spacing(3),
    color: theme.colors.text.default,
    flex: 1,
  },
  closeButton: {
    border: `1px solid ${theme.colors.text.default}`,
    color: theme.colors.text.default,
    padding: theme.spacing(0.5),
  },
  content: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

interface IProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode | React.ReactNode[];
  title: string;
  className?: string;
}

export const BasicModal = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const { onClose, title, visible } = props;

  return (
    <Modal disableBackdropClick onClose={onClose} open={visible}>
      <div
        className={clsx(classes.root, commonClasses.scroll, props.className)}
      >
        <div className={classes.header}>
          <Typography className={classes.title}>{title}</Typography>
          <IconButton className={classes.closeButton} onClick={() => onClose()}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className={classes.content}>{props.children}</div>
      </div>
    </Modal>
  );
};
