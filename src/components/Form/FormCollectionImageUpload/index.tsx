import {
  Avatar,
  CircularProgress,
  FormControl,
  FormControlProps,
  FormHelperText,
  FormHelperTextProps,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { ReactComponent as ImagePlusIcon } from "assets/svgs/image-plus.svg";
import clsx from "clsx";
import { ASSET_IMAGE_FILE_SIZE_LIMIT } from "config/constants";
import { useSnackbar } from "notistack";
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
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "& svg": {
      width: 50,
      height: 50,
    },
  },
  right: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  label: {
    fontSize: theme.spacing(1.875),
    color: theme.colors.white,
  },
  button: {
    height: theme.spacing(5),
    borderRadius: 6,
    marginTop: theme.spacing(2),
    backgroundColor: theme.colors.primary60,
    color: theme.colors.white,
    transition: "all 0.3s",
    cursor: "pointer",
    "&:hover": {
      opacity: 0.7,
    },
    padding: "0 28px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 160,
  },
  circle: {
    color: theme.colors.white,
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
  FormHelperTextProps?: FormHelperTextProps;
  FormControlProps: FormControlProps;
  InputProps: InputProps;
  imageUrl: string;
  loading: boolean;
  helperText?: string | false | undefined;
}

export const FormCollectionImageUpload = (props: IProps) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    InputProps: { onChange, value, ...restInputProps },
    className,
    helperText,
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
      (event.target as any).value = null;
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
          <Avatar className={classes.avatar} src={imageUrl} variant="rounded" />
        ) : (
          <div className={classes.avatar}>
            <ImagePlusIcon />
          </div>
        )}
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
              "Choose File"
            )}
          </label>
        </div>
      </div>
      {helperText && (
        <FormHelperText {...props.FormHelperTextProps}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};
