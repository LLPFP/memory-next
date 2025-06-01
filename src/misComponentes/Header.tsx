"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Encabezado() {
  const router = useRouter();
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const [haHechoScroll, setHaHechoScroll] = useState(false);
  const [nombre, setNombre] = useState();

  useEffect(() => {
    const manejarScroll = () => setHaHechoScroll(window.scrollY > 50);
    window.addEventListener("scroll", manejarScroll);

    async function leerPerfil() {
      const url = "https://laravelm7-luislp-production.up.railway.app/api/me";
      const token = localStorage.getItem("token");
      const respuesta = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const respuestaJson = await respuesta.json();
      console.log("Datos cargados del user:", respuestaJson);
      setNombre(respuestaJson.data.name);
      localStorage.setItem("role", respuestaJson.data.role);
    }

    leerPerfil();
    return () => window.removeEventListener("scroll", manejarScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-gradient-to-r from-rose-500/5 via-fuchsia-500/5 to-purple-500/5 backdrop-blur-lg transition-all duration-300",
        haHechoScroll
          ? "shadow-xl border-b border-white/10"
          : "border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Logo */}
        <div
          onClick={() => router.push("/home")}
          className="flex items-center space-x-2 group cursor-pointer"
        >
          <span className="text-3xl transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
            🃏
          </span>
          <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
            Juego de Memoria
          </span>
        </div>

        {/* escritorio */}
        <nav className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-4">
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className="relative px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-purple-400 transition-all hover:scale-110 duration-300 cursor-pointer"
                >
                  <button onClick={() => router.push("/")}>
                    <span className="relative z-10">Inicio</span>
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className="relative px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-purple-400 transition-all hover:scale-110 duration-300 cursor-pointer"
                >
                  <button onClick={() => router.push("/juego")}>
                    <span className="relative z-10">Juego</span>
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className="relative px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-purple-400 transition-all hover:scale-110 duration-300 cursor-pointer"
                >
                  <button onClick={() => router.push("/acerca")}>
                    <span className="relative z-10">Acerca</span>
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {!nombre ? (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className="relative px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-purple-400 transition-all hover:scale-110 duration-300 cursor-pointer"
                    >
                      <button onClick={() => router.push("/login")}>
                        <span className="relative z-10">Login</span>
                      </button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className="relative px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-purple-400 transition-all hover:scale-110 duration-300 cursor-pointer"
                    >
                      <button onClick={() => router.push("/registro")}>
                        <span className="relative z-10">Registro</span>
                      </button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </>
              ) : (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className="relative px-4 py-2.5 text-sm font-medium text-purple-400 transition-all hover:scale-110 duration-300 cursor-pointer"
                    >
                      <button onClick={() => router.push("/perfil")}>
                        <span className="relative z-10">{nombre}</span>
                      </button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className="relative px-4 py-2.5 text-sm font-medium text-purple-400 transition-all hover:scale-110 duration-300 cursor-pointer"
                    >
                      <button onClick={() => router.push("/ranking")}>
                        <span className="relative z-10">Ranking</span>
                      </button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className="relative px-4 py-2.5 text-sm font-medium text-purple-400 transition-all hover:scale-110 duration-300 cursor-pointer"
                    >
                      <button onClick={() => router.push("/partidas")}>
                        <span className="relative z-10">Partidas</span>
                      </button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className="relative px-4 py-2.5 text-sm font-medium text-purple-400 transition-all hover:scale-110 duration-300 cursor-pointer"
                    >
                      <button onClick={() => router.push("/dashboard")}>
                        <span className="relative z-10">Dashboard</span>
                      </button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Botón móvil */}
        <button
          className="md:hidden p-2 rounded-xl transition-all hover:bg-purple-500/20"
          onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
          aria-label="Alternar menú"
        >
          {menuMovilAbierto ? (
            <X className="text-purple-400 w-6 h-6" />
          ) : (
            <Menu className="text-purple-400 w-6 h-6" />
          )}
        </button>
      </div>

      {/* Menú móvil */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          menuMovilAbierto ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 pb-6 pt-2 bg-gradient-to-b from-black/80 to-black/40 backdrop-blur-xl">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => router.push("/")}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-white hover:bg-white/10"
            >
              Inicio
            </button>
            <button
              onClick={() => router.push("/juego")}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-white hover:bg-white/10"
            >
              Juegos
            </button>
            <button
              onClick={() => router.push("/acerca")}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-white hover:bg-white/10"
            >
              Sobre Nosotros
            </button>
            {!nombre && (
              <>
                <button
                  onClick={() => router.push("/login")}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-white hover:bg-white/10"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/registro")}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-white hover:bg-white/10"
                >
                  Registro
                </button>
              </>
            )}
            {nombre && (
              <>
                <button
                  onClick={() => router.push("/perfil")}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-purple-400 hover:bg-white/10"
                >
                  {nombre}
                </button>
                <button
                  onClick={() => router.push("/ranking")}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-purple-400 hover:bg-white/10"
                >
                  Ranking
                </button>
                <button
                  onClick={() => router.push("/partidas")}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-purple-400 hover:bg-white/10"
                >
                  Partidas
                </button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-purple-400 hover:bg-white/10"
                >
                  Dashboard
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
