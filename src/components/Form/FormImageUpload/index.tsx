import {
  FormControl,
  FormControlProps,
  FormHelperText,
  FormHelperTextProps,
  IconButton,
  InputLabelProps,
  Typography,
  makeStyles,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import clsx from "classnames";
import { transparentize } from "polished";
import React from "react";

import { FormInputLabel } from "../FormInputLabel";

const useStyles = makeStyles((theme) => ({
  root: {},
  input: {
    display: "none",
  },
  content: {
    borderRadius: theme.spacing(2),
    border: `1px dashed ${theme.colors.border.third}`,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2.5),
  },
  selector: {
    textAlign: "center",
  },
  selectorComment: {
    fontSize: theme.spacing(2),
    color: theme.colors.text.seventh,
    textAlign: "center",
  },
  selectorButton: {
    width: theme.spacing(20),
    height: theme.spacing(5),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: transparentize(0.6, theme.colors.background.fourth),
    borderRadius: theme.spacing(2),
    color: theme.colors.text.default,
    cursor: "pointer",
    userSelect: "none",
    margin: "auto",
    marginTop: theme.spacing(2.5),
  },
  result: {
    position: "relative",
  },
  image: {
    width: "100%",
  },
  removeButton: {
    position: "absolute",
    right: theme.spacing(2),
    top: theme.spacing(2),
    border: `1px solid ${theme.colors.text.default}`,
    color: theme.colors.text.default,
  },
}));

interface InputProps {
  id: string;
  name: string;
  value: string;
  placeholder?: string;
  onBlur: (e: React.FocusEvent<any>) => void;
  onChange: (_: string) => void;
}

interface IProps {
  className?: string;
  FormControlProps: FormControlProps;
  InputLabelProps: InputLabelProps;
  InputProps: InputProps;
  FormHelperTextProps?: FormHelperTextProps;
  label: string;
  helperText?: string | false | undefined;
}

export const FormImageUpload = (props: IProps) => {
  const {
    InputProps: { onChange, placeholder, value, ...restInputProps },
    className,
    helperText,
  } = props;
  const classes = useStyles();

  const renderSelector = () => {
    return (
      <div className={classes.selector}>
        <Typography className={classes.selectorComment}>
          {placeholder}
        </Typography>
        <label className={classes.selectorButton} htmlFor={props.InputProps.id}>
          Choose File
        </label>
      </div>
    );
  };

  const renderImage = () => {
    return (
      <div className={classes.result}>
        <img alt="img" className={classes.image} src={value} />
        <IconButton
          className={classes.removeButton}
          onClick={() => onChange("")}
        >
          <CloseIcon />
        </IconButton>
      </div>
    );
  };

  const onChangeFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files?.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) onChange(reader.result?.toString());
        event.target.value = "";
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <FormControl
      className={clsx(classes.root, className)}
      {...props.FormControlProps}
    >
      <FormInputLabel title={props.label} {...props.InputLabelProps} />
      <input
        accept="image/*"
        className={classes.input}
        onChange={onChangeFiles}
        type="file"
        {...restInputProps}
      />
      <div className={classes.content}>
        {value ? renderImage() : renderSelector()}
      </div>
      {helperText && (
        <FormHelperText {...props.FormHelperTextProps}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};
