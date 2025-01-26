"use client";

import Image from "next/image";
import Header from "./Components/Header";
import center from "../public/assets/image/construction.jpg"
import Footer from "./Components/Footer";

export default function Home() {
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
      <Footer />
    </div>
  );
}
