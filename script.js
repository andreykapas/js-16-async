'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = /** @type {HTMLElement} */ (
  document.querySelector('.countries')
);

// NEW COUNTRIES API URL (use instead of the URL shown in videos):
// https://restcountries.com/v2/name/portugal

// NEW REVERSE GEOCODING API URL (use instead of the URL shown in videos):
// https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}

// https://countries-api-836d.onrender.com/countries/

///////////////////////////////////////

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
};

const renderCountry = function (data, className = '') {
  const html = `
    <article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1_000_000
      ).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
  `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
};

const getCountryAndNeighbour = function (country) {
  // const request = new XMLHttpRequest();
  // request.open(
  //   'GET',
  //   `https://countries-api-836d.onrender.com/countries/name/${country}`,
  // );
  // request.send();

  const request = fetch(
    `https://countries-api-836d.onrender.com/countries/name/${country}`,
  )
    .then(res => res.json())
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders?.[0];
      return fetch(
        `https://countries-api-836d.onrender.com/countries/alpha/${neighbour}`,
      );
    })
    .then(res => res.json())
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.error(`${err}`);
      renderError(`Something went wrong: ${err.message}`);
    })
    .finally(() => (countriesContainer.style.opacity = '1'));

  // request.addEventListener('load', function () {
  //   const [data] = JSON.parse(this.responseText);
  //   console.log(data);
  //   const neighbour = data.borders?.[0];
  //   console.log(neighbour);

  //   renderCountry(data);
  //   const request2 = new XMLHttpRequest();
  //   request2.open(
  //     'GET',
  //     `https://countries-api-836d.onrender.com/countries/alpha/${neighbour}`,
  //   );
  //   request2.send();

  //   request2.addEventListener('load', function () {
  //     const data2 = JSON.parse(this.responseText);
  //     console.log(data2);

  //     renderCountry(data2, 'neighbour');
  //   });
  // });
};

btn.addEventListener('click', function () {
  getCountryAndNeighbour('belarus');
});
