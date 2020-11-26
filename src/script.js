// API info
const apiKey = '3b6c414b301c5501f7cfe3b433d89d7f';


// Setting default URL for the api
//api.openweathermap.org/data/2.5/weather?q=London&appid={API key}
axios.defaults.baseURL = 'https://api.openweathermap.org/data/2.5/weather'

// DOM elements
let inputText = document.querySelector('#form input');
let btnQuery = document.querySelector('#form button');
let displayDiv = document.querySelector('#display');

// Global variables
let citiesArray = [];
let forecast;

//TODO fix with openweather parameters
function getCity(queryText) {
  axios.get(autocompleteURL, {params: {apikey: apiKey, q: queryText, language: 'pt-BR'}})
    .then(function (response) {
      citiesArray = response;
    }).catch(function (error) {
      console.log(error);
    });
}

function getForecast(queryText) {
  axios.get('', {params: {q: queryText, appid: apiKey, units: 'metric', lang: 'pt_br'}})
    .then(function (response) {
      forecast = response.data;
    }).catch(function (error) {
      console.log(error);
    });
}

function autocomplete() {
  getCity(inputText.value);

  let cityName = citiesArray.data[0].LocalizedName;
  let cityUF = citiesArray.data[0].AdministrativeArea.ID;

  console.log(cityName + ' - ' + cityUF);
}

function displayForecast() {
  let titleElement = document.createElement('h2');
  let descriptionElement = document.createElement('h3');
  let temperatureElement = document.createElement('h3');

  getForecast(inputText.value);

  console.log(forecast.weather[0].main);

  titleElement.appendChild(document.createTextNode('Weather in ' + forecast.name));
  descriptionElement.appendChild(document.createTextNode(forecast.weather[0].main));
  temperatureElement.appendChild(document.createTextNode(forecast.main.temp + '°C'));

  displayDiv.appendChild(titleElement);
  displayDiv.appendChild(descriptionElement);
  displayDiv.appendChild(temperatureElement);
}

btnQuery.onclick = displayForecast;
