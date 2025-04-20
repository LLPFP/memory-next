import Tarjeta from "@/misComponentes/Tarjeta";
import { Separator } from "@/components/ui/separator";
import { useClickContext } from "@/app/context/clickContext";

type Personaje = {
  nom: string;
  imatge: string;
  id: number;
};

type GrupoTarjetasProps = {
  personajes: Personaje[];
  estadoTarjetas: { [id: number]: boolean };
  contadores: { [id: number]: number };
  manejarClick: (id: number) => void;
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

export default function GrupoTarjetas({
  personajes,
  estadoTarjetas,
  contadores,
  manejarClick,
}: GrupoTarjetasProps) {
  const { incrementClicks } = useClickContext();

  const manejarClickInterno = (id: number) => {
    incrementClicks();
    manejarClick(id);
  };

  return (
    <section className="w-full max-w-7xl mx-auto p-3">
      <Separator className="mb-6 bg-white/10" />
      <TotalClicks />
      <div className="grid gap-x-1 gap-y-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 justify-items-center p-4 animate-fadeIn">
        {personajes.map((personaje) => (
          <Tarjeta
            key={personaje.id}
            id={personaje.id}
            nom={personaje.nom}
            imatge={personaje.imatge}
            girada={estadoTarjetas[personaje.id] || false}
            contador={contadores[personaje.id] || 0}
            onClick={() => manejarClickInterno(personaje.id)}
          />
        ))}
      </div>
    </section>
  );
}
