import { Typography, makeStyles } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";
import { numberWithCommas } from "utils";
import { IAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    cursor: "pointer",

    paddingRight: theme.spacing(4),
    position: "relative",
    "&:first-child": {
      "& .cart_content__item__content": {
        borderTop: "none",
      },
    },
    "&:last-child": {
      "& .cart_content__item__btn--remove": {
        bottom: 0,
      },
    },
    "&:hover": {
      "& .cart_content__item__content": {
        backgroundColor: transparentize(0.9, theme.colors.text.default),
      },
      "& .cart_content__item__btn--remove": {
        opacity: 1,
      },
    },
  },
  content: {
    borderTopLeftRadius: theme.spacing(0.5),
    borderBottomLeftRadius: theme.spacing(0.5),
    transition: "all 0.5s",
    padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderTop: `1px solid ${transparentize(0.9, theme.colors.text.default)}`,
  },
  btn: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: -1,
    transition: "all 0.5s",
    width: theme.spacing(4),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0,
    backgroundColor: transparentize(0.6, theme.colors.text.default),
    borderTopRightRadius: theme.spacing(0.5),
    borderBottomRightRadius: theme.spacing(0.5),
    color: transparentize(0.3, theme.colors.text.default),
    "&:hover": {
      backgroundColor: transparentize(0.4, theme.colors.text.default),
      color: theme.colors.text.default,
    },
  },
  img: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  titleWrapper: { flex: 1, "& > * + *": { marginTop: theme.spacing(1) } },
  title: {
    textAlign: "center",
    fontSize: theme.spacing(2),
    color: theme.colors.text.default,
  },
  comment: {
    textAlign: "center",
    fontSize: theme.spacing(2),
    color: transparentize(0.4, theme.colors.text.default),
  },
  price: {
    textAlign: "right",
    fontSize: theme.spacing(2.5),
    color: theme.colors.text.default,
    flex: 1,
  },
}));

interface IProps {
  className?: string;
  data: IAssetItem;
  onRemove: () => void;
}

export const CartContentItem = (props: IProps) => {
  const classes = useStyles();
  const { data, onRemove } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={clsx(classes.content, "cart_content__item__content")}>
        <img alt="img" className={classes.img} src={data.image} />
        <div className={classes.titleWrapper}>
          <Typography className={classes.title}>{data.name}</Typography>
        </div>
        <Typography className={classes.price}>
          {numberWithCommas(data.usdPrice.toFixed(2))}&nbsp;$
        </Typography>
      </div>
      <div
        className={clsx(classes.btn, "cart_content__item__btn--remove")}
        onClick={onRemove}
      >
        <DeleteIcon />
      </div>
    </div>
  );
};
