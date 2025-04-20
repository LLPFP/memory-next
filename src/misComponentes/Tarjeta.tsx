"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";

type TarjetaProps = {
  nom: string;
  imatge: string;
  id: number;
  girada: boolean;
  contador: number;
  onClick: () => void;
};

export default function Tarjeta({
  nom,
  imatge,
  girada,
  contador,
  onClick,
}: TarjetaProps) {
  return (
    <div
      className="w-full max-w-[120px] h-[150px] perspective"
      onClick={onClick}>
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style preserve-3d ${
          girada ? "rotate-y-180" : ""
        }`}>
        <Card className="absolute w-full h-full backface-hidden rounded-2xl overflow-hidden">
          <Image
            src="/assets/reverse.png"
            alt="Reverso de la carta"
            fill
            className="object-cover object-center w-full h-full"
            sizes="(max-width: 120px) 100vw, 120px"
            priority
          />
        </Card>

        <Card className="absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden">
          <Image
            src={imatge}
            alt={`Imatge de ${nom}`}
            fill
            className="object-cover"
            sizes="(max-width: 120px) 100vw, 120px"
          />
        </Card>
      </div>

      <div className="absolute bottom-2 right-2 bg-gradient-to-r from-purple-500/90 to-pink-500/90 rounded-full px-2 py-0.5 shadow-lg backdrop-blur-sm font-bold text-xs text-white transform hover:scale-105 transition-transform duration-200 border-2 border-white/20">
        {contador}
      </div>
    </div>
  );
}
