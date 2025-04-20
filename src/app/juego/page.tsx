"use client";

import GrupoTarjetas from "@/misComponentes/GrupoTarjetas";
import { Tarjetas } from "@/app/data/Tarjetas";
import Header from "@/misComponentes/Header";
import { ClickProvider } from "@/app/context/clickContext";
import { useState, useEffect } from "react";

type Carta = {
  id: number; // único para React
  originalId: number; // id “de par” que viene de Tarjetas
  nom: string;
  imatge: string;
};

export default function Page() {
  const [cartasBarajadas, setCartasBarajadas] = useState<Carta[]>([]);
  const [estadoTarjetas, setEstadoTarjetas] = useState<{
    [id: number]: boolean;
  }>({});
  const [contadores, setContadores] = useState<{ [id: number]: number }>({});
  const [seleccionadas, setSeleccionadas] = useState<Carta[]>([]);
  const [puntuacion, setPuntuacion] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const [hasGanado, setHasGanado] = useState(false);

  // Genera la baraja solo una vez al iniciar o al reiniciar
  useEffect(() => {
    const barajarCartas = (): Carta[] => {
      return [...Tarjetas, ...Tarjetas]
        .map((personaje) => ({
          originalId: personaje.id,
          nom: personaje.nom,
          imatge: personaje.imatge,
        }))
        .sort(() => Math.random() - 0.5)
        .map((carta, index) => ({ ...carta, id: index }));
    };

    setCartasBarajadas(barajarCartas());
  }, []);

  const manejarClick = (id: number) => {
    if (estadoTarjetas[id] || bloqueado) return;

    const carta = cartasBarajadas.find((c) => c.id === id);
    if (!carta) return;

    setContadores((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));

    setEstadoTarjetas((prev) => ({ ...prev, [id]: true }));

    const nuevasSeleccionadas = [...seleccionadas, carta];
    setSeleccionadas(nuevasSeleccionadas);

    if (nuevasSeleccionadas.length === 2) {
      const [c1, c2] = nuevasSeleccionadas;
      setBloqueado(true);

      if (c1.originalId === c2.originalId) {
        setPuntuacion((prev) => prev + 1);
        setSeleccionadas([]);
        setBloqueado(false);
      } else {
        setTimeout(() => {
          setEstadoTarjetas((prev) => ({
            ...prev,
            [c1.id]: false,
            [c2.id]: false,
          }));
          setSeleccionadas([]);
          setBloqueado(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (
      cartasBarajadas.length > 0 &&
      Object.values(estadoTarjetas).filter(Boolean).length ===
        cartasBarajadas.length
    ) {
      setHasGanado(true);
    }
  }, [estadoTarjetas, cartasBarajadas]);

  const reiniciarJuego = () => {
    const nuevaBaraja = [...Tarjetas, ...Tarjetas]
      .map((personaje) => ({
        originalId: personaje.id,
        nom: personaje.nom,
        imatge: personaje.imatge,
      }))
      .sort(() => Math.random() - 0.5)
      .map((carta, index) => ({ ...carta, id: index }));

    setCartasBarajadas(nuevaBaraja);
    setEstadoTarjetas({});
    setContadores({});
    setSeleccionadas([]);
    setPuntuacion(0);
    setBloqueado(false);
    setHasGanado(false);
  };

  return (
    <ClickProvider>
      <Header />
      <video
        className="fixed top-[80px] left-0 w-full h-[calc(100%-64px)] object-cover z-[-1]"
        src="./assets/fondo-juego.mp4"
        autoPlay
        loop
        muted
      />

      <main className="min-h-screen bg-gradient-to-r from-rose-500/5 via-fuchsia-500/5 to-purple-500/5 p-4 sm:p-6 md:p-8 z-1">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white backdrop-blur-sm rounded-lg shadow-xl border border-gray-300 p-1 mb-4 w-75 mx-auto">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent text-center animate-fade-in py-1">
              Juego de Memoria
            </h1>
          </div>

          <div className="text-center text-white font-semibold text-lg mb-4">
            Puntuación: <span className="text-purple-300">{puntuacion}</span>
          </div>

          <div className="bg-black/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700 p-6 mb-8">
            <GrupoTarjetas
              personajes={cartasBarajadas}
              estadoTarjetas={estadoTarjetas}
              contadores={contadores}
              manejarClick={manejarClick}
            />

            <div className="flex justify-center mt-6">
              <button
                onClick={reiniciarJuego}
                className="bg-gradient-to-r from-rose-600 to-purple-600 text-white px-5 py-2 rounded-lg hover:scale-105 transition-transform">
                Reiniciar Juego
              </button>
            </div>
          </div>
        </div>

        {hasGanado && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm text-center space-y-4 animate-fade-in">
              <h2 className="text-2xl font-bold text-purple-700">
                ¡Felicidades! 🎉
              </h2>
              <p className="text-gray-700">Has encontrado todas las parejas.</p>
              <button
                onClick={reiniciarJuego}
                className="bg-gradient-to-r from-purple-600 to-rose-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform">
                Volver a jugar
              </button>
            </div>
          </div>
        )}
      </main>
    </ClickProvider>
  );
}
