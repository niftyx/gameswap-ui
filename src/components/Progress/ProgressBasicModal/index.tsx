import { IconButton, Modal, Typography, makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import clsx from "clsx";
import { CommentLoader } from "components";
import React from "react";
import useCommonStyles from "styles/common";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.colors.purple40}`,
    boxShadow: theme.shadows[5],
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    outline: "none",
    maxHeight: "90vh",
  },
  header: {
    display: "flex",
    alignItems: "center",
  },
  title: {
    fontSize: theme.spacing(3),
    color: theme.colors.white,
    flex: 1,
  },
  closeButton: {
    border: `1px solid ${theme.colors.white}`,
    color: theme.colors.white,
    padding: theme.spacing(0.5),
  },
  content: {
    marginTop: theme.spacing(1),
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

interface IProps {
  visible: boolean;
  onClose: () => void;
  isStepLoading: boolean;
  children: React.ReactNode | React.ReactNode[];
  loadingComment?: string;
}

export const ProgressBasicModal = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { isStepLoading, loadingComment, onClose, visible } = props;

  return (
    <Modal disableBackdropClick onClose={onClose} open={visible}>
      <div className={clsx(classes.root, commonClasses.scroll)}>
        {isStepLoading ? (
          <CommentLoader comment={loadingComment} />
        ) : (
          <>
            <div className={classes.header}>
              <Typography className={classes.title}>Follow steps</Typography>
              <IconButton className={classes.closeButton} onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </div>
            <div className={classes.content}>{props.children}</div>
          </>
        )}
      </div>
    </Modal>
  );
};
