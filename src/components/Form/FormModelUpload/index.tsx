import {
  Box,
  FormControl,
  FormControlProps,
  FormHelperText,
  FormHelperTextProps,
  IconButton,
  InputLabelProps,
  LinearProgress,
  Typography,
  makeStyles,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import clsx from "clsx";
import { ASSET_IMAGE_FILE_SIZE_LIMIT } from "config/constants";
import { useSnackbar } from "notistack";
import React from "react";
import { getFileType } from "utils/asset";
import { EFileType } from "utils/enums";

import { FormInputLabel } from "../FormInputLabel";

const useStyles = makeStyles((theme) => ({
  root: {},
  input: {
    display: "none",
  },
  content: {
    borderRadius: 4,
    backgroundColor: theme.colors.primary85,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2.5),
  },
  selector: {
    textAlign: "center",
  },
  selectorComment: {
    fontSize: theme.spacing(2),
    color: theme.colors.primary60,
    textAlign: "center",
  },
  selectorButton: {
    width: theme.spacing(20),
    height: theme.spacing(5),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.purple60,
    borderRadius: 6,
    color: theme.colors.white,
    cursor: "pointer",
    userSelect: "none",
    margin: "auto",
    marginTop: theme.spacing(2.5),
    transition: "all 0.4s",
    "&:hover": {
      backgroundColor: theme.colors.purple40,
    },
  },
  result: {
    position: "relative",
    minHeight: 70,
    display: "flex",
    alignItems: "center",
  },
  resultText: {
    color: theme.colors.white,
    marginRight: 40,
  },
  removeButton: {
    position: "absolute",
    right: theme.spacing(1.5),
    top: theme.spacing(1.5),
    border: `1px solid ${theme.colors.white}`,
    color: theme.colors.white,
    padding: 4,
  },
  progressWrapper: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: theme.spacing(4),
  },
}));

interface InputProps {
  id: string;
  name: string;
  value: {
    file: File | null;
    fileURL?: string;
  };
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
  loading?: boolean;
}

export const FormModelUpload = (props: IProps) => {
  const {
    InputProps: { onChange, placeholder, value, ...restInputProps },
    className,
    helperText,
    loading = false,
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
    if (loading) {
      return (
        <div className={classes.result}>
          <div className={classes.progressWrapper}>
            <Box width={250}>
              <LinearProgress />
            </Box>
          </div>
        </div>
      );
    }

    if (!value.file || !value.fileURL) return null;

    return (
      <div className={classes.result}>
        <Typography className={classes.resultText}>
          {value.file.name}
        </Typography>
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
      if (event.target.files[0].size > ASSET_IMAGE_FILE_SIZE_LIMIT) {
        return enqueueSnackbar("File size is larger than 30MG", {
          variant: "warning",
        });
      }
      onChange(event.target.files[0]);

      (event.target as any).value = null;
    }
  };

  return (
    <FormControl
      className={clsx(classes.root, className)}
      {...props.FormControlProps}
    >
      <FormInputLabel title={props.label} {...props.InputLabelProps} />
      <input
        accept=".glb"
        className={classes.input}
        onChange={onChangeFiles}
        type="file"
        {...restInputProps}
      />
      <div className={classes.content}>
        {value.file ? renderContent() : renderSelector()}
      </div>
      {helperText && (
        <FormHelperText {...props.FormHelperTextProps}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};
