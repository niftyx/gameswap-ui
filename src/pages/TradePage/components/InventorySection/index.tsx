import { makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { PageContainer } from "components";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

interface IProps {
  className?: string;
}

const InventorySection = (props: IProps) => {
  const classes = useStyles();
  return (
    <PageContainer className={clsx(classes.root, props.className)}>
      InventorySection
    </PageContainer>
  );
};

export default InventorySection;
