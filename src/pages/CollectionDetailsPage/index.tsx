import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { PageContainer } from "components";
import React from "react";
import { Redirect, useParams } from "react-router-dom";
import useCommonStyles from "styles/common";
import { isAddress } from "utils/tools";

import { AssetsSection, HeroSection } from "./components";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "auto",
  },
  content: {
    height: "100%",
  },
  heroSection: {
    minHeight: "50%",
    marginLeft: -theme.spacing(2),
    marginRight: -theme.spacing(2),
    marginTop: -theme.spacing(2),
  },
  section: {
    marginTop: 16,
    marginBottom: 16,
  },
}));

const CollectionDetailsPage = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const params = useParams();
  const collectionId = ((params || {}) as any).id as string;

  if (!isAddress(collectionId)) {
    return <Redirect to="/" />;
  }

  return (
    <PageContainer className={classes.root}>
      <div className={clsx(classes.content)}>
        <HeroSection
          className={classes.heroSection}
          collectionId={collectionId}
        />
        <AssetsSection
          className={classes.section}
          collectionId={collectionId}
        />
      </div>
    </PageContainer>
  );
};

export default CollectionDetailsPage;
