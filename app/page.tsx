"use client";

import Image from "next/image";
import Header from "./Components/Header";
import center from "../public/assets/image/construction.jpg"

export default function Home() {
  return (
    <div>
      <Header />
      <div>
        <Image
          className="imacentral"
          src={center.src}
          alt="center"
          layout="fill"
        />
      </div>
    </div>
  );
}
