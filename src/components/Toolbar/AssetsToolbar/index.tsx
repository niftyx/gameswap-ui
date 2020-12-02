import {
  Badge,
  Hidden,
  Popover,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { ReactComponent as CartIcon } from "assets/svgs/cart-arrow-up.svg";
import clsx from "classnames";
import { SyncButton } from "components/Button";
import { NoteContainer } from "components/Container";
import { VerticalDivider } from "components/Divider";
import { SearchInput } from "components/Input";
import { GamesSelect, SortSelect } from "components/Select";
import React from "react";
import { numberWithCommas } from "utils";

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.custom.pageToolbarHeight,
    padding: `${theme.spacing(1)}px`,
    display: "flex",
    alignItems: "center",
    userSelect: "none",
    "& > * + *": {
      marginLeft: theme.spacing(2.5),
    },
  },
  balance: {
    flex: 1,
    color: theme.colors.text.third,
  },
  cart: {
    cursor: "pointer",
    color: theme.colors.text.third,
    transition: "all 0.3s",
    "&:hover": {
      color: theme.colors.text.default,
    },
  },
  cartPopover: {
    width: "36vw",
    maxWidth: theme.spacing(60),
  },
}));

interface IProps {
  className?: string;
  cartItemCount: number;
  totalPrice: number;
  renderCartContent: () => React.ReactNode | React.ReactNode[];
}

const AssetsToolbar = (props: IProps) => {
  const classes = useStyles();
  const { cartItemCount, totalPrice } = props;

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "asset-items-cart-popover" : undefined;

  return (
    <div className={clsx(classes.root, props.className)}>
      <Badge badgeContent={cartItemCount} color="primary">
        <CartIcon className={classes.cart} onClick={handleClick as any} />
      </Badge>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        id={id}
        open={open}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <NoteContainer
          className={classes.cartPopover}
          onClose={handleClose}
          title="You receive"
        >
          {props.renderCartContent()}
        </NoteContainer>
      </Popover>
      <Typography align="left" className={classes.balance} component="div">
        $ {numberWithCommas(totalPrice.toFixed(2))}
      </Typography>
      <Hidden lgDown>
        <SearchInput />
      </Hidden>
      <GamesSelect />
      <SortSelect />
      <VerticalDivider />
      <SyncButton />
    </div>
  );
};

export default AssetsToolbar;
