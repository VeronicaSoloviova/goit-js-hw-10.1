import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';
import '../css/styles.css';
import { fetchCountryAPI } from './countriesAPI';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchCountry: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const onSearchCountryInput = event => {
  const searchedQuery = event.target.value.trim();
  if (!searchedQuery) {
    Notify.warning('Введіть назву країни');
    clearCountryInfo();
    clearCountryList();
    return;
  }
  fetchCountryAPI(searchedQuery)
    .then(data => {
      //renderCountryList(data);
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(err => {
      if (err.message === '404') {
        Notify.warning('Країну не знайдено');
      }
      console.log(err);
    });
};

refs.searchCountry.addEventListener(
  'input',
  debounce(onSearchCountryInput, DEBOUNCE_DELAY)
);

function renderCountryList(data) {
  const markup = data.map(({ name: { official }, flags: { svg, alt } }) => {
    return `
    <li class="country-item">
     <img width="25px" src="${svg}" alt="${alt}">
     <p>${official}</p>
    </li>`;
  });

  refs.countryList.innerHTML = markup;
}

function renderCountryCard(data) {
  const markup = data
    .map(country => {
      return `<div>
  <img width="25px" src="${country.flags.svg}" alt="${country.flags.alt}">
  <h2 style="display: inline;">${country.name.common}</h2>
</div>
<b>Capital</b>: ${country.capital} </br>
<b>Population</b>: ${country.population} </br>
<b>Language</b>: ${country.language} </br>`;
    })
    .join('');
  refs.countryInfo.innerHTML = markup;
}

function clearCountryList() {
  refs.countryList.innerHTML = '';
}

function clearCountryInfo() {
  refs.countryInfo.innerHTML = '';
}
