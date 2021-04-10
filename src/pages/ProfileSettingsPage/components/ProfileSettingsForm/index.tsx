import {
  Button,
  InputAdornment,
  Typography,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import { FormSettingsAvatarUpload, FormTextField } from "components";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { Form, Formik } from "formik";
import { transparentize } from "polished";
import React from "react";
import { getIPFSService } from "services/ipfs";
import useCommonStyles from "styles/common";
import { IUserInfo } from "utils/types";
import * as Yup from "yup";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  description: {
    color: transparentize(0.4, theme.colors.text.default),
  },
  inputLabel: {
    color: theme.colors.text.default,
    fontSize: 20,
    fontWeight: 500,
  },
  verify: {
    cursor: "pointer",
    transition: "all 0.5s",
    color: theme.colors.background.fourth,
    "&:hover": {
      opacity: 0.7,
    },
  },
  at: {
    color: transparentize(0.3, theme.colors.text.seventh),
  },
  button: {
    width: theme.spacing(30),
    height: theme.spacing(6),
    borderRadius: 6,
    marginTop: theme.spacing(5),
  },
}));

export interface ISettingsFormValues extends IUserInfo {
  uploading: boolean;
  image: File | null;
}

interface IProps {
  className?: string;
  onSubmit: (payload: IUserInfo) => void;
}

export const ProfileSettingsForm = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { onSubmit } = props;
  const { account } = useConnectedWeb3Context();
  const ipfsService = getIPFSService();
  const {
    data: { userInfo },
  } = useGlobal();

  if (!userInfo) return null;

  const initialValues: ISettingsFormValues = {
    name: userInfo.name,
    customUrl: userInfo.customUrl,
    bio: userInfo.bio,
    twitterUsername: userInfo.twitterUsername,
    personalSite: userInfo.personalSite,
    imageUrl: userInfo.imageUrl,
    uploading: false,
    image: null,
    id: userInfo.id,
    address: userInfo.address,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { image, uploading, ...payload } = values;
        onSubmit(payload);
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().required(),
        customUrl: Yup.string(),
        bio: Yup.string(),
        twitterUsername: Yup.string(),
        personalSite: Yup.string().matches(
          /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
          "Enter correct url!"
        ),
        imageUrl: Yup.string(),
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
        <Form
          className={clsx(classes.root, commonClasses.scroll)}
          onSubmit={handleSubmit}
        >
          <FormSettingsAvatarUpload
            FormControlProps={{ fullWidth: true }}
            InputProps={{
              id: "avatar-image",
              name: "avatar-image",
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
            address={account || ""}
            imageUrl={values.imageUrl}
            loading={values.uploading}
          />
          <Typography className={classes.description} component="div">
            Set preferred display name, images and manage personal settings
          </Typography>
          <FormTextField
            FormControlProps={{
              fullWidth: true,
            }}
            FormHelperTextProps={{
              error: Boolean(touched.name && errors.name),
            }}
            InputLabelProps={{
              htmlFor: "name",
              shrink: true,
              className: classes.inputLabel,
            }}
            InputProps={{
              id: "name",
              name: "name",
              onBlur: handleBlur,
              onChange: handleChange,
              placeholder: "Enter your display name",
              value: values.name,
            }}
            helperText={
              (touched.name && errors.name) ||
              "Only letters, numbers, underscores and emojis"
            }
            label="Display name"
          />
          <FormTextField
            FormControlProps={{
              fullWidth: true,
            }}
            InputLabelProps={{
              htmlFor: "customUrl",
              shrink: true,
              className: classes.inputLabel,
            }}
            InputProps={{
              id: "customUrl",
              startAdornment: (
                <InputAdornment position="start">
                  <Typography>gameswap.org/</Typography>
                </InputAdornment>
              ),
              name: "customUrl",
              onBlur: handleBlur,
              onChange: handleChange,
              placeholder: "Enter your custom URL",
              value: values.customUrl,
            }}
            label="Custom URL"
          />
          <FormTextField
            FormControlProps={{
              fullWidth: true,
            }}
            InputLabelProps={{
              htmlFor: "bio",
              shrink: true,
              className: classes.inputLabel,
            }}
            InputProps={{
              id: "bio",
              name: "bio",
              onBlur: handleBlur,
              onChange: handleChange,
              placeholder: "Some words about yourself",
              value: values.bio,
              multiline: true,
            }}
            helperText="URLs allowed"
            label="Bio"
          />
          <FormTextField
            FormControlProps={{
              fullWidth: true,
            }}
            InputLabelProps={{
              htmlFor: "twitterUsername",
              shrink: true,
              className: classes.inputLabel,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography className={classes.at}>@</Typography>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <span className={classes.verify}>Verify Twitter account</span>
                </InputAdornment>
              ),
              id: "twitterUsername",
              name: "twitterUsername",
              onBlur: handleBlur,
              onChange: handleChange,
              placeholder: "Enter username",
              value: values.twitterUsername,
            }}
            helperText="Verify your Twitter handle and get a verification badge"
            label="Twitter username"
          />
          <FormTextField
            FormControlProps={{
              fullWidth: true,
            }}
            FormHelperTextProps={{
              error: Boolean(touched.personalSite && errors.personalSite),
            }}
            InputLabelProps={{
              htmlFor: "personalSite",
              shrink: true,
              className: classes.inputLabel,
            }}
            InputProps={{
              id: "personalSite",
              name: "personalSite",
              onBlur: handleBlur,
              onChange: handleChange,
              placeholder: "https://",
              value: values.personalSite,
            }}
            helperText={touched.personalSite && errors.personalSite}
            label="Personal or professional site"
          />
          <Typography className={classes.description} component="div">
            To update your settings you should sign message through your wallet.
            Click &apos;Update profile&apos; then sign the message
          </Typography>
          <Button
            className={classes.button}
            color="primary"
            disabled={!isValid || isSubmitting}
            type="submit"
            variant="contained"
          >
            Update profile
          </Button>
        </Form>
      )}
    </Formik>
  );
};
