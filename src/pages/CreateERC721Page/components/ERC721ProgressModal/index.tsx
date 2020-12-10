import { IconButton, Modal, Typography, makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import clsx from "classnames";
import React, { useState } from "react";
import useCommonStyles from "styles/common";

import { ECreateStep } from "../../index";
import { IFormValues } from "../ERC721CreateForm";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.colors.border.primary}`,
    boxShadow: theme.shadows[5],
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
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

interface IProps {
  visible: boolean;
  onClose: () => void;
  step: ECreateStep;
  steps: Array<ECreateStep>;
  formValues: IFormValues;
}

export const ERC721ProgressModal = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { formValues, onClose, step, steps, visible } = props;

  return (
    <Modal disableBackdropClick onClose={onClose} open={visible}>
      <div className={clsx(classes.root, commonClasses.scroll)}>
        <div className={classes.header}>
          <Typography className={classes.title}>Follow steps</Typography>
          <IconButton className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className={classes.content}></div>
      </div>
    </Modal>
  );
};
