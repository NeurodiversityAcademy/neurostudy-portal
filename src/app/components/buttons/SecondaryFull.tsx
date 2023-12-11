import React from "react";
import styles from "./button.module.css";
import Image from "next/image";
import SecondaryOutlinedFull from "../../images/SecondaryOutlinedFull.svg";

export default function SecondaryFull() {
  return (
    <div>
      <button className={styles.btn2Full}>
        <Image src={SecondaryOutlinedFull} alt="Search" />
      </button>
    </div>
  );
}
