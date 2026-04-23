// Step 1 — Paste your config object (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyASORaCFX8hB5TDfzd9c58LP7XMcVNAHMk",
  authDomain: "pokemon-4477e.firebaseapp.com",
  projectId: "pokemon-4477e",
  storageBucket: "pokemon-4477e.firebasestorage.app",
  messagingSenderId: "1000863468457",
  appId: "1:1000863468457:web:44e824241614483a7d52b8"
};

// Step 2 — Initialise Firebase with your config
firebase.initializeApp(firebaseConfig);

// Step 3 — Get a reference to the Realtime Database
const db = firebase.database();

// All your other code goes below this point

const API = "https://pokeapi.co/api/v2/pokemon/";
const MAX_POKEMON_ID = 1010;

const pokemonBox = document.getElementById("pokemonBox");
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
      return pokemon.name;
    });

    const name = await Promise.all(promises);
    pokemonBox.innerHTML = name
      .map(name => `<p>${name}</p>`)
      .join("");

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