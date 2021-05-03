import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { PageContainer } from "components";
import React from "react";
import { useParams } from "react-router-dom";

import { ProfilePageContent } from "./ProfilePageContent";

const useStyles = makeStyles(() => ({
  root: {
    height: "auto",
  },
}));

const ProfilePage = () => {
  const classes = useStyles();

  const params = useParams();
  const userId = ((params || {}) as any).id;

  return (
    <PageContainer className={classes.root}>
      <ProfilePageContent userId={userId} />
    </PageContainer>
  );
};

export default ProfilePage;
