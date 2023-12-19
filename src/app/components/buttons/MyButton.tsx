import React from "react";
import styles from "./button.module.css";
import Image from "next/image";


export default function MyButton({ label, icon, style }) {
    let buttonStyles ;
  
    switch (style) {
        case "primary-full":
          buttonStyles = styles.btn1Full;
          break;
        case "secondary":
          buttonStyles = styles.btn2;
          break;
        case "secondary-full":
          buttonStyles = styles.btn2Full;
          break;
        case "teritary":
          buttonStyles = styles.btn3;
          break;
        case "teritary-full":
          buttonStyles = styles.btn3Full;
          break;
        default:
          buttonStyles = styles.btn1; 
      }
  
    return (
      <button className={buttonStyles}>
        {icon && <Image src={icon} alt="icon" />} 
        <span>{label}</span>
      </button>
    );
  }