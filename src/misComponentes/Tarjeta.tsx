import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import { useClickContext } from "@/app/context/clickContext";

type TarjetaProps = {
  nom: string;
  imatge: string;
  id: number;
};

export default function Tarjeta({ nom, imatge }: TarjetaProps) {
  const [contador, setContador] = useState(0);
  const { incrementClicks } = useClickContext();
  const [girada, setGirada] = useState(false);

  const manejarClick = () => {
    setContador(contador + 1);
    incrementClicks();
    setGirada(true);
    setTimeout(() => {
      setGirada(false);
    }, 1000);
  };

  return (
    <Card
      className={`w-full max-w-sm rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden h-[250px] relative cursor-pointer ${
        girada ? "transform rotate-y-180" : ""
      }`}
      onClick={manejarClick}>
      {girada ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <Image
            src={imatge}
            alt={`Imatge de ${nom}`}
            fill
            className="object-cover"
            sizes="(max-width: 384px) 100vw, 184px"
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <Image
            src="/assets/reverse.png"
            alt="Reverso de la carta"
            fill
            className="object-cover object-center w-full h-full"
            sizes="(max-width: 384px) 100vw, 184px"
            priority
          />
        </div>
      )}
      <div className="absolute bottom-2 right-2 bg-gradient-to-r from-purple-500/90 to-pink-500/90 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm font-bold text-lg text-white transform hover:scale-105 transition-transform duration-200 border-2 border-white/20">
        {contador}
      </div>
    </Card>
  );
}
