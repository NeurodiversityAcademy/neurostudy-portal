import React from "react";
import Search from "../../images/SearchOrg.svg";

import MyButton from "./MyButton";

export default function mySecondary() {
  return (
    <MyButton label="Search" icon={Search} style="secondary" />
  );
}
