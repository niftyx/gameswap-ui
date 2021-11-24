import { Typography, makeStyles } from "@material-ui/core";
import { ReactComponent as CollectionSvg } from "assets/svgs/create/collections.svg";
import { ReactComponent as DiamondSvg } from "assets/svgs/create/diamond.svg";
import { ReactComponent as JoyStickSvg } from "assets/svgs/create/joy_stick.svg";
import { PageBackButton, PageContainer, PageTitle } from "components";
import React from "react";
import { useHistory } from "react-router";

import { AssetCreateOption } from "./components";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: { display: "flex", alignItems: "center", justifyContent: "center" },
  description: {
    color: theme.colors.primary60,
    fontSize: 14,
    marginBottom: 40,
  },
}));

const CreateHomePage = () => {
  const classes = useStyles();
  const history = useHistory();

  const onBack = () => {
    history.push(`/`);
  };

  return (
    <PageContainer className={classes.root}>
      <PageBackButton onBack={onBack} title="Back" />
      <PageTitle title="Create" />
      <Typography className={classes.description}>
        Lorem Ipsum has been the industry&apos;s standard dummy text ever since
        the 1500s.
        <br />
        When an unknown printer took a galley of type and scrambled it to make a
        type specimen book.
      </Typography>
      <div className={classes.content}>
        <AssetCreateOption
          image={DiamondSvg}
          link="/create/erc721"
          title="Asset"
        />
        <AssetCreateOption
          image={CollectionSvg}
          link="/create/collection"
          title="Collection"
        />
        <AssetCreateOption
          image={JoyStickSvg}
          link="/create/game"
          title="Game"
        />
      </div>
    </PageContainer>
  );
};

export default CreateHomePage;
