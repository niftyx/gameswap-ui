import {
  Avatar,
  CircularProgress,
  FormControl,
  FormControlProps,
  Typography,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import { ASSET_IMAGE_FILE_SIZE_LIMIT } from "config/constants";
import { useSnackbar } from "notistack";
import React from "react";
import Identicon from "react-identicons";

const IdenticonComponent = Identicon as any;
const AVATAR_SIZE = 100;

const useStyles = makeStyles((theme) => ({
  root: {},
  input: {
    display: "none",
  },
  content: { textAlign: "center" },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: "50%",
    margin: "auto",
    overflow: "hidden",
  },
  label: {
    marginTop: 16,
    fontSize: 14,
    color: theme.colors.text.seventh,
  },
  button: {
    borderRadius: 6,
    height: theme.spacing(5),
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
  address: string;
}

export const FormSettingsAvatarUpload = (props: IProps) => {
  const {
    InputProps: { onChange, value, ...restInputProps },
    address,
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
        {imageUrl ? (
          <Avatar className={classes.avatar} src={imageUrl} />
        ) : (
          <div className={classes.avatar}>
            <IdenticonComponent bg="#fff" size={AVATAR_SIZE} string={address} />
          </div>
        )}

        <Typography align="center" className={classes.label} component="div">
          We recommend an image of at least 400x400. Gifs work too.
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
    </FormControl>
  );
};
