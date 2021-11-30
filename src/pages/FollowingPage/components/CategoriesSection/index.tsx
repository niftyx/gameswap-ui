import { makeStyles } from "@material-ui/core";
import React from "react";

import { CategorySubSection } from "..";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export const CategoriesSection = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CategorySubSection title="Action" />
      <CategorySubSection title="Adventure" />
      <CategorySubSection title="Role-Playing" />
      <CategorySubSection title="Action" />
    </div>
  );
};
