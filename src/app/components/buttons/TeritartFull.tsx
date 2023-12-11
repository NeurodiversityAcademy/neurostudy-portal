import React from "react";
import styles from "./button.module.css";
import Image from "next/image";
import TertiaryOulinedFull from "../../images/TertiaryOulinedFull.svg";

export default function TeritaryFull() {
  return (
    <div>
      <button className={styles.btn3Full}>
        <Image src={TertiaryOulinedFull} alt="Learn more" />
      </button>
    </div>
  );
}
