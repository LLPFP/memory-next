"use client";

import React, { useState, useEffect } from "react";
import { Image as ImageIcon, PlusCircle } from "lucide-react";

interface Card {
  id: number;
  nom: string;
  imatge: string;
  category_id: number;
  user_id: number | null;
  created_at: string;
  updated_at: string;
}

function Cards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [cardEditing, setCardEditing] = useState<number | null>(null);
  const [cardEdited, setCardEdited] = useState<Card | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState({
    nom: "",
    imatge: "",
    category_id: 1,
  });
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
    useEffect(() => {
        const fetchCards = async () => {
            try {
                const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
                let url = "";
                if (role === "admin") {
                    url = "/api/cards";
                } else {
                    url = "https://laravelm7-luislp-production.up.railway.app/api/my-cards";
                }
                const response = await fetch(url, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                if (!response.ok) throw new Error("Error al obtener cartas");
                const data = await response.json();
                if (Array.isArray(data)) {
                    setCards(data);
                } else if (Array.isArray(data.cards)) {
                    setCards(data.cards);
                } else if (Array.isArray(data.data)) {
                    setCards(data.data);
                } else {
                    setCards([]);
                }
            } catch (error) {
                console.error("Error al cargar cartas:", error);
                setCards([]);
            }
        };
        fetchCards();
    }, [token]);


  const handleDeleteCard = async (cardId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta carta?")) return;
    try {
      const res = await fetch(
        `https://laravelm7-luislp-production.up.railway.app/api/cards/${cardId}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (!res.ok) throw new Error("No se pudo eliminar la carta");
      setCards((prev) => prev.filter((c) => c.id !== cardId));
    } catch (error) {
      console.error("Error al eliminar carta:", error);
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://laravelm7-luislp-production.up.railway.app/api/cards",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(newCard),
        }
      );
      if (!res.ok) throw new Error("No se pudo crear la carta");
      const created = await res.json();
      // Adaptar a la estructura real de la respuesta
      const card =
        created.card ||
        created.data ||
        created; // fallback si viene directo
      setCards((prev) => [...prev, card]);
      setNewCard({ nom: "", imatge: "", category_id: 1 });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error al crear carta:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
        <ImageIcon className="w-6 h-6 text-green-500" />
        Cartas
      </h2>
      {/* Formulario para añadir carta */}
      <button
        className="mb-4 flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded transition"
        onClick={() => setShowAddForm((v) => !v)}
      >
        <PlusCircle className="w-5 h-5" />
        {showAddForm ? "Cancelar" : "Añadir carta"}
      </button>
      {showAddForm && (
        <form
          onSubmit={handleAddCard}
          className="mb-4 flex flex-wrap gap-2 items-center justify-center"
        >
          <input
            className="border rounded px-2 py-1"
            placeholder="Nombre"
            value={newCard.nom}
            onChange={(e) =>
              setNewCard((c) => ({ ...c, nom: e.target.value }))
            }
            required
          />
          <input
            className="border rounded px-2 py-1"
            placeholder="URL Imagen"
            value={newCard.imatge}
            onChange={(e) =>
              setNewCard((c) => ({ ...c, imatge: e.target.value }))
            }
            required
          />
          <input
            className="border rounded px-2 py-1 w-24"
            type="number"
            min={1}
            placeholder="Categoría"
            value={newCard.category_id}
            onChange={(e) =>
              setNewCard((c) => ({
                ...c,
                category_id: Number(e.target.value),
              }))
            }
            required
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
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
              <th className="py-2 px-4 text-center">Imagen</th>
              <th className="py-2 px-4 text-center">Categoría</th>
              <th className="py-2 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => (
              <tr
                key={card.id}
                className="border-t hover:bg-green-50 transition-colors text-center"
              >
                {cardEditing === card.id ? (
                  <>
                    <td className="py-2 px-4 font-mono text-gray-500">
                      {card.id}
                    </td>
                    <td className="py-2 px-4">
                      <input
                        className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-green-300 text-center"
                        value={cardEdited?.nom || ""}
                        onChange={(e) =>
                          setCardEdited({
                            ...cardEdited!,
                            nom: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td className="py-2 px-4">
                      <input
                        className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-green-300 text-center"
                        value={cardEdited?.imatge || ""}
                        onChange={(e) =>
                          setCardEdited({
                            ...cardEdited!,
                            imatge: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td className="py-2 px-4">
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-green-300 text-center"
                        value={cardEdited?.category_id || ""}
                        onChange={(e) =>
                          setCardEdited({
                            ...cardEdited!,
                            category_id: Number(e.target.value),
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
                              `https://laravelm7-luislp-production.up.railway.app/api/cards/${card.id}`,
                              {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json",
                                  ...(token
                                    ? { Authorization: `Bearer ${token}` }
                                    : {}),
                                },
                                body: JSON.stringify(cardEdited),
                              }
                            );
                            if (!res.ok) throw new Error("Error al guardar");
                            const updated = await res.json();
                            setCards((prev) =>
                              prev.map((c) =>
                                c.id === updated.id ? updated : c
                              )
                            );
                            setCardEditing(null);
                            setCardEdited(null);
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
                          setCardEditing(null);
                          setCardEdited(null);
                        }}
                      >
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-2 px-4 font-mono text-gray-500">
                      {card.id}
                    </td>
                    <td className="py-2 px-4">{card.nom}</td>
                    <td className="py-2 px-4">
                      <img
                        src={card.imatge}
                        alt={card.nom}
                        className="w-12 h-12 object-cover mx-auto rounded"
                      />
                    </td>
                    <td className="py-2 px-4">{card.category_id}</td>
                    <td className="py-2 px-4 flex gap-2 justify-center">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                        title="Editar"
                        onClick={() => {
                          setCardEditing(card.id);
                          setCardEdited(card);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                        title="Eliminar"
                        onClick={() => handleDeleteCard(card.id)}
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

export default Cards;
