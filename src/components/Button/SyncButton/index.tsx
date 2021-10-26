import { makeStyles } from "@material-ui/core";
import SyncIcon from "@material-ui/icons/Sync";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.spacing(3),
    width: theme.spacing(3),
    display: "flex",
    cursor: "pointer",
    color: theme.colors.white,
  },
  rotate: {
    animation: "spin 4s linear infinite",
    WebkitAnimation: "spin 4s linear infinite",
    MozAnimation: "spin 4s linear infinite",
  },
}));

interface IProps {
  className?: string;
  onSync?: () => void;
  isSyncing?: boolean;
}

export const SyncButton = (props: IProps) => {
  const classes = useStyles();
  const { isSyncing = false, onSync } = props;
  return (
    <div
      className={clsx(classes.root, props.className)}
      onClick={(!isSyncing && onSync ? onSync : () => {}) as any}
    >
      <SyncIcon className={isSyncing ? classes.rotate : ""} />
    </div>
  );
};
