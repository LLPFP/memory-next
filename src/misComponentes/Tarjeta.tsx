import { Card } from "@/components/ui/card";
import Image from "next/image";

type TarjetaProps = {
  nom: string;
  imatge: string;
};

export default function Tarjeta({ nom, imatge }: TarjetaProps) {
  return (
    <Card className="w-full max-w-sm rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden h-[250px] relative">
      <Image
        src={imatge}
        alt={`Imatge de ${nom}`}
        fill
        className="object-cover"
        sizes="(max-width: 384px) 100vw, 384px"
      />
    </Card>
  );
}
