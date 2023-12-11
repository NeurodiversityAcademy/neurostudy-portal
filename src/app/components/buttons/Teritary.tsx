import React from "react";
import styles from "./button.module.css";
import Image from "next/image";
import TertiaryOutlined from '../../images/TertiaryOutlined.svg'

export default function Teritary() {
  return (
    <div >
      <button className={styles.btn3}>             
        <Image src={TertiaryOutlined } alt="Learn more"/>  
      </button>
    </div>
  );
}
