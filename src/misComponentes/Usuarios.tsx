"use client";

import React, { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
import AddUserForm from "./AddUserForm";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

function Usuarios() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [usuarioEditando, setUsuarioEditando] = useState<number | null>(null);
  const [usuarioEditado, setUsuarioEditado] = useState<User | null>(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('https://laravelm7-luislp-production.up.railway.app/api/users', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!response.ok) throw new Error('Error al obtener usuarios');
        const data = await response.json();
        // Asegurarse de que data sea un array
        if (Array.isArray(data)) {
          setUsuarios(data);
        } else if (Array.isArray(data.data)) {
          setUsuarios(data.data);
        } else {
          setUsuarios([]);
        }
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        setUsuarios([]); // Evita que usuarios sea undefined/null
      }
    };

    fetchUsuarios();
  }, [token]);

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este usuario?")) return;
    try {
      const res = await fetch(
        `https://laravelm7-luislp-production.up.railway.app/api/users/${userId}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (!res.ok) throw new Error("No se pudo eliminar el usuario");
      setUsuarios((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
        <UserPlus className="w-6 h-6 text-blue-500" />
        Usuarios
      </h2>
      {/* Formulario para añadir usuario */}
      <AddUserForm
        onUserAdded={(user) =>
          setUsuarios((prev) => [...prev, user as User])
        }
        token={token}
      />
      <div className="overflow-auto  flex justify-center">
        <table className="w-auto text-sm mx-auto">
          <thead>
            <tr>
              <th className="py-2 px-4 text-center">ID</th>
              <th className="py-2 px-4 text-center">Nombre</th>
              <th className="py-2 px-4 text-center">Email</th>
              <th className="py-2 px-4 text-center">Rol</th>
              <th className="py-2 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr
                key={usuario.id}
                className="border-t hover:bg-blue-50 transition-colors text-center"
              >
                {usuarioEditando === usuario.id ? (
                  <>
                    <td className="py-2 px-4 font-mono text-gray-500">
                      {usuario.id}
                    </td>
                    <td className="py-2 px-4">
                      <input
                        className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-center"
                        value={usuarioEditado?.name || ""}
                        onChange={(e) =>
                          setUsuarioEditado({
                            ...usuarioEditado!,
                            name: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td className="py-2 px-4">
                      <input
                        className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-center"
                        value={usuarioEditado?.email || ""}
                        onChange={(e) =>
                          setUsuarioEditado({
                            ...usuarioEditado!,
                            email: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td className="py-2 px-4">
                      <input
                        className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-center"
                        value={usuarioEditado?.role || ""}
                        onChange={(e) =>
                          setUsuarioEditado({
                            ...usuarioEditado!,
                            role: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td className="py-2 px-4 flex gap-2 justify-center">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                        title="Guardar"
                        onClick={async () => {
                          try {
                            const res = await fetch(
                              `https://laravelm7-luislp-production.up.railway.app/api/users/${usuario.id}`,
                              {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json",
                                  ...(token
                                    ? { Authorization: `Bearer ${token}` }
                                    : {}),
                                },
                                body: JSON.stringify(usuarioEditado),
                              }
                            );
                            if (!res.ok) throw new Error("Error al guardar");
                            const updated = await res.json();
                            setUsuarios((prev) =>
                              prev.map((u) =>
                                u.id === updated.id ? updated : u
                              )
                            );
                            setUsuarioEditando(null);
                            setUsuarioEditado(null);
                          } catch (err) {
                            console.error("Error al guardar", err);
                          }
                        }}
                      >
                        Guardar
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                        title="Cancelar"
                        onClick={() => {
                          setUsuarioEditando(null);
                          setUsuarioEditado(null);
                        }}
                      >
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-2 px-4 font-mono text-gray-500">
                      {usuario.id}
                    </td>
                    <td className="py-2 px-4">{usuario.name}</td>
                    <td className="py-2 px-4">{usuario.email}</td>
                    <td className="py-2 px-4">{usuario.role}</td>
                    <td className="py-2 px-4 flex gap-2 justify-center">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                        title="Editar"
                        onClick={() => {
                          setUsuarioEditando(usuario.id);
                          setUsuarioEditado(usuario);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                        title="Eliminar"
                        onClick={() => handleDeleteUser(usuario.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}export default Usuarios;
