"use client";

import React, { useState } from "react";

interface User {
  name: string;
  email: string;
  role: string;
}

function AddUserForm({
  onUserAdded,
  token,
}: {
  onUserAdded: (user: User) => void;
  token: string | null;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://laravelm7-luislp-production.up.railway.app/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ name, email, role }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "No se pudo crear el usuario");
      }
      const nuevoUsuario = await res.json();
      onUserAdded(nuevoUsuario);
      setName("");
      setEmail("");
      setRole("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="flex gap-2 mb-6 items-end flex-wrap justify-center"
      onSubmit={handleSubmit}
    >
      <input
        className="border rounded px-2 py-1"
        placeholder="Nombre"
        value={name}
        required
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="Email"
        type="email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="Rol"
        value={role}
        required
        onChange={(e) => setRole(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
        disabled={loading}
      >
        {loading ? "Añadiendo..." : "Añadir"}
      </button>
      {error && <span className="text-red-500 text-sm ml-2">{error}</span>}
    </form>
  );
}
export default AddUserForm;
