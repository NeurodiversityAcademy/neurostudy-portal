import React from "react";

import styles from "./button.module.css";
import { FaRegArrowAltCircleRight } from "react-icons/fa";

export default function Teritary() {
  return (
    <div >
      <button className={styles.btn3}>
       
        <span>Learn more </span>
        <span className={styles.icon}>       
        <FaRegArrowAltCircleRight />        
        </span>
      </button>
    </div>
  );
}
