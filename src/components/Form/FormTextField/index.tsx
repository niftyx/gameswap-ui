import {
  FormControl,
  FormControlProps,
  FormHelperText,
  FormHelperTextProps,
  Input,
  InputLabelProps,
  InputProps,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";

import { FormInputLabel } from "../FormInputLabel";

const useStyles = makeStyles(() => ({
  root: {},
}));

interface IProps {
  optional?: boolean;
  className?: string;
  FormControlProps: FormControlProps;
  InputLabelProps: InputLabelProps;
  InputProps: InputProps;
  FormHelperTextProps?: FormHelperTextProps;
  label?: string;
  helperText?: string | false | undefined;
}

export const FormTextField = (props: IProps) => {
  const { className, helperText, optional = false } = props;
  const classes = useStyles();
  return (
    <FormControl
      className={clsx(classes.root, className)}
      {...props.FormControlProps}
    >
      {props.label && (
        <FormInputLabel
          optional={optional}
          title={props.label}
          {...props.InputLabelProps}
        />
      )}
      <Input {...props.InputProps} />
      {helperText && (
        <FormHelperText {...props.FormHelperTextProps}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};
