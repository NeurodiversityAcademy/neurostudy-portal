import React from "react";
import styles from "./button.module.css";
import Image from "next/image";
import SecondaryOutlined from "../../images/SecondaryOutlined.svg";

export default function Secondary() {
  return (
    <div>
      <button className={styles.btn2}>
        <Image src={SecondaryOutlined} alt="Search" />
      </button>
    </div>
  );
}
