import { Button, CircularProgress, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { FormTextField } from "components";
import {
  FormCollectionImageUpload,
  FormGameChoose,
  FormSwitchField,
} from "components/Form";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getContractAddress } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { Form, Formik } from "formik";
import React from "react";
import { ERC721FactoryService } from "services";
import { getIPFSService } from "services/ipfs";
import { waitSeconds } from "utils";
import { getLogger } from "utils/logger";
import { ICollectionFormValues } from "utils/types";
import * as Yup from "yup";

import { BasicModal } from "../Common";

const logger = getLogger("CollectionCreationModal::");

const useStyles = makeStyles((theme) => ({
  root: {},
  form: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  button: {
    height: theme.spacing(6),
    borderRadius: 6,
    marginTop: theme.spacing(5),
  },
}));

interface IProps {
  visible: boolean;
  onClose: () => void;
}

export const CollectionCreateModal = (props: IProps) => {
  const classes = useStyles();
  const { onClose, visible } = props;
  const ipfsService = getIPFSService();
  const { loadCollections } = useGlobal();

  const {
    account,
    library: provider,
    networkId,
    setWalletConnectModalOpened,
  } = useConnectedWeb3Context();
  const gswap721FactoryAddress = getContractAddress(
    networkId || DEFAULT_NETWORK_ID,
    "erc721Factory"
  );
  const factoryContract = new ERC721FactoryService(
    provider,
    account,
    gswap721FactoryAddress
  );
  const isWalletConnected = !!account;

  const initialFormValues: ICollectionFormValues = {
    id: "",
    image: null,
    imageUrl: "",
    name: "",
    gameId: "",
    description: "",
    uploading: false,
    symbol: "",
    isPrivate: true,
  };

  return (
    <BasicModal onClose={onClose} title="Collection" visible={visible}>
      <Formik
        initialValues={initialFormValues}
        onSubmit={async (values, { setSubmitting }) => {
          if (!isWalletConnected) {
            setWalletConnectModalOpened(true);
            return;
          }
          // create a new collection
          try {
            setSubmitting(true);
            const collectionUrl = await ipfsService.uploadData(
              JSON.stringify({
                imageUrl: values.imageUrl,
                description: values.description,
              })
            );
            const txResult = await factoryContract.createGswap721(
              values.name,
              values.symbol,
              collectionUrl,
              values.gameId,
              values.isPrivate
            );
            logger.log(txResult);
            await waitSeconds(5);
            await loadCollections();
            setSubmitting(false);
            onClose();
          } catch (error) {
            logger.error(error);
            setSubmitting(false);
          }
        }}
        validationSchema={Yup.object().shape({
          id: Yup.string(),
          name: Yup.string().required(),
          description: Yup.string(),
          symbol: Yup.string().required(),
          gameIds: Yup.array().min(1),
        })}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          isValid,
          setFieldValue,
          touched,
          values,
        }) => (
          <Form className={classes.form} onSubmit={handleSubmit}>
            <FormCollectionImageUpload
              FormControlProps={{ fullWidth: true }}
              InputProps={{
                id: "collection-image",
                name: "collection-image",
                onBlur: handleBlur,
                onChange: (file: File | null) => {
                  setFieldValue("image", file);
                  if (file) {
                    setFieldValue("uploading", true);
                    ipfsService
                      .uploadData(file)
                      .then((url) => {
                        setFieldValue("uploading", false);
                        setFieldValue("imageUrl", url);
                      })
                      .catch((err) => {
                        logger.error(err);
                        setFieldValue("uploading", false);
                      });
                  }
                },
                value: values.image,
              }}
              imageUrl={values.imageUrl}
              loading={values.uploading}
            />
            <FormTextField
              FormControlProps={{ fullWidth: true }}
              FormHelperTextProps={{
                error: Boolean(touched.name && errors.name),
              }}
              InputLabelProps={{ htmlFor: "name", shrink: true }}
              InputProps={{
                id: "name",
                name: "name",
                onBlur: handleBlur,
                onChange: handleChange,
                placeholder: "Enter token name",
                value: values.name,
                required: true,
              }}
              helperText={touched.name && errors.name}
              label="Display name"
            />
            <FormTextField
              FormControlProps={{ fullWidth: true }}
              FormHelperTextProps={{
                error: Boolean(touched.symbol && errors.symbol),
              }}
              InputLabelProps={{ htmlFor: "symbol", shrink: true }}
              InputProps={{
                id: "symbol",
                name: "symbol",
                onBlur: handleBlur,
                onChange: handleChange,
                placeholder: "Enter token symbol",
                value: values.symbol,
                required: true,
              }}
              helperText={touched.symbol && errors.symbol}
              label="Symbol"
            />
            <FormTextField
              FormControlProps={{ fullWidth: true }}
              InputLabelProps={{ htmlFor: "description", shrink: true }}
              InputProps={{
                id: "description",
                name: "description",
                onBlur: handleBlur,
                onChange: handleChange,
                placeholder: "Add a description for your collection",
                value: values.description,
                multiline: true,
              }}
              label="Description"
            />
            <FormGameChoose
              comment="Select games"
              gameIds={[values.gameId]}
              onChange={(values: string[]) => {
                setFieldValue("gameId", values[0]);
              }}
            />
            <FormSwitchField
              FormControlProps={{ fullWidth: true }}
              InputLabelProps={{
                htmlFor: "isPrivate",
                shrink: true,
              }}
              InputProps={{
                id: "isPrivate",
                name: "isPrivate",
                onBlur: handleBlur,
                onChange: handleChange,
                checked: values.isPrivate,
              }}
              label="Private Collection"
              subLabel="Only you can mint assets for this collection"
            />

            <Button
              className={clsx(classes.button)}
              color="primary"
              disabled={!isValid || isSubmitting || values.uploading}
              fullWidth
              type="submit"
              variant="contained"
            >
              {isSubmitting && <CircularProgress color="primary" size={32} />}
              {isWalletConnected ? "Create" : "Connect wallet and create"}
            </Button>
          </Form>
        )}
      </Formik>
    </BasicModal>
  );
};
