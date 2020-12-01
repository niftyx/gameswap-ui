import { Button, Typography, makeStyles } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { IconFaqItemPlaceholder } from "assets/icons";
import clsx from "classnames";
import React, { useEffect, useState } from "react";
import { NavLink, RouteComponentProps, withRouter } from "react-router-dom";
import useCommonStyles from "styles/common";
import { waitSeconds } from "utils";
import { IAssetItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {},
  toolbar: {
    marginTop: theme.spacing(1),
  },
  title: {
    color: theme.colors.text.seventh,
    fontSize: theme.spacing(3),
  },
  content: {
    margin: theme.spacing(1),
    position: "relative",
    minHeight: theme.spacing(60),
  },
  placeholder: {},
  mainContent: {
    position: "absolute",
    overflow: "hidden",
    "&.visible": {
      position: "relative",
    },
  },
  backBtn: {
    userSelect: "none",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    color: theme.colors.text.default,
    "& > * + *": {
      marginLeft: theme.spacing(1),
    },
  },
  backTitle: {
    lineHeight: 1,
    marginTop: theme.spacing(0.25),
  },
}));

interface IProps {
  className?: string;
}

interface IState {
  loaded: boolean;
}

const FaqDetailsSection = (props: IProps & RouteComponentProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const faqId = ((props.match.params as any) || {})["id"] || "how-to-trade";

  const [state, setState] = useState<IState>({ loaded: false });
  const setLoaded = (loaded: boolean) =>
    setState((prevState) => ({ ...prevState, loaded }));

  useEffect(() => {
    setLoaded(false);
    waitSeconds().then(() => setLoaded(true));
  }, [faqId]);

  console.log(faqId);

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.toolbar}>
        <NavLink
          className={clsx(classes.backBtn, commonClasses.showBelowWide)}
          exact
          to="/faq"
        >
          <ArrowBackIcon />
          <Typography className={classes.backTitle} component="span">
            BACK TO FAQ
          </Typography>
        </NavLink>
      </div>

      <div className={classes.content}>
        {!state.loaded && (
          <div className={classes.placeholder}>
            <IconFaqItemPlaceholder />
          </div>
        )}
        <div
          className={clsx(
            classes.mainContent,
            commonClasses.fadeAnimation,
            state.loaded ? "visible" : ""
          )}
        >
          <Typography className={classes.title} component="div">
            Why can I see my item on the site&apos;s inventory but not in Steam?
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default withRouter(FaqDetailsSection);
