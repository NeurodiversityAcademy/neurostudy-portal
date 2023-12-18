import React from "react";
import styles from "./button.module.css";
import Image from "next/image";
import CircleRightOrg from "../../images/CircleRightOrg.svg";

export default function TeritaryFull() {
  return (
    <div>
      <button className={styles.btn3Full}>
        <span>Learn more</span>
        <Image src={CircleRightOrg} alt="Learn more" />
      </button>
    </div>
  );
}
