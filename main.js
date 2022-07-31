// TODO
// refactor all pokemon filter related code to utilise the generic util funcs

// global constants
const search_bar = document.getElementById("search_bar");
const pokemon_url = "https://pokeapi.co/api/v2/pokemon/";
const generations_url = "https://pokeapi.co/api/v2/generation/";
const types_url = "https://pokeapi.co/api/v2/type/";
let url = "";
const main = document.getElementsByTagName("main")[0];
const filter = document.getElementById("filter");
const loader = document.getElementById("loader");

// filters
const filters = {
  pokemon: "pokemon",
  generations: "generations",
  types: "types",
};
let curr_filter = filters.pokemon;

// functions
const update_fitler = (curr_filter) => {
  resest_search_bar();
  filter.innerHTML = curr_filter;
};

const get_search_value = () => {
  let val = search_bar.value;
  val = val.toLowerCase();
  return val;
};

const set_filter = (target_filter) => {
  curr_filter = target_filter;
  check_which_url(curr_filter);
  update_fitler(curr_filter);
  update_placeholder(curr_filter);
};

const check_which_url = (curr_filter) => {
  switch (curr_filter) {
    case filters.pokemon:
      set_url(pokemon_url);
      break;
    case filters.generations:
      set_url(generations_url);
      break;
    case filters.types:
      set_url(types_url);
      break;
  }
};

const set_url = (target_url) => {
  url = target_url;
};

const search = async () => {
  reset_search();
  const search_request = get_search_value();
  const data = await call_api(search_request);
  if (data) {
    check_which_filter(data);
  }
  if (!data) {
    invalid_call();
  }
};

const check_which_filter = (data) => {
  switch (curr_filter) {
    case filters.pokemon:
      show_results(data);
      break;
    case filters.generations:
      create_generation_cards(data);
      break;
    case filters.types:
      //
      break;
  }
};

const update_placeholder = (curr_filter) => {
  switch (curr_filter) {
    case filters.pokemon:
      search_bar.setAttribute("placeholder", "E.g. Metagross");
      break;
    case filters.generations:
      search_bar.setAttribute("placeholder", "E.g. 1");
      break;
    case filters.types:
      search_bar.setAttribute("placeholder", "E.g. Fire");
      break;
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
  show_loader();
  const response = await fetch(url + search_val);
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
  resest_search_bar();
};

const resest_search_bar = () => {
  search_bar.value = "";
};

const show_results = (pokemon_data) => {
  const card = create_card(pokemon_data);

  main.appendChild(card);
  remove_loader();
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
};

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
};

// Generations code
const create_generation_cards = (data) => {
  console.log(data);

  const card = create_element("section");
  card.setAttribute("id", "card");

  const header = create_gen_header(data);
  const types = create_types_container(data.types);
  const species = create_species(data.pokemon_species);
  const moves = create_moves_no(data.moves);
  const games = create_games(data.version_groups);

  card.appendChild(header);
  card.appendChild(types);
  card.appendChild(species);
  card.appendChild(moves);
  card.appendChild(games);

  main.appendChild(card);
  remove_loader();
  show_main();
};

const create_games = (version_groups) => {
  const version_container = create_element("div");
  const heading = create_element_with_text("h4", "Games");

  version_container.appendChild(heading);
  version_groups.forEach((game) => {
    version_container.appendChild(create_element_with_text("p", game.name));
  });
  return version_container;
};

const create_moves_no = (moves) => {
  const moves_no = moves.length;
  const text = "Unique moves: " + moves_no;
  const el = create_element_with_text("p", text);
  add_class(el, "gen_info");
  return el;
};

const create_species = (species) => {
  console.log(species);
  const species_no = species.length;
  const text = "Unique species: " + species_no;
  const el = create_element_with_text("p", text);
  add_class(el, "gen_info");
  return el;
};

const create_types_container = (typeData) => {
  const number_types = create_element_with_text(
    "p",
    "Unique types: " + typeData.length
  );
  add_class(number_types, "gen_info");
  return number_types;
};

const create_gen_header = (data) => {
  const header = create_element("div");
  header.appendChild(gen_region(data.main_region));
  header.appendChild(gen_name(data.name));
  return header;
};

const gen_region = (region) => {
  return create_element_with_text("h2", region.name);
};

const gen_name = (name) => {
  return create_element_with_text("h2", name);
};

// ################################
// generic util funcs
// ################################
const create_element = (ele) => {
  return document.createElement(ele);
};

const create_element_with_text = (ele, text) => {
  const _ele = document.createElement(ele);
  _ele.innerHTML = text;
  return _ele;
};

const add_class = (ele, newClass) => {
  return ele.classList.add(newClass);
};

const remove_class = (ele, oldClass) => {
  return ele.classList.remove(oldClass);
};

const show_main = () => {
  main.style.display = "block";
};

const show_loader = () => {
  loader.style.display = "flex";
}

const remove_loader = () => {
  loader.style.display = "none";
}

// funcs to be called on load
set_url(pokemon_url);
update_fitler(filters.pokemon);
update_placeholder(filters.pokemon);
