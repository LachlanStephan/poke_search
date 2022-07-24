// global constants
const search_bar = document.getElementById("search_bar");
const api_url = "https://pokeapi.co/api/v2/pokemon/";
const main = document.getElementsByTagName("main")[0];

// functions
const get_search_value = () => {
  let val = search_bar.value;
  val = val.toLowerCase();
  return val; 
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
};

const reset_search = () => {
  main.style.display = "none";
  check_if_card();
};

const check_enter = (event) => {
  if (event.keyCode === 13) {
    search();
  }
};

const call_api = async (search_val) => {
  const response = await fetch(api_url + search_val);
  if (response_is_valid(response.status)) {
    const result = await response.json();
    return result;
  }
  return false;
};

const response_is_valid = (status) => {
  switch (status) {
    case 404:
      return false;
    default:
      return true;
  }
};

// update this to have custom err p tag below search bar
// update custom err message to try something else instead 
// fill search input with example search
const invalid_call = () => {
  alert("invalid input");
  search_bar.value = "";
};

const show_results = (pokemon_data) => {
  const card = create_card(pokemon_data);

  main.appendChild(card);
  main.style.display = "flex";
};

const create_card = (pokemon_data) => {
  const card = document.createElement("section");
  card.setAttribute("id", "card");

  //header
  const types = create_types(pokemon_data.types);
  const header = create_header(pokemon_data.name);
  header.appendChild(types);

  //sprites
  const sprite_container = create_sprite_container();
  const front_sprite = create_sprite(pokemon_data.sprites.front_default);
  const back_sprite = create_sprite(pokemon_data.sprites.back_default);
  const shiny_sprite = create_sprite(pokemon_data.sprites.front_shiny);
  sprite_container.appendChild(front_sprite);
  sprite_container.appendChild(shiny_sprite);
  sprite_container.appendChild(back_sprite);

  //moves
  const move_heading = create_heading("Moves");
  const moves = create_moves(pokemon_data.moves);

  //stats
  const stats_heading = create_heading("Stats");
  const stats = create_stats(pokemon_data.stats);

  card.appendChild(header);
  card.appendChild(sprite_container);

  card.appendChild(move_heading);
  card.appendChild(moves);

  card.appendChild(create_hr());

  card.appendChild(stats_heading);
  card.appendChild(stats);
  return card;
};

const create_heading = (heading) => {
  const title = document.createElement("h2");
  title.innerHTML = heading;
  title.style.width = "100%";
  return title;
}

const create_header = (name) => {
  const header = document.createElement("div");
  const h2 = document.createElement("h2");
  h2.innerHTML = name;
  header.setAttribute("class", "card_header");
  header.appendChild(h2);
  return header;
};

const create_sprite_container = () => {
  const sprite_container = document.createElement("div");
  sprite_container.setAttribute("class", "sprite_container");
  return sprite_container;
};

const create_sprite = (sprite_url) => {
  const img = document.createElement("img");
  img.setAttribute("src", sprite_url);
  img.setAttribute("alt", "pokemon sprite");
  return img;
};

const create_types = (types) => {
  const type_list = document.createElement("p");
  type_list.setAttribute("id", "types");
  types.forEach((val) => {
    type_list.innerHTML = type_list.innerHTML + " " + val.type.name;
  });
  return type_list;
};

const create_moves = (moves) => {
  const cont = document.createElement("div");
  cont.setAttribute("class", "move_container");
  
  moves.forEach((item) => {
    const move = document.createElement("p");
    move.innerHTML = item.move.name;
    cont.appendChild(move);
  });
  return cont;
};

const create_stats = (stats) => {
  const cont = document.createElement("div");
  cont.setAttribute("class", "stats_container");

  stats.forEach((item) => {
    const stat_name = document.createElement("span");
    const stat = document.createElement("span");
    stat.setAttribute("class", "stat");
    stat_name.innerHTML = item.stat.name;
    stat.innerHTML = item.base_stat;
    cont.appendChild(stat_name);
    cont.appendChild(stat);
  });
  return cont;
};

const create_hr = () => {
  return document.createElement("hr");
}
