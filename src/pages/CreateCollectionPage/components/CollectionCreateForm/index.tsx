import { Button, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import {
  FormCollectionImageUpload,
  FormSwitchField,
  FormTextField,
} from "components";
import { useConnectedWeb3Context } from "contexts";
import { Form, Formik } from "formik";
import React from "react";
import { getIPFSService } from "services/ipfs";
import { ICollection, ICollectionFormValues } from "utils/types";
import * as Yup from "yup";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  notice: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(1.6125),
    "& + &": {
      marginTop: 0,
    },
  },
  button: {
    width: theme.spacing(30),
    height: theme.spacing(6),
    borderRadius: 6,
    marginTop: theme.spacing(5),
  },
}));

interface IProps {
  className?: string;
  onSubmit: (values: ICollection) => void;
}

export const CollectionCreateForm = (props: IProps) => {
  const classes = useStyles();
  const { account, setWalletConnectModalOpened } = useConnectedWeb3Context();
  const ipfsService = getIPFSService();
  const isWalletConnected = !!account;

  const initialFormValues: ICollectionFormValues = {
    id: "",
    image: null,
    imageUrl: "",
    name: "",
    description: "",
    uploading: false,
    symbol: "",
    isPrivate: true,
  };

  return (
    <Formik
      initialValues={initialFormValues}
      onSubmit={async (values) => {
        if (!isWalletConnected) {
          setWalletConnectModalOpened(true);
          return;
        }
        props.onSubmit(values);
      }}
      validationSchema={Yup.object().shape({
        id: Yup.string(),
        name: Yup.string().required(),
        description: Yup.string(),
        symbol: Yup.string().required(),
        imageUrl: Yup.string().required(),
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
        <Form onSubmit={handleSubmit}>
          <div className={clsx(classes.root, props.className)}>
            <FormCollectionImageUpload
              FormControlProps={{ fullWidth: true }}
              FormHelperTextProps={{
                error: Boolean(touched.imageUrl && errors.imageUrl),
              }}
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
                      .catch(() => {
                        setFieldValue("uploading", false);
                      });
                  }
                },
                value: values.image,
              }}
              helperText={touched.imageUrl && errors.imageUrl}
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
                placeholder: "Description for your collection",
                value: values.description,
                multiline: true,
              }}
              label="Description"
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
              subLabel="Only you can mint assets of this collection"
            />
            <Button
              className={clsx(classes.button)}
              color="primary"
              disabled={!isValid || isSubmitting || values.uploading}
              fullWidth
              type="submit"
              variant="contained"
            >
              {isWalletConnected ? "Create" : "Connect wallet and create"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
