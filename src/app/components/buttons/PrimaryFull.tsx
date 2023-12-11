import React from "react";
import styles from "./button.module.css";
import Image from "next/image";
import PrimaryOutlinedFull from "../../images/PrimaryOutlinedFull.svg";

export default function PrimaryFull() {
  return (
    <div>
      <button className={styles.btn1Full}>
        <Image src={PrimaryOutlinedFull} alt="Search" />
      </button>
    </div>
  );
}
