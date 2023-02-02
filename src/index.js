import './css/styles.css';

import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryInput.addEventListener(
  'input',
  debounce(onCountryInput, DEBOUNCE_DELAY)
);

function onCountryInput() {
  const name = countryInput.value.trim();
  if (name === '') {
    return (countryList.innerHTML = ''), (countryInfo.innerHTML = '');
  }

  fetchCountries(name)
    .then(country => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      if (country.length === 1) {
        countryList.insertAdjacentHTML('beforeend', addCountryList(country));
        countryInfo.insertAdjacentHTML('beforeend', renderCountryInfo(country));
      } else if (country.length >= 10) {
        tooManyMatches();
      } else {
        countryList.insertAdjacentHTML('beforeend', addCountryList(country));
      }
    })
    .catch(wrongName);
}

function addCountryList(country) {
  const list = country
    .map(({ name, flags }) => {
      return `
          <li class="country-list__item">
              <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 30px height = 30px>
              <h2 class="country-list__name">${name.official}</h2>
          </li>
          `;
    })
    .join('');
  return list;
}

function renderCountryInfo(country) {
  const list = country
    .map(({ capital, population, languages }) => {
      return `
        <ul class="country-info__list">
            <li class="country-info__item"><p class="country-info__text"><b>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><p class="country-info__text"><b>Population: </b>${population}</p></li>
            <li class="country-info__item"><p class="country-info__text"><b>Languages: </b>${Object.values(
              languages
            ).join(', ')}</p></li>
        </ul>
        `;
    })
    .join('');
  return list;
}

function wrongName() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function tooManyMatches() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
