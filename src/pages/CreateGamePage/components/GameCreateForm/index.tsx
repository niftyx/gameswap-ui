import {
  Button,
  CircularProgress,
  InputAdornment,
  Typography,
  makeStyles,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import clsx from "clsx";
import {
  FormGameImageUpload,
  FormHeaderImageUpload,
  FormSelectField,
  FormTextField,
} from "components";
import { BANNED_CUSTOM_URLS, GAME_CATEGORIES } from "config/constants";
import { useConnectedWeb3Context } from "contexts";
import { Form, Formik } from "formik";
import React from "react";
import { getAPIService } from "services/api";
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
  loader: {
    width: "24px !important",
    height: "24px !important",
  },
}));

let UrlVerifyTimer: any;

interface IProps {
  className?: string;
  onSubmit: (values: IGame) => void;
}

export const GameCreateForm = (props: IProps) => {
  const classes = useStyles();
  const { account, setWalletConnectModalOpened } = useConnectedWeb3Context();
  const ipfsService = getIPFSService();
  const isWalletConnected = !!account;
  const apiService = getAPIService();

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
    customUrl: "",
    customUrlVerified: true,
    customUrlVerifying: false,
  };

  return (
    <Formik
      initialValues={initialFormValue}
      onSubmit={async (values) => {
        if (!isWalletConnected) {
          setWalletConnectModalOpened(true);
          return;
        }
        const payload: IGame = {
          id: "",
          name: values.name,
          version: values.version,
          description: values.description,
          categoryId: values.categoryId,
          imageUrl: values.imageUrl,
          headerImageUrl: values.headerImageUrl,
          platform: values.platform,
          customUrl: values.customUrl,
        };
        props.onSubmit(payload);
      }}
      validationSchema={Yup.object().shape({
        id: Yup.string(),
        customUrl: Yup.string()
          .min(5)
          .matches(/^[a-zA-Z0-9\-_]+$/, "You can use a-z, A-Z, 0-9, _ and -"),
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
        setFieldError,
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
                      .catch((err) => {
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
                placeholder: "Enter game name",
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
                placeholder: "Add a description about the game",
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
            <FormTextField
              FormControlProps={{
                fullWidth: true,
              }}
              FormHelperTextProps={{
                error: Boolean(touched.customUrl && errors.customUrl),
              }}
              InputLabelProps={{
                htmlFor: "customUrl",
                shrink: true,
              }}
              InputProps={{
                id: "customUrl",
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography>gameswap.org/</Typography>
                  </InputAdornment>
                ),
                endAdornment:
                  values.customUrlVerifying || values.customUrlVerified ? (
                    <InputAdornment position="end">
                      {values.customUrlVerifying ? (
                        <CircularProgress className={classes.loader} />
                      ) : (
                        <CheckIcon />
                      )}
                    </InputAdornment>
                  ) : null,
                name: "customUrl",
                onBlur: handleBlur,
                onChange: (event) => {
                  handleChange(event);
                  const newUrl = event.target.value;

                  if (newUrl === "") {
                    setFieldValue("customUrlVerifying", false);
                    setFieldValue("customUrlVerified", true);
                  } else if (
                    newUrl.length >= 6 &&
                    newUrl.match(/^[a-zA-Z0-9\-_]+$/)
                  ) {
                    setFieldValue("customUrlVerified", false);
                    if (UrlVerifyTimer) {
                      clearTimeout(UrlVerifyTimer);
                    }
                    if (BANNED_CUSTOM_URLS.includes(newUrl.toLowerCase())) {
                      setFieldError(
                        "customUrl",
                        "It's not allowed to use this!"
                      );
                      return;
                    }
                    UrlVerifyTimer = setTimeout(async () => {
                      // verify if username is not duplicated
                      setFieldValue("customUrlVerifying", true);
                      const verified = await apiService.checkCustomUrlUsable(
                        newUrl
                      );
                      setFieldValue("customUrlVerifying", false);
                      setFieldValue("customUrlVerified", verified);
                      if (!verified) {
                        setFieldError(
                          "customUrl",
                          "It's not allowed to use this!"
                        );
                      }
                      UrlVerifyTimer = null;
                    }, 1000);
                  } else {
                    setFieldValue("customUrlVerifying", false);
                    setFieldValue("customUrlVerified", false);
                  }
                },
                placeholder: "Enter your custom URL",
                value: values.customUrl,
              }}
              helperText={touched.customUrl && errors.customUrl}
              label="Custom URL"
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
                values.imageUploading ||
                values.headerImageUploading ||
                (values.customUrl !== "" && !values.customUrlVerified)
              }
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
