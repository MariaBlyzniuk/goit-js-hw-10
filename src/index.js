import debounce from 'lodash.debounce';
import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;


const inputRef = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
  
inputRef.addEventListener('input', debounce(onCountrySearch, DEBOUNCE_DELAY));

function onCountrySearch() {
  const nameCountry = inputRef.value.trim()
  if (nameCountry === '') {
    return (countryList.innerHTML = ''), (countryInfo.innerHTML = '')
  }

  fetchCountries(nameCountry)
    .then(country => {
      countryList.innerHTML = ''
      countryInfo.innerHTML = ''
      if (country.length === 1) {
        countryList.insertAdjacentHTML('beforeend', renderCountryList(country))
        countryInfo.insertAdjacentHTML('beforeend', renderCountryCard(country))
      } else if (country.length >= 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
      } else {
        countryList.insertAdjacentHTML('beforeend', renderCountryList(country))
      }
    })
    .catch(error => Notiflix.Notify.failure('Oops, there is no country with that name'))
}

function renderCountryList(country) {
  const markup = country
    .map(({ name, flags }) => {
      return `
          <li class="country-list__item">
              <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 30px height = 30px>
              <h2 class="country-list__name">${name.official}</h2>
          </li>
          `
    })
    .join('')
  return markup
}

function renderCountryCard(countries) {
  const markup = countries
    .map(({ capital, population, languages }) => {
      return `
        <ul class="country-info__list">
            <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
            <li class="country-info__item"><p><b>Languages: </b>${Object.values(languages).join(', ')}</p></li>
        </ul>
        `
    })
    .join('')
  return markup
}

