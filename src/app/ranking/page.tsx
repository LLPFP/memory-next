"use client";
import { useEffect, useState } from "react";
import { FaMedal } from "react-icons/fa";

export default function Ranking() {
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRanking() {
      const url =
        "https://laravelm7-luislp-production.up.railway.app/api/ranking";
      const token = localStorage.getItem("token");
      const respuesta = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const respuestaJson = await respuesta.json();
      console.log("Respuesta de la API:", respuestaJson);
      setRanking(respuestaJson.data || []);
      setLoading(false);
    }
    fetchRanking();
  }, []);

  const getMedalIcon = (position: number) => {
    if (position === 1) return <FaMedal className="text-yellow-500 text-2xl" />;
    if (position === 2) return <FaMedal className="text-gray-400 text-2xl" />;
    if (position === 3) return <FaMedal className="text-orange-500 text-2xl" />;
    if (position > 3) {
      return <span className="text-gray-600 text-2xl">{position}</span>;
    }
    return position;
  };

  return (
    <>
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
            Ranking
          </h1>
          {loading ? (
            <p className="text-lg text-gray-300 animate-pulse">
              Cargando ranking...
            </p>
          ) : ranking.length === 0 ? (
            <p className="text-lg text-gray-300">No hay datos de ranking.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-xl rounded-lg overflow-hidden border border-gray-300">
                <thead className="bg-gradient-to-r from-gray-900 to-gray-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-lg font-semibold tracking-wide">
                      Posición
                    </th>
                    <th className="px-6 py-4 text-left text-lg font-semibold tracking-wide">
                      Jugador
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
                  {ranking.map((item, idx) => (
                    <tr
                      key={item.user_id}
                      className={`text-center border-t ${
                        idx % 2 === 0 ? "bg-gray-100" : "bg-gray-50"
                      } hover:bg-gray-300 transition-colors`}
                    >
                      <td className="px-6 py-4 text-lg font-medium text-gray-800 flex items-center justify-center gap-2">
                        {getMedalIcon(idx + 1)}
                      </td>
                      <td className="px-6 py-4 text-lg font-medium text-gray-800">
                        {item.user?.name || "Desconocido"}
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
    </>
  );
}
