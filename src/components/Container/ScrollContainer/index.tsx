import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import React from "react";
import useCommonStyles from "styles/common";

const useStyles = makeStyles(() => ({
  root: {},
}));

interface IProps {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  onScrollEnd?: () => void;
}

export const ScrollContainer = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { onScrollEnd } = props;

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight;
    if (bottom && onScrollEnd) {
      onScrollEnd();
    }
  };

  return (
    <div
      className={clsx(classes.root, commonClasses.scroll, props.className)}
      onScroll={handleScroll}
    >
      {props.children}
    </div>
  );
};
