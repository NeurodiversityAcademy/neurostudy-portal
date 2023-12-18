import React from "react";
import styles from "./button.module.css";
import Image from "next/image";
import CircleRightOrg from "../../images/CircleRightOrg.svg";

export default function Teritary() {
  return (
    <div >
      <button className={styles.btn3}>             
      <span>Learn more</span>
        <Image src={CircleRightOrg} alt="circle arrow right" />
      </button>
    </div>
  );
}
