"use client";

import { Gamepad2 } from "lucide-react"; // Iconos modernos
import React, { useState, useEffect } from "react";

function Partidas(){
  const [partidas, setPartidas] = useState<Partida[]>([]);
    useEffect(() => {
      const fetchPartidas = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await fetch("https://laravelm7-luislp-production.up.railway.app/api/full/games", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          const data = await response.json();

          let partidasArray = [];
          if (Array.isArray(data)) {
            partidasArray = data;
          } else if (Array.isArray(data.data)) {
            partidasArray = data.data;
          } else if (Array.isArray(data.games)) {
            partidasArray = data.games;
          } else {
            partidasArray = [];
          }
          setPartidas(partidasArray);
        } catch (error) {
          console.error('Error fetching partidas:', error);
        }
      };

      fetchPartidas();
  }, []);

type Partida = {
  id: number;
  user_id: number;
  duració: string;
  puntuació: number;
  clics: number;
  created_at: string;
  updated_at: string;
};

    return( <div className="flex justify-center items-center ">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
                <Gamepad2 className="w-6 h-6 text-purple-500" />
                Partidas
              </h2>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="py-2 px-4">ID</th>
                      <th className="py-2 px-4">Usuario</th>
                      <th className="py-2 px-4">Duración</th>
                      <th className="py-2 px-4">Puntuación</th>
                      <th className="py-2 px-4">Clics</th>
                      <th className="py-2 px-4">Creado</th>
                      <th className="py-2 px-4">Actualizado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partidas.map((partida) => (
                      <tr key={partida.id} className="border-t">
                        <td className="py-2 px-4">{partida.id}</td>
                        <td className="py-2 px-4">{partida.user_id}</td>
                        <td className="py-2 px-4">{partida.duració}s</td>
                        <td className="py-2 px-4">{partida.puntuació}pts</td>
                        <td className="py-2 px-4">{partida.clics}</td>
                        <td className="py-2 px-4">
                          {new Date(partida.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4">
                          {new Date(partida.updated_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>)
}

export default Partidas;