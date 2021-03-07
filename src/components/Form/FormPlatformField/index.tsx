import {
  FormControl,
  FormControlProps,
  FormHelperText,
  Grid,
  InputLabelProps,
  TextField,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import { FormikErrors } from "formik";
import React from "react";

import { FormInputLabel } from "../FormInputLabel";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    marginTop: theme.spacing(4),
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

interface IProps {
  optional?: boolean;
  className?: string;
  FormControlProps: FormControlProps;
  InputLabelProps: InputLabelProps;
  label: string;
  helperText?:
    | string
    | string[]
    | FormikErrors<{ os: string; version: string }>[]
    | undefined;
  platforms: Array<{ os: string; version: string }>;
  onChange: (platforms: Array<{ os: string; version: string }>) => void;
}

export const FormPlatformField = (props: IProps) => {
  const {
    className,
    helperText,
    onChange,
    optional = false,
    platforms,
  } = props;
  const classes = useStyles();
  return (
    <FormControl
      className={clsx(classes.root, className)}
      {...props.FormControlProps}
    >
      <FormInputLabel
        optional={optional}
        title={props.label}
        {...props.InputLabelProps}
      />
      <div className={classes.content}>
        {platforms.map((attribute, index) => {
          const isLastOne = index === platforms.length - 1;
          return (
            <Grid container key={index} spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  onChange={(event) => {
                    const { value } = event.target;
                    if (value) {
                      if (isLastOne) {
                        onChange([
                          ...platforms.map((ele, eIndex) =>
                            eIndex !== index ? ele : { ...ele, os: value }
                          ),
                          { os: "", version: "" },
                        ]);
                      } else {
                        onChange(
                          platforms.map((ele, eIndex) =>
                            eIndex !== index ? ele : { ...ele, os: value }
                          )
                        );
                      }
                    } else {
                      if (!attribute.version) {
                        onChange(
                          platforms.filter((_, eIndex) => index !== eIndex)
                        );
                      } else {
                        onChange(
                          platforms.map((ele, eIndex) =>
                            eIndex !== index ? ele : { ...ele, os: value }
                          )
                        );
                      }
                    }
                  }}
                  placeholder="Enter OS"
                  value={attribute.os}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  onChange={(event) => {
                    const { value } = event.target;
                    if (value) {
                      if (isLastOne) {
                        onChange([
                          ...platforms.map((ele, eIndex) =>
                            eIndex !== index ? ele : { ...ele, version: value }
                          ),
                          { os: "", version: "" },
                        ]);
                      } else {
                        onChange(
                          platforms.map((ele, eIndex) =>
                            eIndex !== index ? ele : { ...ele, version: value }
                          )
                        );
                      }
                    } else {
                      if (!attribute.os) {
                        onChange(
                          platforms.filter((_, eIndex) => index !== eIndex)
                        );
                      } else {
                        onChange(
                          platforms.map((ele, eIndex) =>
                            eIndex !== index ? ele : { ...ele, version: value }
                          )
                        );
                      }
                    }
                  }}
                  placeholder="Enter version"
                  value={attribute.version}
                />
              </Grid>
            </Grid>
          );
        })}
      </div>

      {helperText && <FormHelperText error>{helperText}</FormHelperText>}
    </FormControl>
  );
};
