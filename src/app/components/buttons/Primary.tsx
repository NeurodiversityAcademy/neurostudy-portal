import React from "react";
import styles from "./button.module.css";
import Image from "next/image";
import PrimaryOulined from '../../images/PrimaryOulined.svg'

export default function Secondary() {
  return (
    <div>
      <button className={styles.btn1}>       
        <Image src={PrimaryOulined} alt="Search" />      
      </button>
    </div>
  );
}
