import { makeStyles } from "@material-ui/core";
import { ReactComponent as TvIcon } from "assets/svgs/account-arrow-right-outline.svg";
import { ReactComponent as ShoppingBagIcon } from "assets/svgs/format-list-text.svg";
import { ReactComponent as GamePadIcon } from "assets/svgs/gamepad.svg";
import { ReactComponent as HeartIcon } from "assets/svgs/heart-outline.svg";
import { ReactComponent as GlobeIcon } from "assets/svgs/lightning-bolt-outline.svg";
import { ReactComponent as DiscordIcon } from "assets/svgs/social/discord.svg";
import { ReactComponent as TelegramIcon } from "assets/svgs/social/telegram.svg";
import { ReactComponent as TwitterIcon } from "assets/svgs/social/twitter.svg";
import { ReactComponent as FlagIcon } from "assets/svgs/star-outline.svg";
import { ReactComponent as FlashIcon } from "assets/svgs/trending-up.svg";
import clsx from "clsx";
import { SideMenuGroupHeader, SideMenuItem } from "components";
import { useSettings } from "hooks";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import useCommonStyles from "styles/common";
import { ISideMenuGroupHeaderItem, ISideMenuItem, THEME } from "utils/types.d";

const useStyles = makeStyles((theme) => ({
  root: {
    width: theme.custom.appNavbarWidth,
    position: "fixed",
    left: 0,
    top: theme.custom.appHeaderHeight,
    bottom: 0,
    borderRight: `1px solid ${theme.colors.border.secondary}`,
    paddingBottom: theme.spacing(8),
  },
  content: {
    height: "100%",
    position: "relative",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    overflowY: "auto",
  },
  bottomWrapper: {
    position: "fixed",
    bottom: 0,
    left: 0,
    padding: "0 16px",
    width: Number(theme.custom.appNavbarWidth),
    height: theme.spacing(8),
    borderTop: `1px solid ${theme.colors.border.secondary}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomSocials: {
    display: "flex",
    alignItems: "center",
    "& > a": {},
    "& > a + a": {
      marginLeft: 16,
    },
  },
  switcher: {
    margin: "0 !important",
  },
}));

interface IProps {
  className?: string;
}

const Navbar = (props: IProps & RouteComponentProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { saveSettings, settings } = useSettings();
  const { theme } = settings;

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
          title: "Explore",
          href: "/",
          Icon: GamePadIcon,
        },
        {
          title: "Favorites",
          href: "/profile/liked",
          Icon: HeartIcon,
        },
        {
          title: "My Items",
          href: "/profile/assets",
          Icon: ShoppingBagIcon,
        },
        {
          title: "Following",
          href: "/following",
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
      ],
    },
  ];

  const isDarkMode = theme === THEME.Black;
  const toggleDarkMode = () => {
    saveSettings({
      ...settings,
      theme: isDarkMode ? THEME.White : THEME.Black,
    });
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={clsx(classes.content, commonClasses.scroll)}>
        {menuItems.map((group, gIndex) => (
          <div key={gIndex}>
            <SideMenuGroupHeader {...group.group} />
            {group.subs.map((item: ISideMenuItem) => (
              <SideMenuItem key={item.title} {...item} />
            ))}
          </div>
        ))}
        <div className={classes.bottomWrapper}>
          <DarkModeSwitch
            checked={isDarkMode}
            className={classes.switcher}
            moonColor="#FFF"
            onChange={toggleDarkMode}
            size={30}
            style={{ marginBottom: "2rem" }}
            sunColor="#FFF"
          />
          <div className={classes.bottomSocials}>
            <a
              href="https://twitter.com/gameswapdex"
              rel="noreferrer"
              target="_blank"
            >
              <TwitterIcon />
            </a>
            <a href="https://t.me/gameswap" rel="noreferrer" target="_blank">
              <TelegramIcon />
            </a>
            <a
              href="https://discord.gg/eXctughEDH"
              rel="noreferrer"
              target="_blank"
            >
              <DiscordIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Navbar);
