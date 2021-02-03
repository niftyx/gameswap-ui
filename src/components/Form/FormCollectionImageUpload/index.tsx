import {
  Avatar,
  Button,
  CircularProgress,
  FormControl,
  FormControlProps,
  Typography,
  makeStyles,
} from "@material-ui/core";
import clsx from "classnames";
import { ASSET_IMAGE_FILE_SIZE_LIMIT } from "config/constants";
import { useSnackbar } from "notistack";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
  input: {
    display: "none",
  },
  content: { display: "flex" },
  avatar: {
    width: 100,
    height: 100,
    marginRight: 16,
  },
  right: {
    flex: 1,
  },
  label: {
    fontSize: theme.spacing(1.875),
    color: theme.colors.text.seventh,
  },
  button: {
    height: theme.spacing(5),
    borderRadius: theme.spacing(2.5),
    marginTop: theme.spacing(2),
    backgroundColor: theme.colors.background.fourth,
    color: theme.colors.text.default,
    transition: "all 0.3s",
    cursor: "pointer",
    "&:hover": {
      opacity: 0.7,
    },
    padding: "0 28px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
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
  InputProps: InputProps;
  imageUrl: string;
  loading: boolean;
}

export const FormCollectionImageUpload = (props: IProps) => {
  const {
    InputProps: { onChange, value, ...restInputProps },
    className,
    imageUrl,
    loading,
  } = props;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const onChangeFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      if (event.target.files[0].size > ASSET_IMAGE_FILE_SIZE_LIMIT) {
        return enqueueSnackbar("File size is larger than 30MG", {
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
      <input
        accept="image/*"
        className={classes.input}
        onChange={onChangeFiles}
        type="file"
        {...restInputProps}
      />
      <div className={classes.content}>
        <Avatar className={classes.avatar} src={imageUrl} />
        <div className={classes.right}>
          <Typography className={classes.label} component="div">
            We recommend an image of at least 400x400.
          </Typography>
          <label
            className={classes.button}
            htmlFor={loading ? "" : props.InputProps.id}
          >
            {loading ? (
              <CircularProgress className={classes.circle} size={20} />
            ) : (
              "Upload"
            )}
          </label>
        </div>
      </div>
    </FormControl>
  );
};