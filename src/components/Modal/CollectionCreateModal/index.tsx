import {
  Button,
  CircularProgress,
  InputAdornment,
  makeStyles,
} from "@material-ui/core";
import clsx from "classnames";
import { FormTextField } from "components";
import { FormCollectionImageUpload } from "components/Form";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getContractAddress } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { Form, Formik } from "formik";
import React from "react";
import { ERC721FactoryService } from "services";
import { getIPFSService } from "services/ipfs";
import { waitSeconds } from "utils";
import { getLogger } from "utils/logger";
import { ICollection } from "utils/types";
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
    borderRadius: theme.spacing(3),
    marginTop: theme.spacing(5),
  },
}));

interface IProps {
  visible: boolean;
  onClose: () => void;
}

interface ICollectionFormValues extends ICollection {
  image: File | null;
  uploading: boolean;
}

export const CollectionCreateModal = (props: IProps) => {
  const classes = useStyles();
  const { onClose, visible } = props;
  const ipfsService = getIPFSService();
  const { loadCollections } = useGlobal();

  const { account, library: provider, networkId } = useConnectedWeb3Context();
  const gswap721FactoryAddress = getContractAddress(
    networkId || DEFAULT_NETWORK_ID,
    "erc721Factory"
  );
  const factoryContract = new ERC721FactoryService(
    provider,
    account,
    gswap721FactoryAddress
  );

  const initialFormValues: ICollectionFormValues = {
    id: "",
    image: null,
    imageUrl:
      "https://ipfs.infura.io:5001/api/v0/cat/QmYVmy51YoGTzP2hAcH2EWziXAZPm8cKjDxADvWPGFYN2f",
    displayName: "",
    shortUrl: "",
    description: "",
    uploading: false,
    symbol: "",
  };

  return (
    <BasicModal onClose={onClose} title="Collection" visible={visible}>
      <Formik
        initialValues={initialFormValues}
        onSubmit={async (values, { setSubmitting }) => {
          // create a new collection
          try {
            setSubmitting(true);
            const txResult = await factoryContract.createGswap721(
              values.displayName,
              values.symbol,
              values.imageUrl,
              values.description || "",
              values.shortUrl || ""
            );
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
          displayName: Yup.string().required(),
          description: Yup.string(),
          symbol: Yup.string().required(),
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
                error: Boolean(touched.displayName && errors.displayName),
              }}
              InputLabelProps={{ htmlFor: "displayName", shrink: true }}
              InputProps={{
                id: "displayName",
                name: "displayName",
                onBlur: handleBlur,
                onChange: handleChange,
                placeholder: "Enter token name",
                value: values.displayName,
                required: true,
              }}
              helperText={touched.displayName && errors.displayName}
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
                placeholder: "Spread some words about your collection",
                value: values.description,
                multiline: true,
              }}
              label="Description"
            />
            <FormTextField
              FormControlProps={{ fullWidth: true }}
              InputLabelProps={{ htmlFor: "shortUrl", shrink: true }}
              InputProps={{
                id: "shortUrl",
                name: "shortUrl",
                onBlur: handleBlur,
                onChange: handleChange,
                placeholder: "Enter short url",
                value: values.shortUrl,
                startAdornment: (
                  <InputAdornment position="start">
                    gameswap.com/
                  </InputAdornment>
                ),
              }}
              helperText="Will be used as public URL"
              label="Short url"
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
              Create collection
            </Button>
          </Form>
        )}
      </Formik>
    </BasicModal>
  );
};
