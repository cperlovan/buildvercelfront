"use client";

import Image from "next/image";
import Header from "../Components/Header";
import center from "../../public/assets/image/construction.jpg"

export default function page() {
  return (
    <div>
      <Header />
      <div>
        <Image
          className="imacentral"
          src={center.src}
          alt="center"
          height={600}
          width={1700}
        />
      </div>
    </div>
  );
}