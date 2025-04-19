import Tarjeta from "@/misComponentes/Tarjeta";
import { Separator } from "@/components/ui/separator";
import { ClickProvider, useClickContext } from "@/app/context/clickContext";

type Personaje = {
  nom: string;
  imatge: string;
};

type GrupoTarjetasProps = {
  personajes: Personaje[];
};

function TotalClicks() {
  const { totalClicks } = useClickContext();
  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-2xl px-10 py-6 mb-6 backdrop-blur-md border-2 border-blue-400/50 shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 max-w-md mx-auto">
      <span className="text-blue-100 font-bold text-xl tracking-wider">
        Total Clicks: <span className="text-purple-300">{totalClicks}</span>
      </span>
    </div>
  );
}

export default function GrupoTarjetas({ personajes }: GrupoTarjetasProps) {
  const cartasBarajadas = [...personajes, ...personajes]
    .sort(() => Math.random() - 0.5)
    .map((personaje, index) => ({ ...personaje, id: index }));

  return (
    <ClickProvider>
      <section className="w-full max-w-7xl mx-auto p-6">
        <Separator className="mb-6 bg-white/10" />
        <TotalClicks />
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
    </ClickProvider>
  );
}
