import { Typography, makeStyles } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import clsx from "clsx";
import { useGlobal } from "contexts";
import React from "react";
import useCommonStyles from "styles/common";

import { FormGameChooseItem } from "../FormGameChooseItem";

const useStyles = makeStyles((theme) => ({
  root: {},
  label: {
    color: theme.colors.text.default,
    fontSize: theme.spacing(1.75),
    marginTop: theme.spacing(1),
  },
  content: {
    marginTop: theme.spacing(2.5),
    display: "flex",
    overflowX: "auto",
    overflowY: "hidden",
    flexWrap: "wrap",
  },
  icon: {
    fontSize: 40,
    color: theme.colors.text.default,
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: "50%",
  },
}));

interface IProps {
  comment: string;
  gameId: string;
  onChange: (_: string) => void;
  onNewGame: () => void;
}

export const FormGameChoose = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { comment, gameId, onChange, onNewGame } = props;
  const {
    data: { games },
  } = useGlobal();

  return (
    <div className={classes.root}>
      <Typography className={classes.label} component="div">
        {comment}
      </Typography>
      <div className={clsx(classes.content, commonClasses.scrollHorizontal)}>
        <FormGameChooseItem
          active={false}
          onClick={onNewGame}
          renderIcon={() => <AddCircleIcon className={classes.icon} />}
          subTitle="Game"
          title="Create"
        />
        {games.map((game) => (
          <FormGameChooseItem
            active={gameId === game.id}
            key={game.id}
            onClick={() => {
              if (gameId !== game.id) {
                onChange(game.id);
              }
            }}
            renderIcon={() => (
              <img alt="img" className={classes.img} src={game.imageUrl} />
            )}
            subTitle={" "}
            title={game.name}
          />
        ))}
      </div>
    </div>
  );
};
