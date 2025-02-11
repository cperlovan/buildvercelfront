"use client";

import Image from "next/image";
import Header from "../Components/Header";
import center from "../../public/assets/image/construction.jpg";
import Footer from "../Components/Footer";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
     
      <Header />

      {/* Imagen de fondo */}
      <div className="flex-1 relative w-full h-[calc(100vh-80px)]">
        <Image
          src={center}
          alt="center"
          layout="fill"
          objectFit="cover" 
          objectPosition="center" 
          priority
        />
      </div>

 
      <Footer />
    </div>
  );
}
