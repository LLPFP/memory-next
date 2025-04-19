"use client";

import GrupoTarjetas from "@/misComponentes/GrupoTarjetas";
import { Tarjetas } from "@/app/data/Tarjetas";
import Header from "@/misComponentes/Header";
import { ClickProvider } from "@/app/context/clickContext";

export default function Page() {
  return (
    <ClickProvider>
      <Header />
      <video
        className="fixed top-[80px] left-0 w-full h-[calc(100%-64px)] object-cover z-[-1]"
        src="./assets/fondo-juego.mp4"
        autoPlay
        loop
        muted></video>
      <main className="min-h-screen bg-gradient-to-r from-rose-500/5 via-fuchsia-500/5 to-purple-500/5 p-4 sm:p-6 md:p-8 z-1">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white backdrop-blur-sm rounded-lg shadow-xl border border-gray-300 p-1 mb-2 md:mb-3 w-75 mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent text-center mb-2 sm:mb-3 md:mb-4 animate-fade-in bg-white px-2 py-0.5">
              Juego de Memoria
            </h1>
          </div>
          <div className="bg-black/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-0 mb-4 sm:mb-6">
              <div className="flex justify-center items-center bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-xl px-8 py-4 backdrop-blur-sm border border-blue-500/50 shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300 font-medium text-sm sm:text-base">
                    Intentos:
                  </span>
                  <span className="text-white font-bold text-lg sm:text-xl bg-gradient-to-r from-rose-500/20 to-purple-500/20 px-3 py-1 rounded-lg">
                    0
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-4 sm:ml-6">
                  <span className="text-gray-300 font-medium text-sm sm:text-base">
                    Aciertos:
                  </span>
                  <span className="text-white font-bold text-lg sm:text-xl bg-gradient-to-r from-rose-500/20 to-purple-500/20 px-3 py-1 rounded-lg">
                    0/2
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto bg-gradient-to-r from-rose-600 to-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base">
                Reiniciar Juego
              </button>
            </div>
            <GrupoTarjetas personajes={Tarjetas} />
          </div>
        </div>
      </main>
    </ClickProvider>
  );
}
