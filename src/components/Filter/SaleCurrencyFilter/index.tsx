import {
  Button,
  Checkbox,
  FormControlLabel,
  makeStyles,
} from "@material-ui/core";
import clsx from "classnames";
import { knownTokens } from "config/networks";
import { transparentize } from "polished";
import React from "react";
import { KnownToken } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {},
  formControl: {
    marginTop: 4,
    marginLeft: 0,
    width: "100%",
  },
  label: {
    color: transparentize(0.4, theme.colors.text.default),
  },
  iconButton: {
    padding: 0,
    paddingRight: 8,
  },
}));

interface IProps {
  currencies: KnownToken[];
  onChange: (_: KnownToken[]) => void;
  className?: string;
}

export const SaleCurrencyFilter = (props: IProps) => {
  const classes = useStyles();
  const { currencies, onChange } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      {Object.keys(knownTokens).map((token) => {
        const tokenId = token as KnownToken;
        const isSelected = currencies.includes(tokenId);
        const tokenInfo = knownTokens[tokenId];

        return (
          <FormControlLabel
            classes={{ label: classes.label, root: classes.formControl }}
            control={
              <Checkbox
                checked={isSelected}
                classes={{ root: classes.iconButton }}
                name={tokenInfo.symbol}
                onChange={(event) => {
                  const { checked } = event.target;
                  if (checked) {
                    onChange([...currencies, tokenId]);
                  } else {
                    onChange(currencies.filter((c) => c !== tokenId));
                  }
                }}
              />
            }
            key={token}
            label={tokenInfo.symbol}
          />
        );
      })}
    </div>
  );
};
