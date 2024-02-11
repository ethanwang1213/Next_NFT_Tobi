import homeKey from "./menu/key/home-squared.webp";
import saidanKey from "./menu/key/saidan-squared.webp";
import aboutKey from "./menu/key/about-squared.webp";

import homeLoad from "./menu/load/home.png";
import aboutLoad from "./menu/load/about.webp";
import saidanLoad from "./menu/load/saidan.webp";

type MenuItem = {
  name: string;
  keyImage: string;
  loadImage: string;
  link: string;
  show: boolean;
  click: boolean;
  menu: boolean;
};

/**
 * メニューの項目
 */
export const menuItem: MenuItem[] = [
  {
    name: "HOME",
    keyImage: homeKey.src,
    loadImage: homeLoad.src,
    link: "/#top0",
    show: true,
    click: true,
    menu: true,
  },
  {
    name: "TOP1",
    keyImage: "",
    loadImage: "",
    link: "/#top1",
    show: false,
    click: true,
    menu: false,
  },
  {
    name: "TOP2",
    keyImage: "",
    loadImage: "",
    link: "/#top2",
    show: false,
    click: true,
    menu: false,
  },
  {
    name: "TOP3",
    keyImage: "",
    loadImage: "",
    link: "/#top3",
    show: false,
    click: true,
    menu: false,
  },
  {
    name: "TOP4",
    keyImage: "",
    loadImage: "",
    link: "/#top4",
    show: false,
    click: true,
    menu: false,
  },
  {
    name: "TOP5",
    keyImage: "",
    loadImage: "",
    link: "/#top5",
    show: false,
    click: true,
    menu: false,
  },
  {
    name: "ABOUT US",
    keyImage: aboutKey.src,
    loadImage: aboutLoad.src,
    link: "/about",
    show: true,
    click: true,
    menu: true,
  },
  {
    name: "SAIDAN",
    keyImage: saidanKey.src,
    loadImage: saidanLoad.src,
    link: "/saidan",
    show: true,
    click: true,
    menu: true,
  },
  {
    name: "TOBIRA NEKO",
    keyImage: "",
    loadImage: "",
    link: "https://tbrnk.tobiratory.com/",
    show: false,
    click: true,
    menu: true,
  },
  {
    name: "JOURNAL",
    keyImage: "",
    loadImage: "",
    link: "/journal/login",
    show: false,
    click: true,
    menu: true,
  },
  {
    name: "CONTACT",
    keyImage: "",
    loadImage: "",
    link: "/contact",
    show: false,
    click: true,
    menu: true,
  },
];
