import { Button, CircularProgress, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { FormTextField } from "components";
import {
  FormGameImageUpload,
  FormHeaderImageUpload,
  FormSelectField,
} from "components/Form";
import { GAME_CATEGORIES } from "config/constants";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { Form, Formik } from "formik";
import React from "react";
import { getAPIService } from "services/api";
import { getIPFSService } from "services/ipfs";
import { EPlatform } from "utils/enums";
import { getLogger } from "utils/logger";
import { IGameFormValues } from "utils/types";
import * as Yup from "yup";

import { BasicModal } from "../Common";

const logger = getLogger("CollectionCreationModal::");

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
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
  avatar: {
    marginTop: -40,
    marginLeft: 20,
    width: 100,
  },
}));

interface IProps {
  visible: boolean;
  onClose: () => void;
}

export const GameCreateModal = (props: IProps) => {
  const classes = useStyles();
  const { onClose, visible } = props;
  const ipfsService = getIPFSService();
  const {
    account,
    library: provider,
    setWalletConnectModalOpened,
  } = useConnectedWeb3Context();
  const { loadGames } = useGlobal();
  const apiService = getAPIService();
  const isWalletConnected = !!account;

  const initialFormValues: IGameFormValues = {
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
    <BasicModal onClose={onClose} title="Game" visible={visible}>
      <Formik
        initialValues={initialFormValues}
        onSubmit={async (values, { setSubmitting }) => {
          if (!isWalletConnected) {
            setWalletConnectModalOpened(true);
            return;
          }
          if (!provider) return;
          // create a new game
          setSubmitting(true);
          try {
            const payload = {
              name: values.name,
              version: values.version,
              description: values.description,
              categoryId: values.categoryId,
              imageUrl: values.imageUrl,
              headerImageUrl: values.headerImageUrl || "",
              platform: values.platform,
              message: "",
            };
            const signedMessage = await provider
              .getSigner()
              .signMessage(payload.name);
            payload.message = signedMessage;

            await apiService.createGame(payload);
            await loadGames();
            setSubmitting(false);
            onClose();
          } catch (error) {
            setSubmitting(false);
            logger.error(error);
          }
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
          <Form className={classes.form} onSubmit={handleSubmit}>
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
                        logger.error(err);
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
                values.imageUploading ||
                values.headerImageUploading
              }
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
