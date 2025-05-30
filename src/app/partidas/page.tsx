"use client";
import { useEffect, useState } from "react";

export default function Partidas() {
  const [partidas, setPartidas] = useState<any[]>([]);
  const [todasPartidas, setTodasPartidas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"mis" | "todas">("mis");

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageAdmin, setCurrentPageAdmin] = useState(1);
  const partidasPorPagina = 5;

  const partidasAMostrar = partidas.slice(
    (currentPage - 1) * partidasPorPagina,
    currentPage * partidasPorPagina
  );

  const partidasAdminAMostrar = todasPartidas.slice(
    (currentPageAdmin - 1) * partidasPorPagina,
    currentPageAdmin * partidasPorPagina
  );

  const totalPages = Math.ceil(partidas.length / partidasPorPagina);
  const totalPagesAdmin = Math.ceil(todasPartidas.length / partidasPorPagina);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      setIsAdmin(role === "admin");

      if (!token) {
        console.error("Token no encontrado");
        setLoading(false);
        return;
      }

      try {
        // Fetch partidas del usuario
        const url =
          "https://laravelm7-luislp-production.up.railway.app/api/games";
        const respuesta = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const respuestaJson = await respuesta.json();
        setPartidas(respuestaJson.games || []);

        // Si es admin, fetch todas las partidas
        if (role === "admin") {
          const fullUrl =
            "https://laravelm7-luislp-production.up.railway.app/api/full/games";
          const fullRespuesta = await fetch(fullUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const fullRespuestaJson = await fullRespuesta.json();
          setTodasPartidas(fullRespuestaJson.data || []);
        }
      } catch (error) {
        console.error("Error al obtener las partidas:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function eliminarPartida(id: number) {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }

    try {
      const url = `https://laravelm7-luislp-production.up.railway.app/api/games/${id}`;
      const respuesta = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (respuesta.ok) {
        setPartidas((prevPartidas) =>
          prevPartidas.filter((partida) => partida.id !== id)
        );
        setTodasPartidas((prevTodasPartidas) =>
          prevTodasPartidas.filter((partida) => partida.id !== id)
        );
        console.log(`Partida con ID ${id} eliminada`);
      } else {
        console.error("Error al eliminar la partida");
      }
    } catch (error) {
      console.error("Error al eliminar la partida:", error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <video
        className="w-full h-full object-cover z-[5]"
        src="./assets/fondo-juego.mp4"
        autoPlay
        loop
        muted
      ></video>
      <div className="absolute z-10 bg-black/80 p-8 rounded-xl max-w-4xl text-center backdrop-blur-lg shadow-2xl border border-gray-700">
        {/* Tabs */}
        <div className="flex mb-8">
          <button
            className={`px-6 py-3 text-lg font-bold rounded-t-lg ${
              activeTab === "mis"
                ? "bg-white text-black"
                : "bg-gray-700 text-white"
            }`}
            onClick={() => setActiveTab("mis")}
          >
            Mis Partidas
          </button>
          {isAdmin && (
            <button
              className={`px-6 py-3 text-lg font-bold rounded-t-lg ml-2 ${
                activeTab === "todas"
                  ? "bg-white text-black"
                  : "bg-gray-700 text-white"
              }`}
              onClick={() => setActiveTab("todas")}
            >
              Todas las Partidas
            </button>
          )}
        </div>

        {/* Tab Content */}
        {loading ? (
          <p className="text-lg text-gray-300 animate-pulse">
            Cargando partidas...
          </p>
        ) : activeTab === "mis" ? (
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-xl rounded-lg overflow-hidden border border-gray-300">
              <thead className="bg-gradient-to-r from-gray-900 to-gray-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-lg font-semibold tracking-wide">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-semibold tracking-wide">
                    Duración
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-semibold tracking-wide">
                    Clicks
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-semibold tracking-wide">
                    Puntuación
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-semibold tracking-wide">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {partidasAMostrar.map((item) => (
                  <tr
                    key={item.id}
                    className="text-center border-t hover:bg-gray-300 transition-colors"
                  >
                    <td className="px-6 py-4 text-lg font-medium text-gray-800">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-lg font-medium text-gray-800">
                      {item.duració || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-lg font-medium text-gray-800">
                      {item.clics ?? "N/A"}
                    </td>
                    <td className="px-6 py-4 text-lg font-medium text-gray-800">
                      {item.puntuació ?? "N/A"}
                    </td>
                    <td className="px-6 py-4 text-lg font-medium text-gray-800">
                      <button
                        onClick={() => eliminarPartida(item.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Paginación para mis partidas */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="text-white">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        ) : (
          isAdmin && (
            <>
              <h2 className="text-4xl font-extrabold mb-4 text-white tracking-wide">
                Totes les Partides de TOTS els Usuaris
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-xl rounded-lg overflow-hidden border border-gray-300">
                  <thead className="bg-gradient-to-r from-gray-900 to-gray-700 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-lg font-semibold tracking-wide">
                        Usuari
                      </th>
                      <th className="px-6 py-4 text-left text-lg font-semibold tracking-wide">
                        Fecha
                      </th>
                      <th className="px-6 py-4 text-left text-lg font-semibold tracking-wide">
                        Duració
                      </th>
                      <th className="px-6 py-4 text-left text-lg font-semibold tracking-wide">
                        Clicks
                      </th>
                      <th className="px-6 py-4 text-left text-lg font-semibold tracking-wide">
                        Puntuació
                      </th>
                      <th className="px-6 py-4 text-left text-lg font-semibold tracking-wide">
                        Accions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {partidasAdminAMostrar.map((item) => (
                      <tr
                        key={item.id}
                        className="text-center border-t hover:bg-gray-300 transition-colors"
                      >
                        <td className="px-6 py-4 text-lg font-medium text-gray-800">
                          {item.user?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-lg font-medium text-gray-800">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-lg font-medium text-gray-800">
                          {item.duració || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-lg font-medium text-gray-800">
                          {item.clics ?? "N/A"}
                        </td>
                        <td className="px-6 py-4 text-lg font-medium text-gray-800">
                          {item.puntuació ?? "N/A"}
                        </td>
                        <td className="px-6 py-4 text-lg font-medium text-gray-800">
                          <button
                            onClick={() => eliminarPartida(item.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Paginación para admin */}
                {totalPagesAdmin > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPageAdmin((p) => Math.max(1, p - 1))
                      }
                      disabled={currentPageAdmin === 1}
                      className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <span className="text-white">
                      {currentPageAdmin} / {totalPagesAdmin}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPageAdmin((p) =>
                          Math.min(totalPagesAdmin, p + 1)
                        )
                      }
                      disabled={currentPageAdmin === totalPagesAdmin}
                      className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
