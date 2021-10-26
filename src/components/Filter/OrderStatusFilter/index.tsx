import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";
import { EOrderStatus } from "utils/enums";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: 4,
  },
  item: {
    width: "48%",
    marginBottom: 8,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    borderRadius: 6,
    backgroundColor: theme.colors.primary80,
    color: transparentize(0.3, theme.colors.white),
    transition: "all 0.5s",
    fontSize: 14,
    userSelect: "none",
    "&:hover": { opacity: 0.7 },
    "&.active": {
      backgroundColor: theme.colors.primary80,
      color: theme.colors.white,
    },
  },
}));

interface IProps {
  statuses: EOrderStatus[];
  onChange: (_: EOrderStatus[]) => void;
  className?: string;
}

export const OrderStatusFilter = (props: IProps) => {
  const classes = useStyles();
  const { onChange, statuses } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      {Object.values(EOrderStatus).map((status) => {
        const isSelected = statuses.includes(status);
        return (
          <span
            className={clsx(classes.item, isSelected ? "active" : "")}
            key={status}
            onClick={() => {
              if (isSelected) {
                onChange(statuses.filter((s) => status !== s));
              } else {
                onChange([...statuses, status]);
              }
            }}
          >
            {status}
          </span>
        );
      })}
    </div>
  );
};
