import React from "react";

import styles from "./button.module.css";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { MdOutlineArrowCircleRight } from "react-icons/md";

export default function TeritaryFull() {
  return (
    <div >
      <button className={styles.btn3Full}>       
        <span>Learn more </span>
        <span className={styles.icon}>       
        <FaRegArrowAltCircleRight />        
        </span>
      </button>
    </div>
  );
}
