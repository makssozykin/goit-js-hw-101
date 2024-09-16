const BASE_URL = 'https://api.thecatapi.com/v1';
const END_BREEDS = '/breeds?api_key=';
const END_IMAGES = '/images/search?api_key=';
const API_KEY =
  'live_LKCXfDASYU5ENODw5UvdLe9ATAUArsu07N1S6rArgDHmQzqs1ug37YHwFM6yBMsb';
let page = 1;

function fetchBreeds() {
  return fetch(`${BASE_URL}${END_BREEDS}${API_KEY}`).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    return resp.json();
  });
}

function fetchCatByBreed(breedId) {
  const params = new URLSearchParams({
    breed_ids: breedId,
  });
  return fetch(`${BASE_URL}${END_IMAGES}${API_KEY}&${params}`).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    return resp.json();
  });
}

export { fetchBreeds, fetchCatByBreed };
