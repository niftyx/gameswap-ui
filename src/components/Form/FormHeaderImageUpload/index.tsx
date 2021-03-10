import {
  Box,
  FormControl,
  FormControlProps,
  FormHelperText,
  FormHelperTextProps,
  LinearProgress,
  makeStyles,
} from "@material-ui/core";
import CameraEnhanceOutlinedIcon from "@material-ui/icons/CameraEnhanceOutlined";
import CloseIcon from "@material-ui/icons/Close";
import clsx from "clsx";
import { ASSET_IMAGE_FILE_SIZE_LIMIT } from "config/constants";
import { useSnackbar } from "notistack";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
  input: {
    display: "none",
  },
  content: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.spacing(0.5),
    border: `1px dashed ${theme.colors.border.third}`,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2.5),
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: 150,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  selector: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& > * + *": {
      marginLeft: 16,
    },
  },
  selectorButton: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    color: theme.colors.text.default,
    cursor: "pointer",
    userSelect: "none",
    border: `1px dashed ${theme.colors.transparent}`,
    transition: "all 0.5s",
    "&:hover": {
      borderColor: theme.colors.text.default,
    },
  },
  progressWrapper: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(3),
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
  InputProps: InputProps;
  FormHelperTextProps?: FormHelperTextProps;
  helperText?: string | false | undefined;
  loading?: boolean;
}

export const FormHeaderImageUpload = (props: IProps) => {
  const {
    InputProps: { onChange, value, ...restInputProps },
    className,
    helperText,
    loading = false,
  } = props;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const renderSelector = () => {
    return (
      <div className={classes.selector}>
        <label className={classes.selectorButton} htmlFor={props.InputProps.id}>
          <CameraEnhanceOutlinedIcon />
        </label>
        <span className={classes.selectorButton} onClick={() => onChange(null)}>
          <CloseIcon />
        </span>
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
      <input
        accept="image/png,image/jpeg,image/gif,image/webp"
        className={classes.input}
        onChange={onChangeFiles}
        type="file"
        {...restInputProps}
      />
      <div
        className={classes.content}
        style={{
          backgroundImage: value.fileURL ? `url(${value.fileURL})` : "",
        }}
      >
        {loading && (
          <div className={classes.progressWrapper}>
            <Box width={250}>
              <LinearProgress />
            </Box>
          </div>
        )}
        {renderSelector()}
      </div>
      {helperText && (
        <FormHelperText {...props.FormHelperTextProps}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};
