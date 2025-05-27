"use client";
import { useState } from "react";
import Header from "@/misComponentes/Header";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      email: email,
      password: password,
    };
    console.log(data);

    async function login() {
      const url =
        "https://laravelm7-luislp-production.up.railway.app/api/login";
      try {
        const respuesta = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        if (!respuesta.ok) {
          throw new Error("Credenciales incorrectas");
        }

        const respuestaJson = await respuesta.json();
        console.log(respuestaJson);
        localStorage.setItem("token", respuestaJson.token);
        window.location.href = "/home";
      } catch (error) {
        alert("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
      }
    }
    login();
  };

  return (
    <>
      <Header />
      <video
        className="fixed top-[80px] left-0 w-full h-[calc(100%-64px)] object-cover z-[-1] opacity-100"
        src="/assets/fondo-juego.mp4"
        autoPlay
        loop
        muted
      />

      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-4xl font-bold mb-6 text-center">
            Iniciar Sesión
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 text-white font-semibold rounded-lg bg-gradient-to-r from-rose-500 via-fuchsia-500 to-purple-500 hover:opacity-90 transform hover:scale-105 transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
