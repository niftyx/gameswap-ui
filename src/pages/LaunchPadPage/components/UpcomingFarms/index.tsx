import { Typography, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { UpcomingFarmRow } from "components";
import { MockUpcomingFarms } from "config/constants";
import React, { useState } from "react";
import { IUpcomingFarmItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {},
  assets: {
    marginTop: theme.spacing(2),
    "& > * + *": {
      marginTop: theme.spacing(1.125),
    },
  },
  header: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: theme.spacing(3),
    },
  },
  title: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(1.6125),
  },
  toolbar: {
    flex: 1,
  },
}));

interface IProps {
  className?: string;
}
interface IState {
  items: IUpcomingFarmItem[];
}

export const UpcomingFarms = (props: IProps) => {
  const classes = useStyles();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, setState] = useState<IState>({ items: MockUpcomingFarms });

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.header}>
        <Typography className={classes.title} component="div">
          UPCOMING FARMS
        </Typography>
      </div>

      <div className={classes.assets}>
        {state.items.map((item: IUpcomingFarmItem) => (
          <UpcomingFarmRow {...item} key={item.id} />
        ))}
      </div>
    </div>
  );
};
