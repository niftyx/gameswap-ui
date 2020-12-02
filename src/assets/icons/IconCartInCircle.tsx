import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

interface IProps {
  className?: string;
}

export const IconCartInCircle = (props: IProps) => {
  const classes = useStyles();

  return (
    <svg
      className={clsx(classes.root, props.className)}
      fill="none"
      height="66"
      viewBox="0 0 66 66"
      width="66"
    >
      <path
        clipRule="evenodd"
        d="M33 66c18.225 0 33-14.775 33-33S51.225 0 33 0 0 14.775 0 33s14.775 33 33 33zm-9.386-20.8c0-1.54 1.246-2.8 2.786-2.8s2.8 1.26 2.8 2.8c0 1.54-1.26 2.8-2.8 2.8a2.796 2.796 0 01-2.786-2.8zM18 22.8V20h4.578l1.316 2.8H44.6c.77 0 1.4.63 1.4 1.4 0 .238-.056.476-.168.672l-5.012 9.086a2.787 2.787 0 01-2.45 1.442H27.94l-1.26 2.282-.042.168c0 .196.154.35.35.35H43.2V41H26.4c-1.54 0-2.8-1.26-2.8-2.8 0-.49.126-.952.35-1.344l1.89-3.43L20.8 22.8H18zm19.614 22.4c0-1.54 1.246-2.8 2.786-2.8s2.8 1.26 2.8 2.8c0 1.54-1.26 2.8-2.8 2.8a2.796 2.796 0 01-2.786-2.8z"
        fill="#fff"
        fillRule="evenodd"
      ></path>
    </svg>
  );
};
