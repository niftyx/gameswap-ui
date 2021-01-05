import {
  Button,
  InputAdornment,
  MenuItem,
  Select,
  Typography,
  makeStyles,
} from "@material-ui/core";
import clsx from "classnames";
import {
  FormAttributesField,
  FormImageUpload,
  FormSwitchField,
  FormTextField,
} from "components";
import { SERVICE_FEE, SERVICE_FEE_IN_PERCENT } from "config/constants";
import { getToken, knownTokens } from "config/networks";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { Form, Formik } from "formik";
import React from "react";
import { IToken, KnownToken } from "utils/types";
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
    borderRadius: theme.spacing(3),
    marginTop: theme.spacing(5),
  },
}));

export interface IFormValues {
  name: string;
  description: string;
  royalties: number;
  attributes: Array<{ key: string; value: string }>;
  image: string;
  instantSale: boolean;
  salePrice: number;
  saleToken: string;
}

interface IProps {
  className?: string;
  onSubmit: (values: IFormValues) => void;
}

export const ERC721CreateForm = (props: IProps) => {
  const classes = useStyles();
  const context = useConnectedWeb3Context();
  const {
    data: {
      price: {
        gswap: { usd: gswapPrice },
        weth: { usd: wethPrice },
      },
    },
  } = useGlobal();

  const usdPrices = {
    weth: wethPrice,
    gswap: gswapPrice,
  };

  const SALE_TOKENS: IToken[] = Object.keys(knownTokens).map((key) =>
    getToken(context.networkId || 1, key as KnownToken)
  );

  const isWalletConnected = !!context.account;

  const initialFormValue: IFormValues = {
    name: "",
    description: "",
    royalties: 10,
    attributes: [
      {
        key: "",
        value: "",
      },
    ],
    image: "",
    instantSale: false,
    salePrice: 3,
    saleToken: "",
  };

  return (
    <Formik
      initialValues={initialFormValue}
      onSubmit={async (values, { setErrors }) => {
        const { attributes } = values;
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
        props.onSubmit(values);
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().required(),
        description: Yup.string(),
        royalties: Yup.number().required(),
        attributes: Yup.array(
          Yup.object().shape({
            key: Yup.string(),
            value: Yup.string(),
          })
        ),
        image: Yup.string().required(),
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
                  onChange: (base64: string) => {
                    setFieldValue("image", base64);
                  },
                  placeholder:
                    "JPG, PNG, GIF, WEBP, MP4 or MP3. Max size 30mb.",
                  value: values.image,
                }}
                helperText={touched.image && errors.image}
                label="Upload file"
              />
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
                subLabel="Enter the price for which the item will be instantly sold"
              />
              {values.instantSale && (
                <>
                  <FormTextField
                    FormControlProps={{ fullWidth: true }}
                    FormHelperTextProps={{
                      error: Boolean(touched.salePrice && !values.salePrice),
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
                      placeholder: "Enter price for one piece",
                      value: values.salePrice,
                      type: "number",
                    }}
                    helperText={
                      touched.salePrice &&
                      !values.salePrice &&
                      "SalesPrice can't be equal 0"
                    }
                  />
                  <Typography className={classes.notice}>
                    Service fee {SERVICE_FEE_IN_PERCENT}%
                  </Typography>
                  {values.saleToken && (
                    <Typography className={classes.notice} component="div">
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
                              (token) => token.address === values.saleToken
                            )?.symbol.toLowerCase() as KnownToken
                          ] *
                          (1 - SERVICE_FEE)
                      ).toFixed(2)}
                    </Typography>
                  )}
                </>
              )}
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
                  placeholder: `e.g. "Redeemable T-Shirt with logo"`,
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
                  placeholder: `e.g. "After purchasing you'll be able to get the real T-Shirt"`,
                  value: values.description,
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
              <Button
                className={clsx(classes.button)}
                color="primary"
                disabled={!isValid || isSubmitting || !isWalletConnected}
                type="submit"
                variant="contained"
              >
                {isWalletConnected ? "Create item" : "Please Connect Wallet"}
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
