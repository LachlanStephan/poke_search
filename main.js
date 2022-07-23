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

  const types = create_types(pokemon_data.types);
  const header = create_header(pokemon_data.name);
  header.appendChild(types);

  const sprite_container = create_sprite_container();  
  const front_sprite = create_sprite(pokemon_data.sprites.front_default);
  const back_sprite = create_sprite(pokemon_data.sprites.back_default);
  const shiny_sprite = create_sprite(pokemon_data.sprites.front_shiny);
  sprite_container.appendChild(front_sprite);
  sprite_container.appendChild(back_sprite);
  sprite_container.appendChild(shiny_sprite);
  console.log(types);
// const stats = create_stats(pokemon_data.stats);
// const moves = create_moves(pokemon_data.moves);


  card.appendChild(header);
  card.appendChild(sprite_container);
// card.appendChild(stats);
// card.appendChild(moves);
  return card;
};

const create_header = (name) => {
  const header = document.createElement("div");
  const h2 = document.createElement("h2");
  h2.innerHTML = name;
  header.setAttribute("class", "card_header");
  header.appendChild(h2);
  return header;
}

const create_sprite_container = () => {
  const sprite_container = document.createElement("div");
  sprite_container.setAttribute("class", "sprite_container");
  return sprite_container;
}

const create_sprite = (sprite_url) => {
  const img = document.createElement("img");
  img.setAttribute("src", sprite_url);
  img.setAttribute("alt", "pokemon sprite");
  return img;
}

const create_types = (types) => {
  const type_list = document.createElement("p");
  type_list.setAttribute("id", "types");
  types.forEach((val) => {
    type_list.innerHTML = type_list.innerHTML + " " +  val.type.name;
  });
  return type_list;
};

const create_stats = () => {
  //
}

const create_moves = () => {
  //
}
