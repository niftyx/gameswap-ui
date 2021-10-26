/* eslint-disable @typescript-eslint/no-unused-vars */
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
  FormHeaderImageUpload,
  FormSettingsAvatarUpload,
  FormTextField,
} from "components";
import { BANNED_CUSTOM_URLS } from "config/constants";
import { useGlobal } from "contexts";
import { Form, Formik } from "formik";
import { transparentize } from "polished";
import React from "react";
import { getAPIService } from "services/api";
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
    color: transparentize(0.4, theme.colors.white),
  },
  inputLabel: {
    color: theme.colors.white,
    fontSize: 20,
    fontWeight: 500,
  },
  verify: {
    cursor: "pointer",
    transition: "all 0.5s",
    color: theme.colors.primary60,
    "&:hover": {
      opacity: 0.7,
    },
  },
  at: {
    color: transparentize(0.3, theme.colors.white),
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

export interface ISettingsFormValues extends IUserInfo {
  uploading: boolean;
  image: File | null;
  headerImage: File | null;
  headerImageUploading: boolean;
  customUrlVerified: boolean;
  customUrlVerifying: boolean;
}

let UrlVerifyTimer: any;

interface IProps {
  className?: string;
  onSubmit: (payload: IUserInfo) => void;
}

export const ProfileSettingsForm = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { onSubmit } = props;
  const ipfsService = getIPFSService();
  const apiService = getAPIService();
  const {
    data: { userInfo },
  } = useGlobal();

  if (!userInfo) return null;

  const initialValues: ISettingsFormValues = {
    name: userInfo.name,
    customUrl: userInfo.customUrl,
    bio: userInfo.bio,
    twitterUsername: userInfo.twitterUsername,
    twitterVerified: userInfo.twitterVerified,
    twitchUsername: userInfo.twitchUsername,
    facebookUsername: userInfo.facebookUsername,
    youtubeUsername: userInfo.youtubeUsername,
    instagramUsername: userInfo.instagramUsername,
    tiktokUsername: userInfo.tiktokUsername,
    personalSite: userInfo.personalSite,
    imageUrl: userInfo.imageUrl,
    headerImageUrl: userInfo.headerImageUrl,
    headerImage: null,
    uploading: false,
    headerImageUploading: false,
    image: null,
    id: userInfo.id,
    address: userInfo.address,
    customUrlVerified: true,
    customUrlVerifying: false,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        const {
          customUrlVerified,
          customUrlVerifying,
          headerImage,
          headerImageUploading,
          image,
          uploading,
          ...payload
        } = values;
        onSubmit(payload);
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().required(),
        customUrl: Yup.string()
          .min(5)
          .matches(/^[a-zA-Z0-9\-_]+$/, "You can use a-z, A-Z, 0-9, _ and -"),
        bio: Yup.string(),
        twitterUsername: Yup.string().matches(
          /^[a-zA-Z0-9\-_]+$/,
          "Enter valid username!"
        ),
        twitchUsername: Yup.string().matches(
          /^[a-zA-Z0-9\-_]+$/,
          "Enter valid username!"
        ),
        facebookUsername: Yup.string().matches(
          /^[a-zA-Z0-9\-_]+$/,
          "Enter valid username!"
        ),
        youtubeUsername: Yup.string().matches(
          /^[a-zA-Z0-9\-_]+$/,
          "Enter valid username!"
        ),
        instagramUsername: Yup.string().matches(
          /^[a-zA-Z0-9\-_]+$/,
          "Enter valid username!"
        ),
        tiktokUsername: Yup.string().matches(
          /^[a-zA-Z0-9\-_]+$/,
          "Enter valid username!"
        ),
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
        setFieldError,
        setFieldValue,
        touched,
        values,
      }) => (
        <Form
          className={clsx(classes.root, commonClasses.scroll)}
          onSubmit={handleSubmit}
        >
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
          <FormSettingsAvatarUpload
            FormControlProps={{ className: classes.avatar, fullWidth: true }}
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
            FormHelperTextProps={{
              error: Boolean(touched.customUrl && errors.customUrl),
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
                    setFieldError("customUrl", "It's not allowed to use this!");
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
            FormHelperTextProps={{
              error: Boolean(errors.twitterUsername),
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
              placeholder: "Enter twitter username",
              value: values.twitterUsername,
            }}
            helperText={
              errors.twitterUsername ||
              "Verify your Twitter handle and get a verification badge"
            }
            label="Twitter username"
          />
          <FormTextField
            FormControlProps={{
              fullWidth: true,
            }}
            FormHelperTextProps={{
              error: Boolean(errors.twitchUsername),
            }}
            InputLabelProps={{
              htmlFor: "twitchUsername",
              shrink: true,
              className: classes.inputLabel,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography className={classes.at}>@</Typography>
                </InputAdornment>
              ),
              id: "twitchUsername",
              name: "twitchUsername",
              onBlur: handleBlur,
              onChange: handleChange,
              placeholder: "Enter twitch username",
              value: values.twitchUsername,
            }}
            helperText={errors.twitchUsername}
            label="Twitch username"
          />
          <FormTextField
            FormControlProps={{
              fullWidth: true,
            }}
            FormHelperTextProps={{
              error: Boolean(errors.facebookUsername),
            }}
            InputLabelProps={{
              htmlFor: "facebookUsername",
              shrink: true,
              className: classes.inputLabel,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography className={classes.at}>@</Typography>
                </InputAdornment>
              ),
              id: "facebookUsername",
              name: "facebookUsername",
              onBlur: handleBlur,
              onChange: handleChange,
              placeholder: "Enter facebook username",
              value: values.facebookUsername,
            }}
            helperText={errors.facebookUsername}
            label="Facebook username"
          />
          <FormTextField
            FormControlProps={{
              fullWidth: true,
            }}
            FormHelperTextProps={{
              error: Boolean(errors.youtubeUsername),
            }}
            InputLabelProps={{
              htmlFor: "youtubeUsername",
              shrink: true,
              className: classes.inputLabel,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography className={classes.at}>@</Typography>
                </InputAdornment>
              ),
              id: "youtubeUsername",
              name: "youtubeUsername",
              onBlur: handleBlur,
              onChange: handleChange,
              placeholder: "Enter youtube username",
              value: values.youtubeUsername,
            }}
            helperText={errors.youtubeUsername}
            label="Youtube username"
          />
          <FormTextField
            FormControlProps={{
              fullWidth: true,
            }}
            FormHelperTextProps={{
              error: Boolean(errors.instagramUsername),
            }}
            InputLabelProps={{
              htmlFor: "instagramUsername",
              shrink: true,
              className: classes.inputLabel,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography className={classes.at}>@</Typography>
                </InputAdornment>
              ),
              id: "instagramUsername",
              name: "instagramUsername",
              onBlur: handleBlur,
              onChange: handleChange,
              placeholder: "Enter instagram username",
              value: values.instagramUsername,
            }}
            helperText={errors.instagramUsername}
            label="Instagram username"
          />
          <FormTextField
            FormControlProps={{
              fullWidth: true,
            }}
            FormHelperTextProps={{
              error: Boolean(errors.tiktokUsername),
            }}
            InputLabelProps={{
              htmlFor: "tiktokUsername",
              shrink: true,
              className: classes.inputLabel,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography className={classes.at}>@</Typography>
                </InputAdornment>
              ),
              id: "tiktokUsername",
              name: "tiktokUsername",
              onBlur: handleBlur,
              onChange: handleChange,
              placeholder: "Enter tiktok username",
              value: values.tiktokUsername,
            }}
            helperText={errors.tiktokUsername}
            label="Tiktok username"
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
            disabled={
              !isValid ||
              isSubmitting ||
              (values.customUrl !== "" && !values.customUrlVerified)
            }
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
