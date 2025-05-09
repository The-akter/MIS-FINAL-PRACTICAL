const countryDataApi = 'https://restcountries.com/v3.1/name/';
const weatherDataApi = 'https://api.openweathermap.org/data/2.5/weather';
const weatherApiKey = '170436749fa77d848bb959bbeb89b3a3';

async function getCountryData() {
    const countryName = document.getElementById('country-name').value.trim();
    if (!countryName) {
        alert('Please enter a country name.');
        return;
    }

    try {
        const countryResponse = await fetch(`${countryDataApi}${countryName}`);
        if (!countryResponse.ok) {
            throw new Error('Country not found!');
        }
        const countryData = await countryResponse.json();

        const country = countryData[0];
        const weatherResponse = await fetch(`${weatherDataApi}?q=${countryName}&appid=${weatherApiKey}&units=metric`);
        if (!weatherResponse.ok) {
            throw new Error('Weather data not found!');
        }
        const weatherData = await weatherResponse.json();

        displayResults(country, weatherData);
    } catch (error) {
        alert(error.message);
    }
}

function displayResults(country, weatherData) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ''; // Clear previous results

    const countryCard = document.createElement('div');
    countryCard.classList.add('country-card');

    const flag = country.flags ? country.flags.png : 'N/A';
    const weatherDescription = weatherData.weather && weatherData.weather[0] ? weatherData.weather[0].description : 'N/A';

    
    const currencies = country.currencies;
    let currencyInfo = 'N/A';
    if (currencies) {
        const currencyCode = Object.keys(currencies)[0];
        const currency = currencies[currencyCode];
        currencyInfo = `${currency.name} (${currency.symbol}) [${currencyCode}]`;
    }

    countryCard.innerHTML = `
        <img src="${flag}" alt="${country.name.common} Flag" style="width: 150px; height: 100px;">
        <h3>${country.name.common}</h3>
        <p>Capital: ${country.capital ? country.capital[0] : 'N/A'}</p>
        <p>Population: ${country.population.toLocaleString()}</p>
        <p>Region: ${country.region}</p>
        <p>Currency: ${currencyInfo}</p>
        <p>Weather: ${weatherData.main.temp}°C, ${weatherDescription}</p>
        
    `;

    resultsContainer.appendChild(countryCard);
}
