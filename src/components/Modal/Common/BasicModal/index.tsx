import { IconButton, Modal, Typography, makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";
import useCommonStyles from "styles/common";

const useStyles = makeStyles((theme) => ({
  modal: {
    backgroundColor: transparentize(0.5, theme.colors.background.fifth),
  },
  root: {
    position: "absolute",
    width: 580,
    backgroundColor: theme.colors.background.secondary,
    boxShadow: theme.colors.shadow.modal,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(6),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    outline: "none",
    maxHeight: "80vh",
    userSelect: "none",
    [theme.breakpoints.down("xs")]: {
      width: 400,
      padding: theme.spacing(2),
    },
  },
  header: {
    position: "relative",
  },
  title: {
    fontSize: theme.spacing(3.5),
    color: theme.colors.text.default,
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    right: -16,
    top: -16,
    color: theme.colors.background.tenth,
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
    <Modal
      BackdropComponent={() => null}
      className={classes.modal}
      disableBackdropClick
      onClose={onClose}
      open={visible}
    >
      <div className={clsx(classes.root, props.className)}>
        <div className={classes.header}>
          <Typography className={classes.title}>{title}</Typography>
          <IconButton className={classes.closeButton} onClick={() => onClose()}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className={clsx(classes.content, commonClasses.scroll)}>
          {props.children}
        </div>
      </div>
    </Modal>
  );
};
