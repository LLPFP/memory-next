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
    user?: { id: number; name: string }; // Añadido para mostrar el nombre
};

function Partidas() {
    const [partidas, setPartidas] = useState<Partida[]>([]);
    const [editId, setEditId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<Partial<Partida>>({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);

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
                console.log("Partidas obtenidas:", partidasArray);
                setPartidas(partidasArray);
            } catch (error) {
                console.error('Error fetching partidas:', error);
            }
        };
        fetchPartidas();
    }, []);

    // Editar partida (inline)
    function handleEdit(partida: Partida) {
        setEditId(partida.id);
        setEditValues({
            puntuació: partida.puntuació,
            clics: partida.clics,
            duració: partida.duració,
        });
        setEditError(null);
        setShowEditModal(true);
    }

    function handleEditChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setEditValues((prev) => ({
            ...prev,
            [name]: name === "puntuació" || name === "clics" ? Number(value) : value,
        }));
    }

    async function handleEditSave() {
        if (!editId) return;
        // Validación simple
        if (
            editValues.puntuació === undefined ||
            editValues.clics === undefined ||
            !editValues.duració ||
            isNaN(Number(editValues.puntuació)) ||
            isNaN(Number(editValues.clics)) ||
            isNaN(Number(editValues.duració))
        ) {
            setEditError("Todos los campos deben ser válidos.");
            return;
        }
        const partida = partidas.find(p => p.id === editId);
        if (!partida) return;
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`https://laravelm7-luislp-production.up.railway.app/api/games/${editId}/finish`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    user_id: partida.user_id,
                    puntuació: Number(editValues.puntuació),
                    clics: Number(editValues.clics),
                    duració: editValues.duració.toString().replace(/[^0-9.]/g, ""),
                }),
            });
            if (response.ok) {
                const data = await response.json();
                const partidaActualizada = data.data ? data.data : data;
                setPartidas(partidas.map(p => p.id === editId ? { ...p, ...partidaActualizada } : p));
                setEditId(null);
                setEditValues({});
                setShowEditModal(false);
                setEditError(null);
            } else {
                let msg = "Error al editar partida";
                try {
                    const err = await response.json();
                    if (err && err.message) msg = err.message;
                    else if (err && typeof err === "string") msg = err;
                } catch {}
                setEditError(msg);
            }
        } catch (error) {
            console.error('Error al editar partida:', error);

            setEditError("Error al editar partida");
        }
    }

    function handleEditCancel() {
        setEditId(null);
        setEditValues({});
        setShowEditModal(false);
        setEditError(null);
    }

    // Eliminar partida (DELETE)
    async function handleDelete(id: number) {
        if (confirm("¿Seguro que quieres eliminar esta partida?")) {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`https://laravelm7-luislp-production.up.railway.app/api/games/${id}`, {
                    method: "DELETE",
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                if (response.ok) {
                    setPartidas(partidas.filter(p => p.id !== id));
                } else {
                    alert("Error al eliminar partida");
                }
            } catch (error) {
                console.error('Error al eliminar partida:', error);
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
                <div className="overflow-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr>
                                <th className="py-2 px-4">ID</th>
                                <th className="py-2 px-4">Usuario</th>
                                <th className="py-2 px-4">Nombre</th>
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
                                    <td className="py-2 px-4">{partida.user?.name ?? "-"}</td>
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
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Modal de edición */}
            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px]">
                        <h3 className="text-lg font-semibold mb-4">Editar Partida</h3>
                        <div className="mb-2">
                            <label className="block text-sm">Duración (segundos):</label>
                            <input
                                type="number"
                                name="duració"
                                value={editValues.duració ?? ""}
                                onChange={handleEditChange}
                                className="border rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm">Puntuación:</label>
                            <input
                                type="number"
                                name="puntuació"
                                value={editValues.puntuació ?? ""}
                                onChange={handleEditChange}
                                className="border rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm">Clics:</label>
                            <input
                                type="number"
                                name="clics"
                                value={editValues.clics ?? ""}
                                onChange={handleEditChange}
                                className="border rounded px-2 py-1 w-full"
                            />
                        </div>
                        {editError && <div className="text-red-500 text-sm mb-2">{editError}</div>}
                        <div className="flex gap-2 mt-4">
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                onClick={handleEditSave}
                            >
                                Guardar
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                                onClick={handleEditCancel}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Partidas;