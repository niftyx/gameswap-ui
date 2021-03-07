import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { ActivityRow } from "components";
import { MOCK_PROFILE_ACTIVITIES } from "config/constants";
import React, { useState } from "react";
import { IActivityItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    marginTop: theme.spacing(2),
    "& > * + *": {
      marginTop: theme.spacing(1.125),
    },
  },
  title: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(1.6125),
  },
  header: {},
}));

interface IProps {
  className?: string;
}
interface IState {
  items: IActivityItem[];
}

export const LatestActivitySection = (props: IProps) => {
  const classes = useStyles();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, setState] = useState<IState>({
    items: MOCK_PROFILE_ACTIVITIES,
  });

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.header}>
        <Typography className={classes.title} component="div">
          LATEST ACTIVITY
        </Typography>
      </div>

      <div className={classes.content}>
        {state.items.map((item: IActivityItem) => (
          <ActivityRow {...item} key={item.id} />
        ))}
      </div>
    </div>
  );
};
