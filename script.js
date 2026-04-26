const firebaseConfig = {
  apiKey: "AIzaSyAi0NciW46RWGGmfnuOu9ze03gk2VD2fvQ",
  authDomain: "pokemon-team-generator-54dc3.firebaseapp.com",
  databaseURL: "https://pokemon-team-generator-54dc3-default-rtdb.firebaseio.com",
  projectId: "pokemon-team-generator-54dc3",
  storageBucket: "pokemon-team-generator-54dc3.firebasestorage.app",
  messagingSenderId: "955331064380",
  appId: "1:955331064380:web:709d8cbcfbb8739286c939"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const API = "https://pokeapi.co/api/v2/pokemon/";
const MAX_POKEMON_ID = 1010;

const teamName = document.getElementById("teamName");
const deleteName = document.getElementById("deleteName");
const submitName = document.getElementById("submitName");
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
  pokemonBox.innerHTML = "";
  teamName.textContent = "Your Team Name";
}

const teamNameData = database.ref("teamName");

teamNameData.on("value", (snapshot) => {
  const data = snapshot.val();
  if (data) {
    teamName.textContent = data;
    teamName.style.display = "block";
  } else {
    teamName.textContent = "";
  }
});

submitName.addEventListener("click", () => {
  const newName = teamName.textContent.trim();
  if (newName !== "") {
    teamNameData.set(newName);
  }
});

deleteName.addEventListener("click", () => {
  teamNameData.remove();
  teamNameData.style.display = "none";
});

button.addEventListener("click", generateTeam);
resetButton.addEventListener("click", resetTeam);