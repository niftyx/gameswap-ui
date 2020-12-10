import {
  FormControl,
  FormControlProps,
  FormHelperText,
  FormHelperTextProps,
  Grid,
  Input,
  InputLabelProps,
  InputProps,
  TextField,
  makeStyles,
} from "@material-ui/core";
import clsx from "classnames";
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
    | FormikErrors<{ key: string; value: string }>[]
    | undefined;
  attributes: Array<{ key: string; value: string }>;
  onChange: (attributes: Array<{ key: string; value: string }>) => void;
}

export const FormAttributesField = (props: IProps) => {
  const {
    attributes,
    className,
    helperText,
    onChange,
    optional = false,
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
        {attributes.map((attribute, index) => {
          const isLastOne = index === attributes.length - 1;
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
                          ...attributes.map((ele, eIndex) =>
                            eIndex !== index ? ele : { ...ele, key: value }
                          ),
                          { key: "", value: "" },
                        ]);
                      } else {
                        onChange(
                          attributes.map((ele, eIndex) =>
                            eIndex !== index ? ele : { ...ele, key: value }
                          )
                        );
                      }
                    } else {
                      if (!attribute.value) {
                        onChange(
                          attributes.filter((_, eIndex) => index !== eIndex)
                        );
                      } else {
                        onChange(
                          attributes.map((ele, eIndex) =>
                            eIndex !== index ? ele : { ...ele, key: value }
                          )
                        );
                      }
                    }
                  }}
                  placeholder="Enter key"
                  value={attribute.key}
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
                          ...attributes.map((ele, eIndex) =>
                            eIndex !== index ? ele : { ...ele, value }
                          ),
                          { key: "", value: "" },
                        ]);
                      } else {
                        onChange(
                          attributes.map((ele, eIndex) =>
                            eIndex !== index ? ele : { ...ele, value: value }
                          )
                        );
                      }
                    } else {
                      if (!attribute.key) {
                        onChange(
                          attributes.filter((_, eIndex) => index !== eIndex)
                        );
                      } else {
                        onChange(
                          attributes.map((ele, eIndex) =>
                            eIndex !== index ? ele : { ...ele, value }
                          )
                        );
                      }
                    }
                  }}
                  placeholder="Enter value"
                  value={attribute.value}
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
