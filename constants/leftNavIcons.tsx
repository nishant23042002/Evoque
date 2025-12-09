import { GiClothes } from "react-icons/gi";
import { BiSolidHomeSmile } from "react-icons/bi";
import { RiSettings4Fill } from "react-icons/ri";
import { GoBellFill } from "react-icons/go";
import { RiAccountCircleFill } from "react-icons/ri";


export const LEFT_NAV_ITEMS = {
  latest: GiClothes,
  home: BiSolidHomeSmile,
  settings: RiSettings4Fill,
  account: RiAccountCircleFill,
  notify: GoBellFill
} as const;