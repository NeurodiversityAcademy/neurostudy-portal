import React from "react";
import styles from "./button.module.css";
import { HiOutlineChevronDown } from "react-icons/hi2"
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

export default function PrimaryFull() {
  return (
    <div>
      <button className={styles.btn1Full}>
        <span className={styles.icon}>         
          <HiMiniMagnifyingGlass />
        </span>
        <span>Search</span>
        <span className={styles.icon}>       
        <HiOutlineChevronDown />
        </span>
      </button>
    </div>
  );
}
