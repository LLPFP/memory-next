"use client";

import Header from "@/misComponentes/Header";

export default function Page() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center h-screen">
        <video
          className="w-full h-full object-cover z-[5]"
          src="./assets/video.mp4"
          autoPlay
          loop
          muted></video>
        <div className="absolute z-10 bg-black/70 p-8 rounded-lg max-w-2xl text-center backdrop-blur-sm shadow-2xl border border-gray-700">
          <h1 className="text-4xl font-bold text-white mb-4 animate-fade-in">
            Bienvenido al Memory Card
          </h1>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Pon a prueba tu memoria encontrando pares de cartas iguales en el
            menor tiempo posible. ¡Demuestra tus habilidades y compite por el
            mejor puntaje en este desafiante juego de memoria!
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/juego"
              className="bg-gradient-to-r from-rose-600 to-purple-600  text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              Jugar Ahora
            </a>
          </div>
          <div className="absolute bottom-3 right-3 text-white/50 text-sm z-10">
            Creado por Luis Lopez Puig
          </div>
        </div>
      </div>
    </>
  );
}
