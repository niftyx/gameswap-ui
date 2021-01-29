import { Button, InputAdornment, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { FormTextField } from "components";
import { FormCollectionImageUpload } from "components/Form";
import { Form, Formik } from "formik";
import React from "react";
import { getIPFSService } from "services/ipfs";
import { ICollection } from "utils/types";
import * as Yup from "yup";

import { BasicModal } from "../Common";

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

  const initialFormValues: ICollectionFormValues = {
    id: "",
    image: null,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvWXdHqLkVmn4KVm0F3pdcY2YF9WvhkXjdNA&usqp=CAU",
    displayName: "",
    shortUrl: "",
    description: "",
    uploading: false,
  };

  return (
    <BasicModal onClose={onClose} title="Collection" visible={visible}>
      <Formik
        initialValues={initialFormValues}
        onSubmit={async (values, { setErrors }) => {
          // create a new collection
        }}
        validationSchema={Yup.object().shape({
          id: Yup.string(),
          displayName: Yup.string().required(),
          description: Yup.string(),
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
              Create collection
            </Button>
          </Form>
        )}
      </Formik>
    </BasicModal>
  );
};
