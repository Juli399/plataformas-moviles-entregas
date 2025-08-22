const pokemonContainer = document.getElementById("pokemon-container");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const loading = document.getElementById("loading");

let offset = 0;
const limit = 20; // cuántos cargar por tanda

// Función principal
async function fetchPokemonList() {
  toggleLoading(true);
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const data = await res.json();

    for (let pokemon of data.results) {
      const details = await fetchPokemon(pokemon.url);
      renderPokemon(details);
    }
  } catch (error) {
    console.error("Error cargando Pokémon:", error);
  } finally {
    toggleLoading(false);
  }
}

// Traer detalles de cada Pokémon
async function fetchPokemon(url) {
  const res = await fetch(url);
  return await res.json();
}

// Renderizar carta
function renderPokemon(pokemon) {
  const types = pokemon.types.map(t => `<span class="badge bg-success me-1">${t.type.name}</span>`).join("");

  const card = document.createElement("div");
  card.classList.add("col");

  card.innerHTML = `
    <div class="card shadow-sm h-100">
      <img src="${pokemon.sprites.front_default}" class="card-img-top p-3" alt="${pokemon.name}">
      <div class="card-body text-center">
        <h5 class="card-title text-capitalize">${pokemon.name}</h5>
        <p>${types}</p>
        <button class="btn btn-outline-primary btn-sm" onclick="showDetails(${pokemon.id})">Ver más</button>
      </div>
    </div>
  `;
  pokemonContainer.appendChild(card);
}

// Mostrar detalles en modal
async function showDetails(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const pokemon = await res.json();

  const abilities = pokemon.abilities.map(a => a.ability.name).join(", ");
  const moves = pokemon.moves.slice(0, 4).map(m => m.move.name).join(", ");
  const types = pokemon.types.map(t => t.type.name).join(", ");

  const modalContent = `
    <div class="row">
      <div class="col-md-4 text-center">
        <img src="${pokemon.sprites.other['official-artwork'].front_default}" class="img-fluid" alt="${pokemon.name}">
      </div>
      <div class="col-md-8">
        <h3 class="text-capitalize">${pokemon.name}</h3>
        <p><strong>Tipos:</strong> ${types}</p>
        <p><strong>Habilidad:</strong> ${abilities}</p>
        <p><strong>Movimientos:</strong> ${moves}</p>
      </div>
    </div>
  `;

  document.getElementById("pokemon-details").innerHTML = modalContent;
  const modal = new bootstrap.Modal(document.getElementById("pokemonModal"));
  modal.show();
}

// Spinner
function toggleLoading(show) {
  if (show) {
    loading.classList.remove("d-none");
  } else {
    loading.classList.add("d-none");
  }
}

// Cargar más
loadMoreBtn.addEventListener("click", () => {
  offset += limit;
  fetchPokemonList();
});

// Inicial
fetchPokemonList();
