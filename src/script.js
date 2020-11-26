// API info
const autocompleteURL = 'locations/v1/cities/autocomplete';
const searchURL = 'locations/v1/cities/search';
const forecastURL = 'forescasts/v1/daily/1day/'
const apiKey = '3b6c414b301c5501f7cfe3b433d89d7f';


// Setting default URL for the api
//api.openweathermap.org/data/2.5/weather?q=London&appid={API key}
//axios.defaults.baseURL = 'http://dataservice.accuweather.com/';
axios.defaults.baseURL = 'https://api.openweathermap.org/data/2.5/weather'



// DOM elements
let inputText = document.querySelector('#form input');
let btnQuery = document.querySelector('#form button');


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
  axios.get('', {params: {q: queryText, appid: apiKey}})
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
  getForecast(inputText.value);

  console.log(forecast.weather[0].main);
}

btnQuery.onclick = displayForecast;
