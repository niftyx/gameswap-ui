import {
  Button,
  InputAdornment,
  MenuItem,
  Select,
  Typography,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import {
  FormAttributesField,
  FormCollectionChoose,
  FormImageUpload,
  FormModelUpload,
  FormSwitchField,
  FormTextField,
} from "components";
import {
  DEFAULT_NETWORK_ID,
  SERVICE_FEE,
  SERVICE_FEE_IN_PERCENT,
} from "config/constants";
import { getToken, knownTokens } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { Form, Formik } from "formik";
import React from "react";
import { IAssetAttribute, IToken, KnownToken } from "utils/types";
import * as Yup from "yup";

import { ERC721Preview } from "../ERC721Preview";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(2.5),
    },
  },
  left: {
    flex: 1,
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  right: {
    width: "calc(33% - 20px)",
    minWidth: "calc(33% - 20px)",
    [theme.breakpoints.down(800)]: {
      display: "none",
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
  modelWrapper: {
    backgroundColor: theme.colors.background.preview,
    marginTop: theme.spacing(1),
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    "& model-viewer": {
      width: 500,
      height: 300,
      [theme.breakpoints.down("sm")]: {
        width: 400,
        height: 200,
      },
      [theme.breakpoints.down("xs")]: {
        width: 300,
        height: 150,
      },
    },
  },
}));

export interface IERC721FormValues {
  name: string;
  description: string;
  royalties: number;
  attributes: Array<IAssetAttribute>;
  image: File | null;
  imageObjectURL?: string;
  rar: File | null;
  putOnSale: boolean;
  unlockOncePurchased: boolean;
  lockedContent: string;
  instantSale: boolean;
  salePrice: number;
  saleToken: string;
  collectionId: string;
  include3DModel: boolean;
  model: File | null;
  modelObjectURL?: string;
}

interface IProps {
  className?: string;
  onSubmit: (values: IERC721FormValues) => void;
  onNewCollection: () => void;
  onNewGame: () => void;
}

export const ERC721CreateForm = (props: IProps) => {
  const classes = useStyles();
  const context = useConnectedWeb3Context();
  const {
    data: {
      price: {
        gswap: { usd: gswapPrice },
        shroom: { usd: shroomPrice },
        wavax: { usd: avaxPrice },
      },
    },
  } = useGlobal();

  const usdPrices = {
    gswap: gswapPrice,
    shroom: shroomPrice,
    wavax: avaxPrice,
  };

  const SALE_TOKENS: IToken[] = Object.keys(knownTokens).map((key) =>
    getToken(context.networkId || DEFAULT_NETWORK_ID, key as KnownToken)
  );

  const isWalletConnected = !!context.account;

  const initialFormValue: IERC721FormValues = {
    name: "",
    description: "",
    royalties: 10,
    attributes: [
      {
        key: "",
        value: "",
      },
    ],
    image: null,
    imageObjectURL: "",
    rar: null,
    unlockOncePurchased: false,
    lockedContent: "",
    putOnSale: false,
    instantSale: false,
    salePrice: 3,
    saleToken: "",
    collectionId: "",
    include3DModel: false,
    model: null,
    modelObjectURL: "",
  };

  return (
    <Formik
      initialValues={initialFormValue}
      onSubmit={async (values, { setErrors }) => {
        const {
          attributes,
          image,
          instantSale,
          lockedContent,
          putOnSale,
          saleToken,
          unlockOncePurchased,
        } = values;
        for (let index = 0; index < attributes.length - 1; index += 1) {
          const attribute = attributes[index];
          if (!attribute.key) {
            setErrors({
              attributes: `Attributes[${index}].key can't be empty!`,
            });
            return;
          }
          if (!attribute.value) {
            setErrors({
              attributes: `Attributes[${index}].value can't be empty!`,
            });
            return;
          }
        }
        if (putOnSale && instantSale) {
          if (!SALE_TOKENS.find((token) => token.address === saleToken)) {
            return setErrors({ saleToken: "Please select token!" });
          }
        }
        if (unlockOncePurchased && !lockedContent) {
          return setErrors({
            lockedContent: `"Locked content" is not allowed to be empty`,
          });
        }
        if (!image) {
          return setErrors({
            image: `"Image" is not allowed to be empty`,
          });
        }
        if (!isWalletConnected) {
          context.setWalletConnectModalOpened(true);
          return;
        }
        props.onSubmit(values);
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().required(),
        collectionId: Yup.string().required(),
        description: Yup.string(),
        royalties: Yup.number().required(),
        attributes: Yup.array(
          Yup.object().shape({
            key: Yup.string(),
            value: Yup.string(),
          })
        ),
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
            <div className={classes.left}>
              <FormImageUpload
                FormControlProps={{ fullWidth: true }}
                FormHelperTextProps={{
                  error: Boolean(touched.image && errors.image),
                }}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  id: "image",
                  name: "image",
                  onBlur: handleBlur,
                  onChange: (file: File | null) => {
                    setFieldValue("image", file);
                    if (values.imageObjectURL) {
                      URL.revokeObjectURL(values.imageObjectURL);
                    }
                    if (file) {
                      setFieldValue(
                        "imageObjectURL",
                        URL.createObjectURL(file)
                      );
                    } else {
                      setFieldValue("imageObjectURL", "");
                    }
                  },
                  placeholder:
                    "JPG, PNG, GIF, WEBP, MP4, or MP3. Max size 30mb.",
                  value: { file: values.image, fileURL: values.imageObjectURL },
                }}
                helperText={touched.image && errors.image}
                label="Upload file"
              />
              <FormSwitchField
                FormControlProps={{ fullWidth: true }}
                InputLabelProps={{ htmlFor: "putOnSale", shrink: true }}
                InputProps={{
                  id: "putOnSale",
                  name: "putOnSale",
                  onBlur: handleBlur,
                  onChange: handleChange,
                  checked: values.putOnSale,
                }}
                label="Put on sale"
                subLabel="You'll receive bids for this item"
              />
              {values.putOnSale && (
                <>
                  <FormSwitchField
                    FormControlProps={{ fullWidth: true }}
                    InputLabelProps={{ htmlFor: "instantSale", shrink: true }}
                    InputProps={{
                      id: "instantSale",
                      name: "instantSale",
                      onBlur: handleBlur,
                      onChange: handleChange,
                      checked: values.instantSale,
                    }}
                    label="Instant sale price"
                    subLabel="Price for which the item would be instantly sold"
                  />
                  {values.instantSale && (
                    <>
                      <FormTextField
                        FormControlProps={{ fullWidth: true }}
                        FormHelperTextProps={{
                          error: Boolean(
                            touched.salePrice &&
                              (!values.salePrice || !values.saleToken)
                          ),
                        }}
                        InputLabelProps={{ htmlFor: "salePrice", shrink: true }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Select
                                name="saleToken"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.saleToken}
                              >
                                {SALE_TOKENS.map((e) => (
                                  <MenuItem key={e.address} value={e.address}>
                                    {e.symbol}
                                  </MenuItem>
                                ))}
                              </Select>
                            </InputAdornment>
                          ),
                          id: "salePrice",
                          name: "salePrice",
                          onBlur: handleBlur,
                          onChange: handleChange,
                          placeholder: "Enter price for one item",
                          value: values.salePrice,
                          type: "number",
                        }}
                        helperText={
                          touched.salePrice &&
                          (!values.salePrice
                            ? "Sale price can't be 0"
                            : !values.saleToken
                            ? "Please select token!"
                            : "")
                        }
                      />
                      <Typography className={classes.notice}>
                        Service fee {SERVICE_FEE_IN_PERCENT}%
                      </Typography>
                      {values.saleToken &&
                        SALE_TOKENS.find(
                          (token) => token.address === values.saleToken
                        ) && (
                          <Typography
                            className={classes.notice}
                            component="div"
                          >
                            You will receive {values.salePrice}
                            {
                              SALE_TOKENS.find(
                                (token) => token.address === values.saleToken
                              )?.symbol
                            }
                            &nbsp;$
                            {Number(
                              values.salePrice *
                                usdPrices[
                                  SALE_TOKENS.find(
                                    (token) =>
                                      token.address === values.saleToken
                                  )?.symbol.toLowerCase() as KnownToken
                                ] *
                                (1 - SERVICE_FEE)
                            ).toFixed(2)}
                          </Typography>
                        )}
                    </>
                  )}
                </>
              )}

              <FormSwitchField
                FormControlProps={{ fullWidth: true }}
                InputLabelProps={{
                  htmlFor: "unlockOncePurchased",
                  shrink: true,
                }}
                InputProps={{
                  id: "unlockOncePurchased",
                  name: "unlockOncePurchased",
                  onBlur: handleBlur,
                  onChange: handleChange,
                  checked: values.unlockOncePurchased,
                }}
                label="Unlockable content"
                subLabel="Content will be unlocked after the item is bought"
              />

              {values.unlockOncePurchased && (
                <FormTextField
                  FormControlProps={{ fullWidth: true }}
                  FormHelperTextProps={{
                    error: Boolean(
                      touched.lockedContent && !values.lockedContent
                    ),
                  }}
                  InputLabelProps={{ htmlFor: "lockedContent", shrink: true }}
                  InputProps={{
                    id: "lockedContent",
                    name: "lockedContent",
                    onBlur: handleBlur,
                    onChange: handleChange,
                    placeholder: "",
                    value: values.lockedContent,
                    multiline: true,
                  }}
                  helperText={
                    touched.lockedContent && !values.lockedContent
                      ? "'Locked content' can't be empty"
                      : "Markdown syntax is supported"
                  }
                  label="Game license, digital key, code to redeem or link to a file..."
                />
              )}

              <FormCollectionChoose
                collectionId={values.collectionId}
                comment="Choose collection"
                onChange={(value) => {
                  setFieldValue("collectionId", value);
                }}
                onNewCollection={props.onNewCollection}
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
                  placeholder: `e.g. "Premium Weapon Skin"`,
                  value: values.name,
                }}
                helperText={touched.name && errors.name}
                label="Name"
              />
              <FormTextField
                FormControlProps={{ fullWidth: true }}
                InputLabelProps={{ htmlFor: "description", shrink: true }}
                InputProps={{
                  id: "description",
                  name: "description",
                  onBlur: handleBlur,
                  onChange: handleChange,
                  placeholder: `Add a description about this item`,
                  value: values.description,
                  multiline: true,
                }}
                helperText="With preserved line-breaks"
                label="Description"
                optional
              />
              <FormTextField
                FormControlProps={{ fullWidth: true }}
                InputLabelProps={{ htmlFor: "royalties", shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                  id: "royalties",
                  name: "royalties",
                  onBlur: handleBlur,
                  onChange: handleChange,
                  placeholder: `E.g. 10%"`,
                  type: "number",
                  value: values.royalties,
                }}
                helperText="Suggested: 10%, 20%, 30%"
                label="Royalties"
              />
              <FormAttributesField
                FormControlProps={{ fullWidth: true }}
                InputLabelProps={{ shrink: true }}
                attributes={values.attributes}
                helperText={touched.attributes && errors.attributes}
                label="Properties"
                onChange={(
                  attributes: Array<{ key: string; value: string }>
                ) => {
                  setFieldValue("attributes", attributes);
                }}
                optional
              />
              <FormSwitchField
                FormControlProps={{ fullWidth: true }}
                InputLabelProps={{
                  htmlFor: "include3DModel",
                  shrink: true,
                }}
                InputProps={{
                  id: "include3DModel",
                  name: "include3DModel",
                  onBlur: handleBlur,
                  onChange: handleChange,
                  checked: values.include3DModel,
                }}
                label="Include 3D Model"
                subLabel="You can upload glb file here"
              />
              {values.include3DModel && values.modelObjectURL && (
                <div className={classes.modelWrapper}>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/** @ts-ignore */}
                  <model-viewer
                    auto-rotate
                    camera-controls
                    src={values.modelObjectURL}
                  />
                </div>
              )}
              {values.include3DModel && (
                <FormModelUpload
                  FormControlProps={{ fullWidth: true }}
                  FormHelperTextProps={{
                    error: Boolean(touched.model && errors.model),
                  }}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    id: "model",
                    name: "model",
                    onBlur: handleBlur,
                    onChange: (file: File | null) => {
                      setFieldValue("model", file);
                      if (values.modelObjectURL) {
                        URL.revokeObjectURL(values.modelObjectURL);
                      }
                      if (file) {
                        setFieldValue(
                          "modelObjectURL",
                          URL.createObjectURL(file)
                        );
                      } else {
                        setFieldValue("modelObjectURL", "");
                      }
                    },
                    placeholder: "*.glb model file",
                    value: {
                      file: values.model,
                      fileURL: values.modelObjectURL,
                    },
                  }}
                  helperText={touched.model && errors.model}
                  label="Upload 3D Object file"
                />
              )}
              <Button
                className={clsx(classes.button)}
                color="primary"
                disabled={!isValid || isSubmitting}
                type="submit"
                variant="contained"
              >
                {isWalletConnected ? "Create" : "Connect wallet and create"}
              </Button>
            </div>
            <div className={classes.right}>
              <ERC721Preview
                data={{
                  ...values,
                  saleToken:
                    SALE_TOKENS.find(
                      (token) => token.address === values.saleToken
                    )?.symbol || "",
                }}
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
