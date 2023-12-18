import React from "react";
import styles from "./button.module.css";
import Image from "next/image";
import SearchOrg from "../../images/SearchOrg.svg";
import ChevronOrg from "../../images/ChevronOrg.svg"

export default function SecondaryFull() {
  return (
    <div>
      <button className={styles.btn2Full}>
      <Image src={SearchOrg} alt="magnifying glass" />
        <span>Search</span>
        <Image src={ChevronOrg} alt="Arrow-down" />
      </button>
    </div>
  );
}
