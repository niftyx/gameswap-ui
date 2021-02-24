import { Button, CircularProgress, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { FormTextField } from "components";
import {
  FormCollectionImageUpload,
  FormPlatformField,
  FormSelectField,
} from "components/Form";
import { GAME_CATEGORIES } from "config/constants";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { Form, Formik } from "formik";
import React from "react";
import { getAPIService } from "services/api";
import { getIPFSService } from "services/ipfs";
import { getLogger } from "utils/logger";
import { IGame } from "utils/types";
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
    borderRadius: theme.spacing(3),
    marginTop: theme.spacing(5),
  },
}));

interface IProps {
  visible: boolean;
  onClose: () => void;
}

interface IGameFormValues extends IGame {
  image: File | null;
  uploading: boolean;
}

export const GameCreateModal = (props: IProps) => {
  const classes = useStyles();
  const { onClose, visible } = props;
  const ipfsService = getIPFSService();
  const { account, library: provider } = useConnectedWeb3Context();
  const { loadGames } = useGlobal();
  const apiService = getAPIService();

  const initialFormValues: IGameFormValues = {
    id: "",
    image: null,
    imageUrl:
      "https://ipfs.infura.io:5001/api/v0/cat/QmYVmy51YoGTzP2hAcH2EWziXAZPm8cKjDxADvWPGFYN2f",
    title: "",
    version: "",
    description: "",
    categoryId: "",
    uploading: false,
    platform: [{ os: "", version: "" }],
  };

  return (
    <BasicModal onClose={onClose} title="Game" visible={visible}>
      <Formik
        initialValues={initialFormValues}
        onSubmit={async (values, { setSubmitting }) => {
          if (!provider) return;
          // create a new collection
          setSubmitting(true);
          try {
            const payload = {
              title: values.title,
              version: values.version,
              description: values.description,
              categoryId: values.categoryId,
              imageUrl: values.imageUrl,
              platform: values.platform.slice(0, -1),
              message: "",
            };
            const signedMessage = await provider
              .getSigner()
              .signMessage(payload.title);
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
          title: Yup.string().required(),
          version: Yup.string().required(),
          description: Yup.string(),
          categoryId: Yup.string().required(),
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
                id: "game-image",
                name: "game-image",
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
                error: Boolean(touched.title && errors.title),
              }}
              InputLabelProps={{ htmlFor: "title", shrink: true }}
              InputProps={{
                id: "title",
                name: "title",
                onBlur: handleBlur,
                onChange: handleChange,
                placeholder: "Enter token name",
                value: values.title,
                required: true,
              }}
              helperText={touched.title && errors.title}
              label="Title"
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
                placeholder: "Version",
                value: values.version,
                required: true,
              }}
              helperText={touched.version && errors.version}
              label="Version"
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
            <FormPlatformField
              FormControlProps={{ fullWidth: true }}
              InputLabelProps={{ shrink: true }}
              helperText={touched.platform && errors.platform}
              label="Platform"
              onChange={(platform: Array<{ os: string; version: string }>) => {
                setFieldValue("platform", platform);
              }}
              optional
              platforms={values.platform}
            />
            <Button
              className={clsx(classes.button)}
              color="primary"
              disabled={
                !isValid || isSubmitting || values.uploading || !account
              }
              fullWidth
              type="submit"
              variant="contained"
            >
              {isSubmitting && <CircularProgress color="primary" size={32} />}
              Create game
            </Button>
          </Form>
        )}
      </Formik>
    </BasicModal>
  );
};
