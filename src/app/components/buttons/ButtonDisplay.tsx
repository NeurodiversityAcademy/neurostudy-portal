import React from "react";
import styles from "./button.module.css";

import MyPrimaryFull from "./MyPrimaryFull"

import MyPrimary from "./MyPrimary";

import MySecondary from "./MySecondary";
import MySecondaryFull from "./MySecondaryFull";
import MyTeritary from "./MyTeritary";
import MyTeritaryFull from "./MyTeritaryFull";

export default function ButtonDisplay() {
  return (
    <div >
      <div className={styles.display} >
        <MyPrimaryFull />
      </div>
      <div className={styles.display} >
        <MyPrimary />
      </div>
      <div className={styles.display}>
        <MySecondaryFull />
      </div>
      <div className={styles.display}>
        <MySecondary />
      </div>
      <div  className={styles.display}>
      <MyTeritary/>
      </div>
      <div  className={styles.display}>
        <MyTeritaryFull/>
      </div>
    </div>
  );
}
