import { Typography, makeStyles } from "@material-ui/core";
import { transparentize } from "polished";
import React from "react";

import { IFormValues } from "../ERC721CreateForm";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "sticky",
    top: theme.spacing(5),
  },
  content: {
    marginTop: theme.spacing(1),
    border: `1px solid ${theme.colors.border.primary}`,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    minHeight: theme.spacing(40),
  },
  title: {
    fontSize: theme.spacing(3),
    color: theme.colors.text.default,
    fontWeight: "bold",
  },
  img: {
    width: "100%",
    margin: `${theme.spacing(2)}px 0`,
  },
  name: {
    fontSize: theme.spacing(2),
    color: theme.colors.text.default,
    fontWeight: 500,
  },
  price: {
    fontSize: theme.spacing(2),
    color: transparentize(0.3, theme.colors.text.default),
  },
}));

interface IProps {
  data: IFormValues;
}

export const ERC721Preview = (props: IProps) => {
  const classes = useStyles();
  const {
    data: { image, instantSale, name, salePrice, saleToken },
  } = props;

  return (
    <div className={classes.root}>
      <Typography className={classes.title}>Preview</Typography>
      <div className={classes.content}>
        {image && <img alt="img" className={classes.img} src={image} />}
        <Typography className={classes.name}>{name}</Typography>
        {instantSale && (
          <Typography className={classes.price}>
            {salePrice} {saleToken}
          </Typography>
        )}
      </div>
    </div>
  );
};
