import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { SearchInput } from "components";
import React, { useState } from "react";
import { IFaqNavBarItem } from "utils/types";

import { FaqNavbarItemGroup } from "../FaqNavbarItemGroup";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    padding: theme.spacing(1),
    "& > * + *": {
      borderTop: `1px solid ${theme.colors.border.primary}`,
    },
  },
  search: {
    marginBottom: theme.spacing(1.5),
    width: "100%",
  },
}));

interface IProps {
  className?: string;
}

const FAQ_NAVBAR_ITEMS: IFaqNavBarItem[] = [
  {
    id: "1",
    title: "How to trade",
    href: "/faq/how-to-trade",
  },
  {
    id: "2",
    title: "How to buy",
    href: "/faq/how-to-buy",
  },
  {
    id: "3",
    title: "Trade lock",
    children: [
      {
        id: "3-1",
        title:
          "I have accepted a trade with trade locked items, how can I withdraw them?",
        href: "/faq/how-to-withdraw",
      },
      {
        id: "3-2",
        title:
          "Why can I see my item on the site's inventory but not in Steam?",
        href: "/faq/trade-lock-item",
      },
      {
        id: "3-3",
        title: "Why can’t I receive all my items in 1 trade?",
        href: "/faq/missing-items-in-trade",
      },
    ],
  },
  {
    id: "4",
    title: "Trade lock test",
    children: [
      {
        id: "4-1",
        title:
          "I have accepted a trade with trade locked items, how can I withdraw them?",
        href: "/faq/how-to-withdraw-1",
      },
      {
        id: "4-2",
        title:
          "Why can I see my item on the site's inventory but not in Steam?",
        href: "/faq/trade-lock-item-2",
      },
      {
        id: "4-3",
        title: "Why can’t I receive all my items in 1 trade?",
        href: "/faq/missing-items-in-trade-3",
      },
    ],
  },
];

export const FaqNavbar = (props: IProps) => {
  const classes = useStyles();
  const [keyword, setKeyword] = useState<string>("");

  return (
    <div className={clsx(classes.root, props.className)}>
      <SearchInput
        className={classes.search}
        onChange={setKeyword}
        value={keyword}
      />
      {FAQ_NAVBAR_ITEMS.filter((group) => {
        if (keyword === "") return true;
        if (!group.children) {
          return group.title.toLowerCase().includes(keyword.toLowerCase());
        }
        if (group.title.toLowerCase().includes(keyword.toLowerCase()))
          return true;
        const groupChildIncludes = group.children.filter((item) =>
          item.title.toLowerCase().includes(keyword.toLowerCase())
        );
        return groupChildIncludes.length > 0;
      })
        .map((group) => {
          if (keyword === "" || !group.children) return group;
          if (group.title.toLowerCase().includes(keyword.toLowerCase()))
            return group;
          const groupChildIncludes = group.children.filter((item) =>
            item.title.toLowerCase().includes(keyword.toLowerCase())
          );
          return { ...group, children: groupChildIncludes };
        })
        .map((item) => (
          <FaqNavbarItemGroup data={item} key={item.id} />
        ))}
    </div>
  );
};
