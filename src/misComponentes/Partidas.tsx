"use client";

import { Gamepad2 } from "lucide-react";
import React, { useState, useEffect } from "react";

type Partida = {
    id: number;
    user_id: number;
    duració: string;
    puntuació: number;
    clics: number;
    created_at: string;
    updated_at: string;
};

function Partidas() {
    const [partidas, setPartidas] = useState<Partida[]>([]);
    const [editId, setEditId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<Partial<Partida>>({});

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

    // Añadir partida (POST)
    async function handleAdd() {
        const token = localStorage.getItem('token');
        const nuevaPartida = {
            user_id: Number(prompt("ID de usuario:")),
            duració: prompt("Duración (en segundos):") || "0",
            puntuació: Number(prompt("Puntuación:")),
            clics: Number(prompt("Clics:")),
        };
        try {
            const response = await fetch("https://laravelm7-luislp-production.up.railway.app/api/full/games", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(nuevaPartida),
            });
            if (response.ok) {
                const data = await response.json();
                setPartidas([...partidas, data]);
            } else {
                alert("Error al añadir partida");
            }
        } catch (error) {
            alert("Error al añadir partida");
        }
    }

    // Editar partida (inline)
    function handleEdit(partida: Partida) {
        setEditId(partida.id);
        setEditValues({
            puntuació: partida.puntuació,
            clics: partida.clics,
            duració: partida.duració,
        });
    }

    function handleEditChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setEditValues((prev) => ({
            ...prev,
            [name]: name === "puntuació" || name === "clics" ? Number(value) : value,
        }));
    }

    async function handleEditSave(partida: Partida) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`https://laravelm7-luislp-production.up.railway.app/api/full/games/${partida.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    ...partida,
                    puntuació: editValues.puntuació,
                    clics: editValues.clics,
                    duració: editValues.duració,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                setPartidas(partidas.map(p => p.id === partida.id ? data : p));
                setEditId(null);
                setEditValues({});
            } else {
                alert("Error al editar partida");
            }
        } catch (error) {
            alert("Error al editar partida");
        }
    }

    function handleEditCancel() {
        setEditId(null);
        setEditValues({});
    }

    // Eliminar partida (DELETE)
    async function handleDelete(id: number) {
        if (confirm("¿Seguro que quieres eliminar esta partida?")) {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`https://laravelm7-luislp-production.up.railway.app/api/full/games/${id}`, {
                    method: "DELETE",
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                if (response.ok) {
                    setPartidas(partidas.filter(p => p.id !== id));
                } else {
                    alert("Error al eliminar partida");
                }
            } catch (error) {
                alert("Error al eliminar partida");
            }
        }
    }

    return (
        <div className="flex justify-center items-center ">
            <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
                    <Gamepad2 className="w-6 h-6 text-purple-500" />
                    Partidas
                </h2>
                <button
                    className="mb-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                    onClick={() => handleAdd()}
                >
                    Añadir Partida
                </button>
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
                                <th className="py-2 px-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partidas.map((partida) => (
                                <tr key={partida.id} className="border-t">
                                    <td className="py-2 px-4">{partida.id}</td>
                                    <td className="py-2 px-4">{partida.user_id}</td>
                                    <td className="py-2 px-4">
                                        {editId === partida.id ? (
                                            <input
                                                type="text"
                                                name="duració"
                                                value={editValues.duració ?? ""}
                                                onChange={handleEditChange}
                                                className="border rounded px-1 w-16"
                                            />
                                        ) : (
                                            `${partida.duració}s`
                                        )}
                                    </td>
                                    <td className="py-2 px-4">
                                        {editId === partida.id ? (
                                            <input
                                                type="number"
                                                name="puntuació"
                                                value={editValues.puntuació ?? ""}
                                                onChange={handleEditChange}
                                                className="border rounded px-1 w-16"
                                            />
                                        ) : (
                                            `${partida.puntuació}pts`
                                        )}
                                    </td>
                                    <td className="py-2 px-4">
                                        {editId === partida.id ? (
                                            <input
                                                type="number"
                                                name="clics"
                                                value={editValues.clics ?? ""}
                                                onChange={handleEditChange}
                                                className="border rounded px-1 w-16"
                                            />
                                        ) : (
                                            partida.clics
                                        )}
                                    </td>
                                    <td className="py-2 px-4">
                                        {new Date(partida.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="py-2 px-4">
                                        {new Date(partida.updated_at).toLocaleDateString()}
                                    </td>
                                    <td className="py-2 px-4 flex gap-2">
                                        {editId === partida.id ? (
                                            <>
                                                <button
                                                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                                    onClick={() => handleEditSave(partida)}
                                                >
                                                    Guardar
                                                </button>
                                                <button
                                                    className="px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                                                    onClick={handleEditCancel}
                                                >
                                                    Cancelar
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                                    onClick={() => handleEdit(partida)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                                    onClick={() => handleDelete(partida.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Partidas;