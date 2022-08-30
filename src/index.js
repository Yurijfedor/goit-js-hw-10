import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
const DEBOUNCE_DELAY = 300;
const refs = {
  inputCountries: document.querySelector('input#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

let onFetchCountries = debounce(() => {
  const name = refs.inputCountries.value.trim();
  if (!name) {
    return;
  }
  fetchCountries(name)
    .then(countries => {
      if (countries.length > 10) {
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length >= 2 && countries.length <= 10) {
        clearMarkup();
        return renderList(countries);
      }
      clearMarkup();
      renderInfo(countries);
    })
    .catch(onFetchError);
}, DEBOUNCE_DELAY);

refs.inputCountries.addEventListener('input', debounce(onFetchCountries));
refs.inputCountries.addEventListener('focus', debounce(onFetchCountries));
refs.countryList.addEventListener('click', selectCountry);

function renderList(arrOfCountries) {
  arrOfCountries.map(({ flags, name }) => {
    const template = `<li class="country-list_item"><span class="flag-svg" style="background-image: url('${flags.svg}');"></span><p class="country-list_text">${name}</p></li>`;
    refs.countryList.insertAdjacentHTML('beforeend', template);
  });
}

function renderInfo(arrOfCountries) {
  arrOfCountries.map(({ flags, name, capital, population, languages }) => {
    const template = `<h1 class="country-info_title"><span class="flag-svg" style="background-image: url('${
      flags.svg
    }');"></span>${name}</h1>
      <ul class="country-info_list">
        <li class="country-info_item">capital: ${capital}</li>
        <li class="country-info_item">population: ${population}</li>
        <li class="country-info_item">languages: ${getLanguages(languages)}</li>
      </ul>`;
    refs.countryInfo.insertAdjacentHTML('beforeend', template);
  });
}

function getLanguages(arrOfLanguages) {
  return arrOfLanguages.map(({ name }) => name).join(', ');
}

function clearMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function onFetchError() {
  return Notify.failure('Oops, there is no country with that name');
}

function selectCountry(event) {
  if (event.target.nodeName !== 'P') {
    return;
  }
  const nameCountry = event.target.textContent;
  console.log(nameCountry);
  fetchCountries(nameCountry).then(countries => {
    clearMarkup();
    renderInfo(countries);
  });
}
