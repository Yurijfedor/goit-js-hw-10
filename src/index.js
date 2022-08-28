import './css/styles.css';

const DEBOUNCE_DELAY = 300;

function fetchCountries(name) {
  fetch('https://restcountries.com/v2/name/name')
    .then(response => {
      return response.json();
    })
    .then(console.log)
    .catch(error => console.log(error));
}

fetchCountries('Ukr');
