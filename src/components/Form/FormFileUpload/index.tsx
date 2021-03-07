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
import clsx from "clsx";
import { ASSET_ZIP_FILE_SIZE_LIMIT } from "config/constants";
import { useSnackbar } from "notistack";
import { transparentize } from "polished";
import React from "react";
import { bytesToSize } from "utils/asset";

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
    borderRadius: 6,
    color: theme.colors.text.default,
    cursor: "pointer",
    userSelect: "none",
    margin: "auto",
    marginTop: theme.spacing(2.5),
  },
  result: {
    position: "relative",
  },
  fileInfo: {
    color: theme.colors.text.default,
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
  value: File | null;
  placeholder?: string;
  onBlur: (e: React.FocusEvent<any>) => void;
  onChange: (_: File | null) => void;
}

interface IProps {
  className?: string;
  FormControlProps: FormControlProps;
  InputLabelProps: InputLabelProps;
  InputProps: InputProps;
  FormHelperTextProps?: FormHelperTextProps;
  label: string;
  helperText?: string | false | undefined;
  accept?: string;
}

export const FormFileUpload = (props: IProps) => {
  const {
    InputProps: { onChange, placeholder, value, ...restInputProps },
    accept = "*",
    className,
    helperText,
  } = props;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

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

  const renderContent = () => {
    if (!value) return null;

    return (
      <div className={classes.result}>
        <div className={classes.fileInfo}>
          <Typography>{value.name}</Typography>
          <Typography>{value.type}</Typography>
          <Typography>{bytesToSize(value.size)}</Typography>
        </div>
        <IconButton
          className={classes.removeButton}
          onClick={() => onChange(null)}
        >
          <CloseIcon />
        </IconButton>
      </div>
    );
  };

  const onChangeFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      if (event.target.files[0].size > ASSET_ZIP_FILE_SIZE_LIMIT) {
        return enqueueSnackbar("File size is larger than 200MG", {
          variant: "warning",
        });
      }
      onChange(event.target.files[0]);
    }
  };

  return (
    <FormControl
      className={clsx(classes.root, className)}
      {...props.FormControlProps}
    >
      <FormInputLabel title={props.label} {...props.InputLabelProps} />
      <input
        accept={accept}
        className={classes.input}
        onChange={onChangeFiles}
        type="file"
        {...restInputProps}
      />
      <div className={classes.content}>
        {value ? renderContent() : renderSelector()}
      </div>
      {helperText && (
        <FormHelperText {...props.FormHelperTextProps}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};
