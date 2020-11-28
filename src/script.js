// API info
const apiKey = '3b6c414b301c5501f7cfe3b433d89d7f';

// Setting up axios instances
//api.openweathermap.org/data/2.5/weather?q=London&appid={API key}
const axiosAPI = axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5/weather'
})
const axiosLocal = axios.create({
    baseURL: 'http://127.0.0.1:8080/cities'
})

// DOM elements
let inputText = document.querySelector('#form input');
let btnQuery = document.querySelector('#form button');
let divSugestion = document.querySelector('#displaySugestion')
let divWeather = document.querySelector('#displayWeather');

// Global variables
let forecast;

// The search only display cities in these countries - Currently disabled
let countries = ['BR', 'US', 'GB', 'ES', 'PT'];

let cities = [];
//https://localhost:8080/cities/city.list.json
//
// API Requests
// Requisição assíncrona para o servidor local
function getCities() {
    axiosLocal.get('city.list.json')
        .then((response) => {
            cities = response.data;

            // Filtra o JSON com base no array de países desejados - Currently disabled
            /*
             cities = response.data.filter((citiesJSON) => {
                 return countries.includes(citiesJSON.country);
             });
            */
        }).catch((error) => {
            console.log(error);
        });
}

// Requisição assíncrona para a API
function getForecast() {
    axiosAPI.get('', { params: { id: inputText.dataset.id, appid: apiKey, units: 'metric', lang: 'pt_br' } })
        .then((response) => {
            console.log(response.data);
            // Mostra o resultado para o usuário
            displayForecast(response.data);
        }).catch((error) => {
            console.log(error);
        });
}





// Functions that display info on DOM elements

function displayForecast(forecast) {
    divWeather.innerHTML = '';

    let titleElement = document.createElement('h2');
    let descriptionElement = document.createElement('h3');
    let temperatureElement = document.createElement('h2');
    let timeElement = document.createElement('h3');
    let iconElement = document.createElement('img');

    // Gerando as datas meu deus do céu não é possível que só dê para fazer desse
    // jeito cara, que bagulho horrível. Tô pegando o offset da data local, somando
    // de volta na data local pra gerar uma data no fuso horário padrão, daí eu uso 
    // essa data e coloco o offset da cidade que a API retornou, e finalmente encontro
    // o horário no fuso horário da cidade. As multiplicações são as conversões de tudo
    // pra milisegundos
    let localDate = new Date();
    let dateOffset = localDate.getTimezoneOffset();
    let utcDate = new Date(Date.now() + (dateOffset * 60 * 1000));
    let cityDate = new Date(utcDate.getTime() + (forecast.timezone * 1000));

    let dateString = cityDate.getUTCDate() + '/' + (cityDate.getUTCMonth() + 1) + '/' + cityDate.getUTCFullYear();
    let timeString = cityDate.getHours() + ':' + cityDate.getMinutes();
    let iconURL = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${forecast.weather[0].icon}.svg`;


    titleElement.appendChild(document.createTextNode(forecast.name));
    descriptionElement.appendChild(document.createTextNode(capitalize(forecast.weather[0].description)));
    temperatureElement.appendChild(document.createTextNode(Math.round(forecast.main.temp) + '°C'));
    timeElement.appendChild(document.createTextNode(dateString + '     ' + timeString));
    iconElement.setAttribute('src', iconURL);

    divWeather.appendChild(titleElement);
    divWeather.appendChild(descriptionElement);
    divWeather.appendChild(iconElement);
    divWeather.appendChild(temperatureElement);
    divWeather.appendChild(timeElement);
}

function autocomplete(cities) {
    divSugestion.innerHTML = '';

    // Filta o array de cidades com base no nome
    let sugestions = cities.filter((cities) => {
        return cities.name.toLowerCase().startsWith(inputText.value.toLowerCase().trim());
    });

    // Exibe as 5 primeias sugestões que dão match com a busca
    for (let i = 0; i < 5; i++) {
        displaySugestion(sugestions[i]);
    }
}

function displaySugestion(city) {
    if (city) {
        let cityElement = document.createElement('a');
        cityElement.setAttribute('class', 'dropdown-item');
        cityElement.setAttribute('href', '#');
        cityElement.setAttribute('data-id', city.id);
        cityElement.setAttribute('onclick', 'fillInput(this)')

        cityElement.appendChild(document.createTextNode(city.name + ' - ' + city.country));

        divSugestion.appendChild(cityElement);
    }
}

function fillInput(element) {
    inputText.setAttribute('data-id', element.dataset.id);
    inputText.value = element.innerHTML;//.split(" - ")[0].trim();
    divSugestion.innerHTML = '';

    btnQuery.click();
}





// Função utilitária que retorna a string com a primeira letra maiúscula
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Load cities JSON file at start
getCities();


// Event listeners
btnQuery.addEventListener('click', getForecast);


inputText.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        btnQuery.click();
    } else if (inputText.value === '') {
        divSugestion.innerHTML = '';
    } else {
        autocomplete(cities);
    }
});

