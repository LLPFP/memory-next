"use client";

import GrupoTarjetas from "@/misComponentes/GrupoTarjetas";
import { ClickProvider } from "@/app/context/clickContext";
import { useState, useEffect } from "react";

type Carta = {
  id: number;
  originalId: number;
  nom: string;
  imatge: string;
  category_id?: number; // Cambia a category_id si así viene de la API
};

type Categoria = {
  id: number;
  name: string;
  cards?: Carta[]; // <-- Corrige el tipado aquí
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
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
  const [cartasFiltradas, setCartasFiltradas] = useState<Carta[]>([]);
  const [finPartida, setFinPartida] = useState<null | "victoria" | "derrota">(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Inicia sesión para jugar");
      window.location.href = "/login";
      return;
    }

    // Obtener categorías de la API
    async function fetchCategorias() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://laravelm7-luislp-production.up.railway.app/api/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log("Respuesta completa de la API:", data); // Log para depuración

        const categoriasArray = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
        if (categoriasArray.length > 0) {
          const categoriasProcesadas = categoriasArray.map((cat: { id: number; name: string; cards?: Carta[] }) => ({
            ...cat,
            name: cat.name,
            cards: Array.isArray(cat.cards) ? cat.cards : [], // Asegura que siempre sea array
          }));
          setCategorias(categoriasProcesadas);
          console.log("Categorías procesadas:", categoriasProcesadas); // Log para depuración
        } else {
          console.error("La respuesta de la API no contiene categorías válidas.");
          setCategorias([]);
        }
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        setCategorias([]);
      }
    }
    fetchCategorias();

  }, []); // Solo ejecuta una vez al montar

  // Filtrar cartas cada vez que cambia la categoría seleccionada
  useEffect(() => {
    if (categoriaSeleccionada !== null) {
      // Buscar la categoría seleccionada en el array de categorías
      const categoria = categorias.find(cat => cat.id === categoriaSeleccionada);
      const cartasCategoria = categoria && Array.isArray(categoria.cards)
        ? categoria.cards.map((c) => ({
            ...c,
            originalId: c.id,
            nom: c.nom,
            imatge: c.imatge,
            category_id: c.category_id,
          }))
        : [];
      setCartasFiltradas(cartasCategoria);
    } else {
      setCartasFiltradas([]);
    }
  }, [categoriaSeleccionada, categorias]);

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
      setFinPartida("derrota");
      const tiempoUsado = 20 - tiempo; // Calcula el tiempo usado
      console.log("¡Has perdido!");
      console.log(`Puntuación final: ${puntuacion}`);
      console.log(`Tiempo usado: ${tiempoUsado}`);
      console.log(`Clics finales: ${contadores}`);

      async function guardarDatosJuego() {
        const gameId = localStorage.getItem("gameId");
        const url =
          "https://laravelm7-luislp-production.up.railway.app/api/games/" +
          gameId +
          "/finish";
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

  const barajarCartas = (): Carta[] => {
    return [...cartasFiltradas, ...cartasFiltradas]
      .map((personaje) => ({
        originalId: personaje.id,
        nom: personaje.nom,
        imatge: personaje.imatge,
        category_id: personaje.category_id,
      }))
      .sort(() => Math.random() - 0.5)
      .map((carta, index) => ({ ...carta, id: index }));
  };

  const comenzarJuego = () => {
    if (!categoriaSeleccionada) {
      alert("Selecciona una categoría para jugar");
      return;
    }
    // Verifica si la categoría tiene cartas
    const categoria = categorias.find(cat => cat.id === categoriaSeleccionada);
    if (!categoria || !categoria.cards || categoria.cards.length === 0) {
      alert("Esta categoría no tiene cartas disponibles.");
      return;
    }
    setCartasBarajadas(barajarCartas());
    setTiempo(20);
    setTiempoActivo(true);
    setJuegoIniciado(true);
    crearJuego();
  };

  const reiniciarJuego = () => {
    if (!categoriaSeleccionada) {
      setCartasBarajadas([]);
      setEstadoTarjetas({});
      setContadores({});
      setSeleccionadas([]);
      setPuntuacion(0);
      setBloqueado(false);
      setTiempoActivo(false);
      setJuegoIniciado(false);
      return;
    }
    const nuevaBaraja = [...cartasFiltradas, ...cartasFiltradas]
      .map((personaje) => ({
        originalId: personaje.id,
        nom: personaje.nom,
        imatge: personaje.imatge,
        category_id: personaje.category_id,
      }))
      .sort(() => Math.random() - 0.5)
      .map((carta, index) => ({ ...carta, id: index }));

    setCartasBarajadas(nuevaBaraja);
    setEstadoTarjetas({});
    setContadores({});
    setSeleccionadas([]);
    setPuntuacion(0);
    setBloqueado(false);
    setTiempoActivo(false);
    setJuegoIniciado(false);
    comenzarJuego();
  };

  const formatTiempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, "0")}`;
  };

  // Justo antes del return principal, añade este log para depuración:
  console.log("categorias para el selector:", categorias);

  useEffect(() => {
    // Solo ejecuta si el juego está iniciado y hay cartas
    if (
      juegoIniciado &&
      cartasBarajadas.length > 0 &&
      Object.values(estadoTarjetas).length === cartasBarajadas.length &&
      Object.values(estadoTarjetas).every((estado) => estado)
    ) {
      setTiempoActivo(false);
      setFinPartida("victoria");
      console.log("¡Has ganado!");
      console.log(`Puntuación final: ${puntuacion}`);
      console.log(`Tiempo restante: ${tiempo}`);
      console.log(`Clics finales: ${contadores}`);

      async function guardarDatosJuego() {
        const gameId = localStorage.getItem("gameId");
        const url =
          "https://laravelm7-luislp-production.up.railway.app/api/games/" +
          gameId +
          "/finish";
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
            duració: 20 - tiempo, // Calcula el tiempo usado
            clics: clicsFinales,
          }),
        });
        const respuestaJson = await respuesta.json();
        console.log(respuestaJson);
      }
      guardarDatosJuego();
    }
  }, [estadoTarjetas]); // Ejecuta cada vez que cambia el estado de las tarjetas

  const cerrarFinPartida = () => {
    setFinPartida(null);
    setTiempoActivo(false);
    setJuegoIniciado(false);
    setCartasBarajadas([]);
    setEstadoTarjetas({});
    setContadores({});
    setSeleccionadas([]);
    setPuntuacion(0);
    setBloqueado(false);
    setTiempo(20);
    setCategoriaSeleccionada(null);
    setCartasFiltradas([]);
  };

  return (
    <ClickProvider>
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
            <div className="flex flex-col items-center justify-center min-h-[300px] space-y-6">
                <div>
                <label className="block text-lg font-semibold mb-2 text-purple-700">
                  Selecciona una categoría:
                </label>
                <select
                  className="px-4 py-2 rounded-lg border border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={categoriaSeleccionada !== null ? categoriaSeleccionada : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCategoriaSeleccionada(value === "" ? null : Number(value));
                  }}
                >
                  <option value="">-- Elige una categoría --</option>
                  {categorias.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.id}
                    disabled={!cat.cards || cat.cards.length === 0}
                  >
                    {cat.name}
                    {!cat.cards || cat.cards.length === 0 ? " (sin cartas)" : ""}
                  </option>
                  ))}
                </select>
                {/* Mensaje si la categoría seleccionada no tiene cartas */}
                {categoriaSeleccionada &&
                  categorias.find((cat) => cat.id === categoriaSeleccionada)?.cards?.length === 0 && (
                  <div className="mt-2 text-red-600 text-sm">
                    Esta categoría no tiene cartas disponibles.
                  </div>
                  )}
                </div>
              <button
                onClick={comenzarJuego}
                className="bg-gradient-to-r from-purple-600 to-rose-500 text-white px-8 py-4 rounded-xl text-2xl font-bold shadow-lg hover:scale-105 transition-transform"
                disabled={
                  !categoriaSeleccionada ||
                  categorias.find((cat) => cat.id === categoriaSeleccionada)?.cards?.length === 0
                }
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

        {finPartida && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm text-center space-y-4 animate-fade-in">
              <h2 className="text-2xl font-bold text-purple-700">
                {finPartida === "victoria" ? "¡Has ganado! 🎉" : "¡Tiempo agotado! ⏰"}
              </h2>
              <p className="text-gray-700">
                {finPartida === "victoria"
                  ? "¡Felicidades, has encontrado todas las parejas!"
                  : "Se acabó el tiempo."}
              </p>
              <p className="text-gray-700">
                Tiempo: {formatTiempo(tiempo)}
              </p>
              <p className="text-gray-700">
                Puntuación: {puntuacion}
              </p>
                <div className="flex flex-col gap-4 mt-6">
                <button
                  onClick={reiniciarJuego}
                  className="bg-gradient-to-r from-purple-600 to-rose-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform"
                >
                  Volver a jugar
                </button>
                <button
                  onClick={cerrarFinPartida}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:scale-105 transition-transform"
                >
                  Cerrar
                </button>
                </div>
            </div>
          </div>
        )}
      </main>
    </ClickProvider>
  );
}
