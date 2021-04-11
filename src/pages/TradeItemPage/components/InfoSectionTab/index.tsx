import { Typography, makeStyles } from "@material-ui/core";
import { HorizonDivider, OwnerAvatarRowItem } from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getEtherscanUri, getNetworkName } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import moment from "moment";
import { transparentize } from "polished";
import React from "react";
import { shortenAddress } from "utils";
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
  propertyRow: {
    display: "flex",
    "& + &": {
      marginTop: 12,
    },
  },
  propertyKey: {
    fontSize: 16,
    lineHeight: "23px",
    color: theme.colors.text.sixth,
    marginRight: 16,
  },
  propertyValue: {
    fontSize: 16,
    lineHeight: "23px",
    color: theme.colors.text.sixth,
    flex: 1,
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
  const { networkId } = useConnectedWeb3Context();
  const etherUri = getEtherscanUri(networkId || DEFAULT_NETWORK_ID);

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
      {attributes && attributes.length > 0 && (
        <div className={classes.section}>
          <Typography className={classes.sectionTitle}>Properties</Typography>
          {attributes.map((attribute) => (
            <div className={classes.propertyRow} key={attribute.key}>
              <Typography className={classes.propertyKey}>
                {attribute.key}:
              </Typography>
              <Typography className={classes.propertyValue}>
                {attribute.value}
              </Typography>
            </div>
          ))}
        </div>
      )}
      <div className={classes.section}>
        <Typography className={classes.sectionTitle}>More details</Typography>
        <div className={classes.propertyRow}>
          <Typography className={classes.propertyKey}>Date:</Typography>
          <Typography className={classes.propertyValue}>
            {moment(data.createTimeStamp * 1000).format("MM/DD/YYYY")}
          </Typography>
        </div>
        <div className={classes.propertyRow}>
          <Typography className={classes.propertyKey}>
            Contract Address:
          </Typography>
          <a
            className={classes.propertyValue}
            href={`${etherUri}address/${data.collectionId}`}
            rel="noreferrer"
            target="_blank"
          >
            {shortenAddress(data.collectionId)}
          </a>
        </div>
        <div className={classes.propertyRow}>
          <Typography className={classes.propertyKey}>TokenId:</Typography>
          <Typography className={classes.propertyValue}>
            {data.tokenId.toString()}
          </Typography>
        </div>
        <div className={classes.propertyRow}>
          <Typography className={classes.propertyKey}>Blockchain:</Typography>
          <Typography className={classes.propertyValue}>
            {getNetworkName(networkId || DEFAULT_NETWORK_ID)}
          </Typography>
        </div>
      </div>
    </div>
  );
};
