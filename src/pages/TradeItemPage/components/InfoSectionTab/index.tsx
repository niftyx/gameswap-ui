import { Typography, makeStyles } from "@material-ui/core";
import { HorizonDivider, OwnerAvatarRowItem } from "components";
import { useGlobal } from "contexts";
import { transparentize } from "polished";
import React from "react";
import { IAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {},
  royalties: {
    borderRadius: 32,
    padding: "12px 0",
    color: transparentize(0.4, theme.colors.text.default),
    backgroundColor: transparentize(0.9, theme.colors.text.default),
    marginBottom: 16,
  },
}));

interface IProps {
  data: IAssetItem;
  creator: string;
}

export const InfoSectionTab = (props: IProps) => {
  const classes = useStyles();
  const { creator, data } = props;
  const {
    data: { collections },
  } = useGlobal();

  const collection = collections.find((c) => c.id === data.collectionId);

  return (
    <div className={classes.root}>
      <OwnerAvatarRowItem address={data.owner} roleName="Owner" />
      {creator && (
        <>
          <HorizonDivider />
          <OwnerAvatarRowItem address={creator} roleName="Creator" />
          <Typography
            align="center"
            className={classes.royalties}
            component="div"
          >
            {data.royalties || 0} % of sales will go to creator
          </Typography>
        </>
      )}

      {collection && (
        <>
          <HorizonDivider />
          <OwnerAvatarRowItem
            image={collection.imageUrl}
            name={collection.name || ""}
            roleName="Collection (ERC721)"
            showTick={false}
          />
        </>
      )}
    </div>
  );
};
