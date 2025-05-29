"use client";
import { useEffect, useState } from "react";

export default function Partidas() {
  const [partidas, setPartidas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPartidas() {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        setLoading(false);
        return;
      }

      try {
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
        console.log("Respuesta de la API:", respuestaJson);
        setPartidas(respuestaJson.games || []);
      } catch (error) {
        console.error("Error al obtener las partidas:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPartidas();
  }, []);

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
        <h1 className="text-5xl font-extrabold mb-8 text-white tracking-wide">
          Mis Partidas
        </h1>
        {loading ? (
          <p className="text-lg text-gray-300 animate-pulse">
            Cargando partidas...
          </p>
        ) : (
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
                </tr>
              </thead>
              <tbody>
                {partidas.map((item) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
