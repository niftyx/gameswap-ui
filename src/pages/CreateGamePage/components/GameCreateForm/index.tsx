import { Button, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import {
  FormGameImageUpload,
  FormHeaderImageUpload,
  FormSelectField,
  FormTextField,
} from "components";
import { GAME_CATEGORIES } from "config/constants";
import { useConnectedWeb3Context } from "contexts";
import { Form, Formik } from "formik";
import React from "react";
import { getIPFSService } from "services/ipfs";
import { EPlatform } from "utils/enums";
import { IGame, IGameFormValues } from "utils/types";
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
  avatar: {
    marginTop: -40,
    marginLeft: 20,
    width: 100,
  },
}));

interface IProps {
  className?: string;
  onSubmit: (values: IGame) => void;
}

export const GameCreateForm = (props: IProps) => {
  const classes = useStyles();
  const { account, library: provider } = useConnectedWeb3Context();
  const ipfsService = getIPFSService();
  const isWalletConnected = !!account;

  const initialFormValue: IGameFormValues = {
    id: "",
    image: null,
    imageUrl: "",
    name: "",
    version: "",
    description: "",
    categoryId: GAME_CATEGORIES[0].value,
    imageUploading: false,
    headerImage: null,
    headerImageUploading: false,
    platform: EPlatform.Windows,
  };

  return (
    <Formik
      initialValues={initialFormValue}
      onSubmit={async (values) => {
        if (!provider) return;
        const payload: IGame = {
          id: "",
          name: values.name,
          version: values.version,
          description: values.description,
          categoryId: values.categoryId,
          imageUrl: values.imageUrl,
          headerImageUrl: values.headerImageUrl,
          platform: values.platform,
        };
        props.onSubmit(payload);
      }}
      validationSchema={Yup.object().shape({
        id: Yup.string(),
        imageUrl: Yup.string().required(),
        name: Yup.string().required(),
        version: Yup.string().required(),
        description: Yup.string(),
        categoryId: Yup.string().required(),
        platform: Yup.string().required(),
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
            <FormHeaderImageUpload
              FormControlProps={{ fullWidth: true }}
              InputProps={{
                id: "headerImage",
                name: "headerImage",
                onBlur: handleBlur,
                onChange: (file: File | null) => {
                  setFieldValue("headerImage", file);
                  if (file) {
                    setFieldValue("headerImageUploading", true);
                    ipfsService
                      .uploadData(file)
                      .then((url) => {
                        setFieldValue("headerImageUploading", false);
                        setFieldValue("headerImageUrl", url);
                      })
                      .catch(() => {
                        setFieldValue("headerImageUploading", false);
                      });
                  } else {
                    setFieldValue("headerImageUrl", "");
                  }
                },
                value: {
                  file: values.headerImage,
                  fileURL: values.headerImageUrl,
                },
              }}
              loading={values.headerImageUploading}
            />
            <FormGameImageUpload
              FormControlProps={{ className: classes.avatar, fullWidth: true }}
              InputProps={{
                id: "game-image",
                name: "game-image",
                onBlur: handleBlur,
                onChange: (file: File | null) => {
                  setFieldValue("image", file);
                  if (file) {
                    setFieldValue("imageUploading", true);
                    ipfsService
                      .uploadData(file)
                      .then((url) => {
                        setFieldValue("imageUploading", false);
                        setFieldValue("imageUrl", url);
                      })
                      .catch(() => {
                        setFieldValue("imageUploading", false);
                      });
                  } else {
                    setFieldValue("imageUrl", "");
                  }
                },
                value: values.image,
              }}
              imageUrl={values.imageUrl}
              loading={values.imageUploading}
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
              label="Name"
            />
            <FormTextField
              FormControlProps={{ fullWidth: true }}
              FormHelperTextProps={{
                error: Boolean(touched.version && errors.version),
              }}
              InputLabelProps={{ htmlFor: "version", shrink: true }}
              InputProps={{
                id: "version",
                name: "version",
                onBlur: handleBlur,
                onChange: handleChange,
                placeholder: "Game Version",
                value: values.version,
                required: true,
              }}
              helperText={touched.version && errors.version}
              label="Game Version"
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
            <FormSelectField
              FormControlProps={{ fullWidth: true }}
              InputLabelProps={{ htmlFor: "categoryId", shrink: true }}
              SelectProps={{
                id: "categoryId",
                name: "categoryId",
                onBlur: handleBlur,
                onChange: handleChange,
                value: values.categoryId,
              }}
              items={GAME_CATEGORIES.map((category) => ({
                value: category.value,
                label: category.name,
              }))}
              label="Select Category"
            />
            <FormSelectField
              FormControlProps={{ fullWidth: true }}
              InputLabelProps={{ htmlFor: "platform", shrink: true }}
              SelectProps={{
                id: "platform",
                name: "platform",
                onBlur: handleBlur,
                onChange: handleChange,
                value: values.platform,
              }}
              items={Object.values(EPlatform).map((platform) => ({
                value: platform,
                label: platform,
              }))}
              label="Select Platform"
            />
            <Button
              className={clsx(classes.button)}
              color="primary"
              disabled={
                !isValid ||
                isSubmitting ||
                !isWalletConnected ||
                values.imageUploading ||
                values.headerImageUploading
              }
              type="submit"
              variant="contained"
            >
              {isWalletConnected ? "Create game" : "Please Connect Wallet"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
