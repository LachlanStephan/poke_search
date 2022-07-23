// global constants
const search_bar = document.getElementById("search_bar");
const api_url = "https://pokeapi.co/api/v2/pokemon/";
const main = document.getElementsByTagName("main")[0];

// functions
const get_search_value = () => {
  return search_bar.value;
};

const search = async () => {
  reset_search();
  const search_request = get_search_value();
  const data = await call_api(search_request);
  if (data) {
    show_results(data);
  }
  if (!data) {
    invalid_call();
  }
};

const check_if_card = () => {
  const card = document.getElementById("card");
  if (card) {
    card.remove();
  }
}

const reset_search = () => {
  main.style.display = "none";
  check_if_card();
}

const check_enter = (event) => {
  if (event.keyCode === 13) {
    search();
  }
}

const call_api = async (search_val) => {
  const response = await fetch(api_url + search_val);
  if (response_is_valid(response.status)) {
    const result = await response.json();
    return result;
  }
  return false;
}

const response_is_valid = (status) => {
  switch (status) {
    case 404:
      return false;
    default:
      return true;
  }
}

const invalid_call = () => {
  alert("invalid input");
  search_bar.value = "";
}

const show_results = (pokemon_data) => {
  console.log(pokemon_data);
  const card = create_card(pokemon_data);

  main.appendChild(card);
  main.style.display = "flex";
}

const create_card = (pokemon_data) => {
  const card = document.createElement("section");
  card.setAttribute("id", "card");
  const header = create_header(pokemon_data.name);
  const sprite = create_sprite(pokemon_data.sprites.front_default);

  card.appendChild(header);
  card.appendChild(sprite);
  return card;
};

const create_header = (name) => {
  const h2 = document.createElement("h2");
  h2.innerHTML = name;
  return h2;
}

const create_sprite = (sprite_url) => {
  const img = document.createElement("img");
  img.setAttribute("src", sprite_url);
  img.setAttribute("alt", "pokemon sprite");
  return img;
}

const create_info = () => {
  //
};
