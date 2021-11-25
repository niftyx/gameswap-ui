import { makeStyles } from "@material-ui/core";
import { PageContainer } from "components";
import React from "react";

import { FollowingPageContent } from "./FollowingPageContent";

const useStyles = makeStyles(() => ({
  root: {
    height: "auto",
  },
}));
const FollowingPage = () => {
  const classes = useStyles();

  return (
    <PageContainer className={classes.root}>
      <FollowingPageContent />
    </PageContainer>
  );
};

export default FollowingPage;
