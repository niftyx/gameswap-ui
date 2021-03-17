import { Checkbox, FormControlLabel, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";
import { EPlatform } from "utils/enums";

const useStyles = makeStyles((theme) => ({
  root: {},
  formControl: {
    marginTop: 4,
    marginLeft: 0,
    width: "100%",
  },
  label: {
    color: transparentize(0.4, theme.colors.text.default),
  },
  iconButton: {
    padding: 0,
    paddingRight: 8,
  },
}));

interface IProps {
  platforms: EPlatform[];
  onChange: (_: EPlatform[]) => void;
  className?: string;
}

export const PlatformFilter = (props: IProps) => {
  const classes = useStyles();
  const { onChange, platforms } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      {Object.values(EPlatform).map((platform) => {
        const isSelected = platforms.includes(platform);

        return (
          <FormControlLabel
            classes={{ label: classes.label, root: classes.formControl }}
            control={
              <Checkbox
                checked={isSelected}
                classes={{ root: classes.iconButton }}
                name={platform}
                onChange={(event) => {
                  const { checked } = event.target;
                  if (checked) {
                    onChange([...platforms, platform]);
                  } else {
                    onChange(platforms.filter((c) => c !== platform));
                  }
                }}
              />
            }
            key={platform}
            label={platform}
          />
        );
      })}
    </div>
  );
};
