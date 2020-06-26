const baseURL = 'http://localhost:7000';
const charactersURL = `${baseURL}/characters`;

const charactersLink = document.querySelector('.characters-link');
const createCharacterLink = document.querySelector('.create-character-link');
const createCharacter = document.querySelector('.create-character');
const charactersSection = document.querySelector('.characters');

fetch(charactersURL)
  .then(parseJSON)
  .then(displayCharacters);

charactersLink.addEventListener('click', displayCharactersSection);
createCharacterLink.addEventListener('click', displayCreateCharacterForm);
createCharacter.addEventListener('submit', makeNewCharacter);

function displayCharactersSection() {
  charactersSection.classList.remove('hidden');
  createCharacter.classList.add('hidden');
}

function displayCreateCharacterForm() {
  charactersSection.classList.add('hidden');
  createCharacter.classList.remove('hidden');
}

function makeNewCharacter(event) {
  event.preventDefault();

  const characterFormData = new FormData(event.target);
  const name = characterFormData.get('name');
  const image = characterFormData.get('image');
  const favoriteFood = characterFormData.get('favorite-food');
  const affiliationEl = event.target.querySelector('input[type="checkbox"]');
  const affiliation = affiliationEl.checked;

  const character = { name, image, affiliation, favorite_food: favoriteFood };

  fetch(charactersURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(character)
  })
    .then(response => {
      if (response.status === 201) {
        return parseJSON(response);
      } else {
        throw new Error("Uncreatable entity");
      }
    })
    .then(showCharacter)
    .catch(error => console.error(error.message));

  event.target.reset();
}

function displayCharacters(characters) {
  console.log('characters', characters);
  characters.forEach(character => {
    showCharacter(character);
  });
}

function showCharacter(character) {
  const characterCard = document.createElement('div');
  characterCard.classList.add('character-card');

  const name = document.createElement('h2');
  name.textContent = character.name;

  const image = document.createElement('img');
  image.src = character.image;

  const favoriteFood = document.createElement('p');
  favoriteFood.textContent = character.favorite_food;

  const affiliation = document.createElement('p');
  affiliation.textContent = character.affiliation
    ? 'light side'
    : 'dark side';

  characterCard.append(name, image, favoriteFood, affiliation);

  charactersSection.append(characterCard);
}

function parseJSON(response) {
  return response.json();
}