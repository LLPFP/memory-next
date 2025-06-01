"use client";

import React, { useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
  role: string;
};

export default function PerfilPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "https://laravelm7-luislp-production.up.railway.app/api/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const { data } = await response.json();
          setUser(data);
        } else {
          console.error("Error fetching user data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "https://laravelm7-luislp-production.up.railway.app/api/logout",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        localStorage.removeItem("token");
        setUser(null);
        alert("Logout exitoso");
      } else {
        console.error("Error en el logout:", response.statusText);
      }
    } catch (error) {
      console.error("Error en el logout:", error);
    }
    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="text-center text-white text-xl font-semibold animate-pulse">
          Cargando perfil...
        </div>
      </div>
    );
  if (!user)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-red-500 to-orange-500">
        <div className="text-center text-white text-xl font-semibold">
          No se pudo cargar el perfil.
        </div>
      </div>
    );

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border border-gray-300 rounded-lg shadow-lg bg-gradient-to-br from-white to-gray-100">
      <h2 className="text-3xl font-bold mb-4 text-gray-800 border-b-2 border-gray-300 pb-2">
        Perfil de usuario
      </h2>
      <div className="space-y-4">
        <p className="text-gray-700 text-lg">
          <strong className="font-semibold text-blue-600">Nombre:</strong>
          <span className="text-gray-900"> {user.name}</span>
        </p>
        <p className="text-gray-700 text-lg">
          <strong className="font-semibold text-blue-600">Email:</strong>
          <span className="text-gray-900"> {user.email}</span>
        </p>
        <p className="text-gray-700 text-lg">
          <strong className="font-semibold text-blue-600">Rol:</strong>
          <span className="text-gray-900">{user.role}</span>
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
