export function fetchCountries(nameCountry) {
  const url = `https://restcountries.com/v2/name/${nameCountry}?fields=name,capital,population,flags,languages`;
  return fetch(url)
    .then(response => response.json())
    .then(arrOfCountries => {
      return arrOfCountries;
    });
}
