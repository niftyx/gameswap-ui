import {
  InputAdornment,
  MenuItem,
  Select,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import { FormTextField } from "components";
import { getToken, knownTokens } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { BigNumber, ethers } from "packages/ethers";
import React, { useEffect, useState } from "react";
import { IToken, ITokenAmount, KnownToken } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {},
  select: {
    minWidth: 100,
  },
  input: {
    backgroundColor: theme.colors.primary90,
    padding: "8px 12px",
  },
  icon: { width: 20, height: 20 },
}));

interface IProps {
  value: {
    amount: BigNumber;
    token: IToken;
  };
  onChange: (_: ITokenAmount) => void;
  className?: string;
}

export const TokenAmountInput = (props: IProps) => {
  const classes = useStyles();
  const context = useConnectedWeb3Context();
  const [currentValue, setCurrentValue] = useState("");

  const { onChange, value } = props;
  const {
    token: { decimals },
  } = value;

  useEffect(() => {
    if (!value) {
      setCurrentValue(() => "");
    } else if (
      value &&
      !ethers.utils.parseUnits(currentValue || "0", decimals).eq(value.amount)
    ) {
      setCurrentValue(() => ethers.utils.formatUnits(value.amount, decimals));
    }
    // eslint-disable-next-line
  }, [value.amount, value.token.decimals, currentValue]);

  const SALE_TOKENS: IToken[] = Object.keys(knownTokens).map((key) =>
    getToken(key as KnownToken, context.networkId)
  );

  const onChangeAmount = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { value: inputValue } = e.target;
    if (!inputValue) {
      onChange({ ...value, amount: BigNumber.from(0) });
    } else {
      const newValue = ethers.utils.parseUnits(
        inputValue,
        value.token.decimals
      );
      onChange({ ...value, amount: newValue });
    }
    setCurrentValue(() => inputValue);
  };

  const onChangeToken = (
    e: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    const {
      target: { value: tokenAddress },
    } = e;
    const token = SALE_TOKENS.find((token) => token.address === tokenAddress);
    if (token) {
      onChange({ ...value, token });
    }
  };

  return (
    <FormTextField
      FormControlProps={{ fullWidth: true, variant: "filled" }}
      InputLabelProps={{ htmlFor: "salePrice", shrink: true }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Select
              className={classes.select}
              disableUnderline
              name="saleToken"
              onChange={onChangeToken}
              value={value.token.address}
            >
              {SALE_TOKENS.map((e) => (
                <MenuItem key={e.address} value={e.address}>
                  {/* <img
                    alt="logo"
                    className={classes.icon}
                    src={e.image || ""}
                  /> */}
                  {e.symbol}
                </MenuItem>
              ))}
            </Select>
          </InputAdornment>
        ),
        id: "salePrice",
        name: "salePrice",
        onChange: onChangeAmount,
        placeholder: "Enter price",
        value: currentValue,
        type: "number",
        disableUnderline: true,
        className: classes.input,
      }}
      className={clsx(classes.root, props.className)}
    />
  );
};
