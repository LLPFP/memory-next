"use client";

import GrupoTarjetas from "@/misComponentes/GrupoTarjetas";
import { Tarjetas } from "@/app/data/Tarjetas";
import Header from "@/misComponentes/Header";
import { ClickProvider } from "@/app/context/clickContext";
import { useState, useEffect, use } from "react";

type Carta = {
  id: number;
  originalId: number;
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
  const [tiempo, setTiempo] = useState(20);
  const [tiempoActivo, setTiempoActivo] = useState(false);
  const [juegoIniciado, setJuegoIniciado] = useState(false); // Nuevo estado

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Inicia sesión para jugar");
      window.location.href = "/login";
      return;
    }

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
    // setTiempoActivo(true); // Quitar esto, el juego no debe empezar aún
  }, []);

  useEffect(() => {
    let intervalo: NodeJS.Timeout;
    if (tiempoActivo && tiempo > 0) {
      intervalo = setInterval(() => {
        setTiempo((prevTiempo) => {
          if (prevTiempo <= 1) {
            setTiempoActivo(false);
            return 0;
          }
          return prevTiempo - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [tiempoActivo, tiempo]);

  const manejarClick = (id: number) => {
    if (estadoTarjetas[id] || bloqueado || tiempo === 0) return;

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
    if (tiempo === 0) {
      const tiempoUsado = 20 - tiempo; // Calcula el tiempo usado
      console.log("¡Has perdido!");
      console.log(`Puntuación final: ${puntuacion}`);
      console.log(`Tiempo usado: ${tiempoUsado}`);
      console.log(`Clics finales: ${contadores}`);

      async function guardarDatosJuego() {
        const gameId = localStorage.getItem("gameId");
        const url =
          "https://laravelm7-luislp-production.up.railway.app/api/games/" +
          gameId;
        const token = localStorage.getItem("token");
        const totalClics = Object.values(contadores).reduce((a, b) => a + b, 0);
        const clicsFinales = totalClics;
        const respuesta = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            puntuació: puntuacion,
            duració: tiempoUsado,
            clics: clicsFinales,
          }),
        });
        const respuestaJson = await respuesta.json();
        console.log(respuestaJson);
      }
      guardarDatosJuego();
    }
  }, [tiempo]);

  const crearJuego = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }
    const url = "https://laravelm7-luislp-production.up.railway.app/api/games";
    const respuesta = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });
    const respuestaJson = await respuesta.json();
    if (respuestaJson && respuestaJson.data.id) {
      localStorage.setItem("gameId", respuestaJson.data.id.toString());
    }
  };

  const comenzarJuego = () => {
    setTiempo(20);
    setTiempoActivo(true);
    setJuegoIniciado(true);
    crearJuego();
  };

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
    setTiempoActivo(false); // Detener el tiempo hasta que pulse "Comenzar"
    setJuegoIniciado(false); // Volver a mostrar el botón de inicio
    comenzarJuego(); // Reiniciar el juego
  };

  const formatTiempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, "0")}`;
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

          {!juegoIniciado ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <button
                onClick={comenzarJuego}
                className="bg-gradient-to-r from-purple-600 to-rose-500 text-white px-8 py-4 rounded-xl text-2xl font-bold shadow-lg hover:scale-105 transition-transform"
              >
                Comenzar Juego
              </button>
            </div>
          ) : (
            <div className="bg-black/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700 p-6 mb-8">
              <div className="flex justify-center gap-8 text-white font-semibold text-xl mb-6 bg-black/40 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-purple-500/30 max-w-md mx-auto">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">Puntuación:</span>
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold">
                    {puntuacion}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">Tiempo:</span>
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold">
                    {tiempo}
                  </span>
                </div>
              </div>
              <GrupoTarjetas
                personajes={cartasBarajadas}
                estadoTarjetas={estadoTarjetas}
                contadores={contadores}
                manejarClick={manejarClick}
              />

              <div className="flex justify-center mt-6">
                <button
                  onClick={reiniciarJuego}
                  className="bg-gradient-to-r from-rose-600 to-purple-600 text-white px-5 py-2 rounded-lg hover:scale-105 transition-transform"
                >
                  Reiniciar Juego
                </button>
              </div>
            </div>
          )}
        </div>

        {tiempo === 0 && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm text-center space-y-4 animate-fade-in">
              <h2 className="text-2xl font-bold text-purple-700">
                ¡Tiempo agotado! ⏰
              </h2>
              <p className="text-gray-700">Se acabó el tiempo.</p>
              <p className="text-gray-700">Tiempo: {formatTiempo(tiempo)}</p>
              <button
                onClick={reiniciarJuego}
                className="bg-gradient-to-r from-purple-600 to-rose-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform"
              >
                Volver a jugar
              </button>
            </div>
          </div>
        )}
      </main>
    </ClickProvider>
  );
}
