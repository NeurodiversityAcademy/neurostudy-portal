import React from "react";
import styles from "./button.module.css";
import PrimaryFull from "./PrimaryFull";
import Primary from "./Primary";
import Secondary from "./Secondary";
import SecondaryFull from "./SecondaryFull";
import Teritary from "./Teritary";
import TeritaryFull from "./TeritartFull";

export default function ButtonDisplay() {
  return (
    <div >
      <div className={styles.display} >
        <PrimaryFull />
      </div>
      <div className={styles.display} >
        <Primary />
      </div>
      <div className={styles.display}>
        <SecondaryFull />
      </div>
      <div className={styles.display}>
        <Secondary />
      </div>
      <div  className={styles.display}>
      <Teritary/>
      </div>
      <div  className={styles.display}>
        <TeritaryFull/>
      </div>
    </div>
  );
}
