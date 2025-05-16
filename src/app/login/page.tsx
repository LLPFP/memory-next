"use client";
import { useState } from "react";
import Header from "@/misComponentes/Header";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isRegistering) {
      // Registration logic
      if (!nombre || !email || !password) {
        setError("Todos los campos son obligatorios");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users") || "[]");

      // Check if user already exists
      const userExists = users.some((user: any) => user.email === email);
      if (userExists) {
        setError("Este email ya está registrado");
        return;
      }

      // Add new user
      users.push({ nombre, email, password });
      localStorage.setItem("users", JSON.stringify(users));

      // Auto login after registration
      localStorage.setItem("currentUser", JSON.stringify({ nombre, email }));
      router.push("/");
    } else {
      // Login logic
      if (!email || !password) {
        setError("Email y contraseña son obligatorios");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (user: any) => user.email === email && user.password === password
      );

      if (!user) {
        setError("Email o contraseña incorrectos");
        return;
      }

      // Set current user in localStorage
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          nombre: user.nombre,
          email: user.email,
        })
      );

      router.push("/");
    }
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
            {isRegistering ? "Registro" : "Login"}
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {(isRegistering || nombre) && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                  required={isRegistering}
                />
              </div>
            )}

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
              className="w-full py-3 px-4 text-white font-semibold rounded-lg bg-gradient-to-r from-rose-500 via-fuchsia-500 to-purple-500 hover:opacity-90 transform hover:scale-105 transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
              {isRegistering ? "Registrarse" : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-500 hover:underline">
              {isRegistering
                ? "¿Ya tienes cuenta? Inicia sesión"
                : "¿No tienes cuenta? Regístrate"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
