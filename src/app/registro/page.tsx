'use client'


import Header from "@/misComponentes/Header";

export default function Registro() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const name = (e.target as HTMLFormElement).nombre.value;
        const email = (e.target as HTMLFormElement).email.value;
        const password = (e.target as HTMLFormElement).password.value;
        const password_confirmation = password;
        const role = "user";

        async function registerUser() {
            const url = "https://laravelm7-luislp-production.up.railway.app/api/register"
            const respuesta = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    role,
                    password,
                    password_confirmation
                }),
            });
            const respuestaJson = await respuesta.json();
            console.log(respuestaJson);
        }
        registerUser();
        window.location.href = "/login";
        // router.push("/");
    };

    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-rose-500/5 via-fuchsia-500/5 to-purple-500/5">
            <h1 className="text-3xl font-bold">Registro</h1>
            <form onSubmit={handleSubmit} className="mt-4"  >
                <div className="mb-4">
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input type="text" id="nombre" name="nombre" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" name="email" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input type="password" id="password" name="password" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Registrar</button>
            </form>
            </div>
        </>
    )
}