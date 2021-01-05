import { Box, Hidden, Popover, makeStyles } from "@material-ui/core";
import clsx from "classnames";
import { SyncButton } from "components/Button";
import { NoteContainer } from "components/Container";
import { VerticalDivider } from "components/Divider";
import { SearchInput } from "components/Input";
import { GamesSelect, SortSelect } from "components/Select";
import React from "react";

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
  cartWrapper: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    color: theme.colors.text.third,
    transition: "all 0.3s",
    "&:hover": {
      color: theme.colors.text.default,
    },
  },
  cartPopover: {
    overflowY: "hidden",
  },
  cartPopoverContent: {
    width: "36vw",
    maxWidth: theme.spacing(60),
  },
}));

interface IProps {
  className?: string;
  cartItemCount: number;
  totalPrice: number;
  renderCartContent: ({
    handleClose,
  }: {
    handleClose?: () => void;
  }) => React.ReactNode | React.ReactNode[];
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
      {/* <div className={classes.cartWrapper} onClick={handleClick as any}>
        <Badge badgeContent={cartItemCount} color="primary">
          <CartIcon />
        </Badge>
        &nbsp;&nbsp;
        <Typography align="left" component="div">
          $ {numberWithCommas(totalPrice.toFixed(2))}
        </Typography>
      </div> */}

      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        className={classes.cartPopover}
        id={id}
        open={open}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <NoteContainer
          className={classes.cartPopoverContent}
          onClose={handleClose}
          title="You receive"
        >
          {props.renderCartContent({ handleClose })}
        </NoteContainer>
      </Popover>
      <Box flex={1} />
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
