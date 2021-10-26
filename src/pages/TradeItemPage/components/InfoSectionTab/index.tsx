import { CircularProgress, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import {
  HorizonDivider,
  OwnerAvatarRowItem,
  SecondaryButton,
} from "components";
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
    color: transparentize(0.4, theme.colors.white),
    backgroundColor: transparentize(0.9, theme.colors.white),
    fontSize: 14,
    "& span": {
      color: theme.colors.white,
    },
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 17,
    color: theme.colors.white,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: "23px",
    color: theme.colors.white,
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
    color: theme.colors.white,
    marginRight: 16,
  },
  propertyValue: {
    fontSize: 16,
    lineHeight: "23px",
    color: theme.colors.white,
    flex: 1,
  },
  unlock: {
    margin: "8px 0",
  },
}));

interface IProps {
  data: IAssetItem;
  creator: string;
  onUnlockData: () => Promise<void>;
  unlocking: boolean;
}

export const InfoSectionTab = (props: IProps) => {
  const classes = useStyles();
  const { creator, data, onUnlockData, unlocking } = props;
  const {
    data: { collections },
  } = useGlobal();
  const { attributes, description } = data;
  const { account, networkId } = useConnectedWeb3Context();
  const etherUri = getEtherscanUri(networkId || DEFAULT_NETWORK_ID);

  const collection = collections.find((c) => c.id === data.collectionId);

  const showUnlock =
    account?.toLowerCase() === data.ownerId.toLowerCase() && !!data.lockedData;

  return (
    <div className={classes.root}>
      {showUnlock && (
        <SecondaryButton
          className={clsx(classes.unlock, "unlock-content")}
          onClick={() => {
            if (!unlocking) {
              onUnlockData();
            }
          }}
        >
          {unlocking && (
            <>
              <CircularProgress size={32} />
              &nbsp;&nbsp;
            </>
          )}
          {unlocking ? "Unlocking ..." : "View Locked Content"}
        </SecondaryButton>
      )}
      <OwnerAvatarRowItem
        address={data.ownerId}
        href={`/users/${data.ownerId}`}
        roleName="Owner"
      />
      {creator && (
        <>
          <HorizonDivider />
          <OwnerAvatarRowItem
            address={creator}
            href={`/users/${creator}`}
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
            href={`/collections/${collection.id}`}
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
          <a
            className={classes.propertyValue}
            href={`${etherUri}tokens/${
              data.collectionId
            }/instance/${data.assetId.toString()}/token-transfers`}
            rel="noreferrer"
            target="_blank"
          >
            {data.assetId.toString()}
          </a>
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
