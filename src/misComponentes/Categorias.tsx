"use client";

import React, { useState, useEffect } from "react";
import { FolderPlus, PlusCircle } from "lucide-react";

interface Categoria {
  id: number;
  name: string;
  // Puedes añadir más campos si tu modelo lo requiere
}

function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaEditando, setCategoriaEditando] = useState<number | null>(null);
  const [categoriaEditada, setCategoriaEditada] = useState<Categoria | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoria, setNewCategoria] = useState({ name: "" });
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(
          "https://laravelm7-luislp-production.up.railway.app/api/categories",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        if (!response.ok) throw new Error("Error al obtener categorías");
        const data = await response.json();
        if (Array.isArray(data)) {
          setCategorias(data);
        } else if (Array.isArray(data.categories)) {
          setCategorias(data.categories);
        } else if (Array.isArray(data.data)) {
          setCategorias(data.data);
        } else {
          setCategorias([]);
        }
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        setCategorias([]);
      }
    };
    fetchCategorias();
  }, [token]);

  const handleDeleteCategoria = async (categoriaId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta categoría?")) return;
    try {
      const res = await fetch(
        `https://laravelm7-luislp-production.up.railway.app/api/categories/${categoriaId}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (!res.ok) throw new Error("No se pudo eliminar la categoría");
      setCategorias((prev) => prev.filter((c) => c.id !== categoriaId));
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
    }
  };

  const handleAddCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://laravelm7-luislp-production.up.railway.app/api/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(newCategoria),
        }
      );
      if (!res.ok) throw new Error("No se pudo crear la categoría");
      const created = await res.json();
      setCategorias((prev) => [...prev, created]);
      setNewCategoria({ name: "" });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error al crear categoría:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
        <FolderPlus className="w-6 h-6 text-yellow-500" />
        Categorías
      </h2>
      <button
        className="mb-4 flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1 rounded transition"
        onClick={() => setShowAddForm((v) => !v)}
      >
        <PlusCircle className="w-5 h-5" />
        {showAddForm ? "Cancelar" : "Añadir categoría"}
      </button>
      {showAddForm && (
        <form
          onSubmit={handleAddCategoria}
          className="mb-4 flex flex-wrap gap-2 items-center justify-center"
        >
          <input
            className="border rounded px-2 py-1"
            placeholder="Nombre"
            value={newCategoria.name}
            onChange={(e) =>
              setNewCategoria((c) => ({ ...c, name: e.target.value }))
            }
            required
          />
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition"
          >
            Guardar
          </button>
        </form>
      )}
      <div className="overflow-auto flex justify-center">
        <table className="w-auto text-sm mx-auto">
          <thead>
            <tr>
              <th className="py-2 px-4 text-center">ID</th>
              <th className="py-2 px-4 text-center">Nombre</th>
              <th className="py-2 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr
                key={categoria.id}
                className="border-t hover:bg-yellow-50 transition-colors text-center"
              >
                {categoriaEditando === categoria.id ? (
                  <>
                    <td className="py-2 px-4 font-mono text-gray-500">
                      {categoria.id}
                    </td>
                    <td className="py-2 px-4">
                      <input
                        className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-yellow-300 text-center"
                        value={categoriaEditada?.name || ""}
                        onChange={(e) =>
                          setCategoriaEditada({
                            ...categoriaEditada!,
                            name: e.target.value,
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
                              `https://laravelm7-luislp-production.up.railway.app/api/categories/${categoria.id}`,
                              {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json",
                                  ...(token
                                    ? { Authorization: `Bearer ${token}` }
                                    : {}),
                                },
                                body: JSON.stringify(categoriaEditada),
                              }
                            );
                            if (!res.ok) throw new Error("Error al guardar");
                            const updated = await res.json();
                            setCategorias((prev) =>
                              prev.map((c) =>
                                c.id === updated.id ? updated : c
                              )
                            );
                            setCategoriaEditando(null);
                            setCategoriaEditada(null);
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
                          setCategoriaEditando(null);
                          setCategoriaEditada(null);
                        }}
                      >
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-2 px-4 font-mono text-gray-500">
                      {categoria.id}
                    </td>
                    <td className="py-2 px-4">{categoria.name}</td>
                    <td className="py-2 px-4 flex gap-2 justify-center">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                        title="Editar"
                        onClick={() => {
                          setCategoriaEditando(categoria.id);
                          setCategoriaEditada(categoria);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                        title="Eliminar"
                        onClick={() => handleDeleteCategoria(categoria.id)}
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
}

export default Categorias;
