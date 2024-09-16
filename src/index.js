//* завантаження нової сторінки за домогою кнопки Load More
// const URL = 'https://rickandmortyapi.com/api/character/';

// const list = document.querySelector('.js-list');
// const btn = document.querySelector('.js-btn');
// let page = 40;
// btn.addEventListener('click', onLoadMore);

// btn.hidden = true;

// function serviceCharacters(page = 1) {
//   return fetch(`${URL}?page=${page}`).then(resp => {
//     if (!resp.ok) {
//       throw new Error(`HTTP error! status: ${resp.status}`);
//     }
//     return resp.json();
//   });
// }

// serviceCharacters()
//   .then(({ results, info }) => {
//     list.insertAdjacentHTML('beforeend', serviceMarkup(results));
//     if (info.pages > 1) {
//       btn.hidden = false;
//     }
//   })
//   .catch(err => console.error(err));

// function onLoadMore() {
//   page += 1;
//   serviceCharacters(page).then(({ results, info }) => {
//     list.insertAdjacentHTML('beforeend', serviceMarkup(results));
//     if (info.pages === page) {
//       btn.hidden = true;
//     }
//   });
// }

// function serviceMarkup(arr) {
//   return arr
//     .map(
//       ({ image, name, species }) => `<li>
//         <img src="${image}" alt="${name}" width="200" />
//         <h2>${name}</h2>
//         <h3>${species}</h3></li>
//         `
//     )
//     .join('');
// }

//* Завантаження нової сторінки за допомогою Intersection Observer(автоматичний скролл)
// const URL = 'https://rickandmortyapi.com/api/character/';
// const list = document.querySelector('.js-list');
// const options = {
//   root: null,
//   rootMargin: '300px',
// };
// const observer = new IntersectionObserver(callback, options);
// const guard = document.querySelector('.js-guard');
// let page = 1;

// function serviceCharacters(page = 1) {
//   return fetch(`${URL}?page=${page}`).then(resp => {
//     if (!resp.ok) {
//       throw new Error(`HTTP error! status: ${resp.status}`);
//     }
//     return resp.json();
//   });
// }

// function serviceMarkup(arr) {
//   return arr
//     .map(
//       ({ image, name, species }) => `<li>
//         <img src="${image}" alt="${name}" width="200" />
//         <h2>${name}</h2>
//         <h3>${species}</h3></li>
//         `
//     )
//     .join('');
// }

// serviceCharacters().then(({ results, info }) => {
//   list.insertAdjacentHTML('beforeend', serviceMarkup(results));
//   if (info.pages > 1) {
//     observer.observe(guard);
//   }
// });

// function callback(entries) {
//   entries.forEach(entry => {
//     if (entry.isIntersecting) {
//       page += 1;
//       serviceCharacters(page).then(({ results, info }) => {
//         list.insertAdjacentHTML('beforeend', serviceMarkup(results));
//         if (info.pages === page) {
//           observer.unobserve(guard);
//         }
//       });
//     }
//   });
// }

//* async await axios
// function callback(entries) {
//   entries.forEach(async entry => {
//     if (entry.isIntersecting) {
//       page += 1;
//       try {
//         const date = await serviceCharacters(page);
//         list.insertAdjacentHTML('beforeend', serviceMarkup(date.results));
//         if (date.info.pages === page) {
//           observer.unobserve(guard);
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     }
//   });
// }

import axios from 'axios';
import { fetchBreeds, fetchCatByBreed } from './cat_api';
import SlimSelect from 'slim-select';
import '/node_modules/slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';

axios.defaults.headers.common['x-api-key'] =
  'live_AInBiZNMGTspPJow6eVuTFhnUUqlCCv9K3ia4eMvA7myxAvI8V3zJkjb4kF1xzmt';

const refs = {
  select: document.querySelector('.breed-select'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
  container: document.querySelector('.cat-info'),
};

function slimSelect() {
  new SlimSelect({
    select: refs.select,
  });
}

refs.select.classList.add('is-hidden');
refs.container.classList.add('is-hidden');
refs.error.classList.add('is-hidden');
refs.loader.textContent = '';

fetchBreeds()
  .then(data => {
    refs.select.innerHTML = createList(data);
    slimSelect();
    refs.select.classList.remove('is-hidden');
    refs.loader.classList.replace('loader', 'is-hidden');
  })
  .catch(fetchError);

refs.select.addEventListener('change', onSelect);

function onSelect(e) {
  refs.loader.classList.replace('is-hidden', 'loader');
  refs.select.classList.add('is-hidden');
  refs.container.classList.add('is-hidden');

  const breedId = e.currentTarget.value;

  fetchCatByBreed(breedId)
    .then(data => {
      refs.loader.classList.replace('loader', 'is-hidden');
      refs.select.classList.remove('is-hidden');

      createMarkup(data);

      refs.container.classList.remove('is-hidden');
    })
    .catch(fetchError);
}

function createList(arr) {
  return arr
    .map(({ id, name }) => `<option value="${id}">${name}</option>`)
    .join('');
}

function createMarkup(data) {
  const card = data
    .map(el => {
      return `<img src="${el.url}" alt="${el.breeds[0].name}"/><h2>${el.breeds[0].name}</h2><p>${el.breeds[0].description}</p><h3>Temperament</h3><p>${el.breeds[0].temperament}</p>`;
    })
    .join('');
  refs.container.innerHTML = card;
}

function fetchError() {
  refs.select.classList.remove('is-hidden');
  refs.loader.classList.replace('loader', 'is-hidden');

  Notiflix.Notify.failure(
    'Oops! Something went wrong! Try reloading the page or select another cat breed!',
    {
      position: 'center-center',
      timeout: 1000,
      width: '400px',
      fontSize: '24px',
    }
  );
}
