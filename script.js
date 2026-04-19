const API = "https://pokeapi.co/api/v2/pokemon/";
const MAX_POKEMON_ID = 1010;

const button = document.getElementById("generateButton");
const resetButton = document.getElementById("resetButton");
const placeholderImage = "images/pokemon_placeholder.png";
const images = [
  document.getElementById("img1"),
  document.getElementById("img2"),
  document.getElementById("img3"),
  document.getElementById("img4"),
  document.getElementById("img5")
];

async function getPokemon(id) {
  const response = await fetch(API + id);
  if (!response.ok) {
    throw new Error(`Pokémon fetch failed for id ${id}`);
  }
  return response.json();
}

function getRandomPokemonId() {
  return Math.floor(Math.random() * MAX_POKEMON_ID) + 1;
}

function getPokemonImage(data) {
  return (
    data.sprites?.other?.["official-artwork"]?.front_default ||
    data.sprites?.front_default ||
    data.sprites?.other?.dream_world?.front_default ||
    data.sprites?.versions?.["generation-v"]?.["black-white"]?.animated?.front_default ||
    ""
  );
}

async function generateTeam() {
  button.disabled = true;
  try {
    const promises = images.map(async (img) => {
      const id = getRandomPokemonId();
      const pokemon = await getPokemon(id);
      const imageUrl = getPokemonImage(pokemon);

      if (imageUrl) {
        img.src = imageUrl;
      }
      img.alt = pokemon.name || `pokemon ${id}`;
    });

    await Promise.all(promises);
  } catch (error) {
    console.error(error);
  } finally {
    button.disabled = false;
  }
}

function resetTeam() {
  images.forEach((img) => {
    img.src = placeholderImage;
    img.alt = "placeholder";
  });
}

button.addEventListener("click", generateTeam);
resetButton.addEventListener("click", resetTeam);

