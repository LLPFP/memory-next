"use client";

import React, { useEffect, useState } from "react";
import Usuarios from "@/misComponentes/Usuarios"; 
import Partidas from "@/misComponentes/Partidas"; 
import Cards from "@/misComponentes/Cards"; 
import Categorias from "@/misComponentes/Categorias"; // <--- Añadido

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("usuarios");
  const [isAdmin, setIsAdmin] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    // Detectar si el usuario es admin leyendo el role de localStorage
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role");
      setIsAdmin(role === "admin");
      // Si no es admin, forzar tab inicial a "cards"
      if (role !== "admin") setActiveTab("cards");
    }
    const fetchData = async () => {
      try {
        const [ ] =
          await Promise.all([
            fetch(
              "https://laravelm7-luislp-production.up.railway.app/api/categories",
              {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
              }
            ),
          ]);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="p-8 text-center text-lg text-gray-600">
        Cargando dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 md:px-12">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Panel de Administración
      </h1>
      <div className="mb-6 flex justify-center gap-4">
        {isAdmin && (
          <>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === "usuarios" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setActiveTab("usuarios")}
            >
              Usuarios
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === "partidas"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setActiveTab("partidas")}
            >
              Partidas
            </button>
          </>
        )}
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "categorias"
              ? "bg-green-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("categorias")}
        >
          Categorías
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "cards" ? "bg-orange-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("cards")}
        >
          Cards
        </button>
      </div>
      <div>
        {isAdmin && activeTab === "usuarios" && <Usuarios />}
        {isAdmin && activeTab === "partidas" && <Partidas />}
        {activeTab === "categorias" && <Categorias />}
        {activeTab === "cards" && <Cards />}
      </div>
    </div>
  );
}
