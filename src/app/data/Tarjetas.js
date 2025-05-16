console.log("Tarjetas.js");

const fetchPokemondatosPokemon = async () => {
  try {
    const peticionApi = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=6"
    );
    const datosPokemon = await peticionApi.json();

    const fetchPromises = datosPokemon.results.map((pokemon) =>
      fetch(pokemon.url).then((res) => res.json())
    );

    const pokemonDetalles = await Promise.all(fetchPromises);

    return pokemonDetalles.map((pokemon) => ({
      id: pokemon.id,
      nom: pokemon.name,
      imatge: pokemon.sprites.front_default,
    }));
  } catch (error) {
    console.error("Error fetching el pokémon:", error);
    return [];
  }
};

export const Tarjetas = await fetchPokemondatosPokemon();
