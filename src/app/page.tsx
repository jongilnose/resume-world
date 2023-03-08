"use client";
import { useEffect } from "react";
import { Overworld } from "utils/Overworld";
import styles from "./page.module.css";
export default function Home() {
  useEffect(() => {
    const overworld = new Overworld({
      element: document.querySelector(".resume-world-container"),
    });
    overworld.init();
  }, []);
  return (
    <main className={styles.main}>
      <div className="resume-world-container">
        <canvas
          className="resume-world-canvas"
          width="352"
          height="198"
        ></canvas>
      </div>
    </main>
  );
}
