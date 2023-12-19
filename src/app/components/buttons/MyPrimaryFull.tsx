import React from "react";
import Search from "../../images/Search.svg";

import MyButton from "./MyButton";

export default function myPrimaryFull() {
  return (
    <MyButton label="Search" icon={Search} style="primary-full" />
  );
}
