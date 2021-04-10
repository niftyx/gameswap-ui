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
    padding: "7px 24px",
    color: transparentize(0.4, theme.colors.text.default),
    backgroundColor: transparentize(0.9, theme.colors.text.default),
    fontSize: 14,
    "& span": {
      color: theme.colors.text.third,
    },
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 17,
    color: theme.colors.text.default,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: "23px",
    color: theme.colors.text.sixth,
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
  const { attributes, description } = data;

  const collection = collections.find((c) => c.id === data.collectionId);

  return (
    <div className={classes.root}>
      <OwnerAvatarRowItem address={data.owner} roleName="Owner" />
      {creator && (
        <>
          <HorizonDivider />
          <OwnerAvatarRowItem
            address={creator}
            right={() => (
              <Typography
                align="center"
                className={classes.royalties}
                component="div"
              >
                <span>{data.royalties || 0}%</span> of sales will go to creator
              </Typography>
            )}
            roleName="Creator"
          />
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
      {description && (
        <div className={classes.section}>
          <Typography className={classes.sectionTitle}>Description</Typography>
          <Typography className={classes.description}>{description}</Typography>
        </div>
      )}
    </div>
  );
};
