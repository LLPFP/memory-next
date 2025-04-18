import Tarjeta from "@/misComponentes/Tarjeta";
import { Separator } from "@/components/ui/separator";

type Personaje = {
  nom: string;
  imatge: string;
};

type GrupoTarjetasProps = {
  personajes: Personaje[];
};

export default function GrupoTarjetas({ personajes }: GrupoTarjetasProps) {
  const cartasBarajadas = [...personajes, ...personajes]
    .sort(() => Math.random() - 0.5)
    .map((personaje, index) => ({ ...personaje, id: index }));

  return (
    <section className="w-full max-w-7xl mx-auto p-6">
      <Separator className="mb-6 bg-white/10" />
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 justify-items-center">
        {cartasBarajadas.map((personaje) => (
          <Tarjeta
            key={personaje.id}
            nom={personaje.nom}
            imatge={personaje.imatge}
          />
        ))}
      </div>
    </section>
  );
}
