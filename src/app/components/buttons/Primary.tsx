import React from "react";
import styles from "./button.module.css";
import Image from "next/image";
import Search from '../../images/Search.svg'
import ChevronDown from "../../images/ChevronDown.svg"

export default function Secondary() {
  return (
    <div>
      <button className={styles.btn1}>       
        <Image src={Search} alt="magnifying glass" />    
        <span>Search</span>
        <Image src={ChevronDown} alt="Arrow-down" />  
      </button>
    </div>
  );
}
