import { Hidden, makeStyles } from "@material-ui/core";
import { ReactComponent as ActivityIcon } from "assets/svgs/activity.svg";
import { ReactComponent as EyeIcon } from "assets/svgs/eye.svg";
import { ReactComponent as FlagIcon } from "assets/svgs/flag.svg";
import { ReactComponent as FlashIcon } from "assets/svgs/flash.svg";
import { ReactComponent as GiftIcon } from "assets/svgs/gift.svg";
import { ReactComponent as GlobeIcon } from "assets/svgs/globe.svg";
import { ReactComponent as HeartIcon } from "assets/svgs/heart.svg";
import { ReactComponent as ShoppingBagIcon } from "assets/svgs/shopping-bag.svg";
import { ReactComponent as TvIcon } from "assets/svgs/tv.svg";
import clsx from "classnames";
import { SideMenuGroupHeader, SideMenuItem } from "components";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import useCommonStyles from "styles/common";
import { ISideMenuGroupHeaderItem, ISideMenuItem } from "utils/types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: theme.custom.appNavbarWidth,
    position: "fixed",
    left: 0,
    top: theme.custom.appHeaderHeight,
    bottom: 0,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    overflowY: "auto",
    paddingBottom: theme.spacing(2),
  },
}));

interface IProps {
  className?: string;
}

const Navbar = (props: IProps & RouteComponentProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const menuItems: {
    group: ISideMenuGroupHeaderItem;
    subs: ISideMenuItem[];
  }[] = [
    {
      group: {
        title: "Menu",
      },
      subs: [
        {
          title: "Home",
          href: "/",
          Icon: ActivityIcon,
        },
        {
          title: "Favorites",
          href: "/favorites",
          Icon: HeartIcon,
        },
        {
          title: "My bids",
          href: "/bids",
          Icon: ShoppingBagIcon,
        },
        {
          title: "My asks",
          href: "/asks",
          Icon: TvIcon,
        },
      ],
    },
    {
      group: {
        title: "BROWSE CATEGORIES",
        moreItems: [
          {
            title: "More",
            onClick: () => {},
          },
        ],
      },
      subs: [
        {
          title: "Popular",
          href: "/popular",
          Icon: FlagIcon,
        },
        {
          title: "Trending",
          href: "/trending",
          Icon: FlashIcon,
        },
        {
          title: "New",
          href: "/new",
          Icon: GlobeIcon,
        },
        {
          title: "Special Offers",
          href: "/special-offers",
          Icon: GiftIcon,
        },
        {
          title: "Arcade Games",
          href: "/arcade-games",
          Icon: GiftIcon,
        },
      ],
    },
    {
      group: {
        title: "LAST WATCHED",
        moreItems: [
          {
            title: "More",
            onClick: () => {},
          },
        ],
      },
      subs: [
        {
          title: "Counter-Strike:Global test",
          href: "/games/234",
          Icon: EyeIcon,
          onClick: () => {},
        },
        {
          title: "Mystical Warriors",
          href: "/games/2345",
          Icon: EyeIcon,
          onClick: () => {},
        },
        {
          title: "SkyFall 3",
          href: "/games/12",
          Icon: EyeIcon,
          onClick: () => {},
        },
        {
          title: "Cyberpunk Assault",
          href: "/games/777",
          Icon: EyeIcon,
          onClick: () => {},
        },
        {
          title: "Shadow Tactics",
          href: "/games/987",
          Icon: EyeIcon,
          onClick: () => {},
        },
      ],
    },
  ];

  return (
    <div className={clsx(classes.root, commonClasses.scroll, props.className)}>
      {menuItems.map((group, gIndex) => (
        <div key={gIndex}>
          <SideMenuGroupHeader {...group.group} />
          {group.subs.map((item: ISideMenuItem) => (
            <SideMenuItem key={item.title} {...item} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default withRouter(Navbar);
