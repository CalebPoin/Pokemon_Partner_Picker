const API = "https://pokeapi.co/api/v2/pokemon/";

const button = document.querySelector("button");
const box = document.querySelector("pokemonBox");

const divs = [
  document.getElementById("img1"),
  document.getElementById("img2"),
  document.getElementById("img3"),
  document.getElementById("img4"),
  document.getElementById("img5")
];

async function getPokemon(id) {
    const response = await fetch(API + id);
    const data = await response.json();
    return data;
}