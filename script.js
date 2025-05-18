function getWeather() {
    const apiKey = '7851c05940a74157a68155259252804';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a location');
        return;
    }

    const currentWeatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1`;
    document.getElementById('temp-div').innerHTML = '<p>Loading...</p>';
    document.getElementById('weather-condition').innerHTML = '';
    document.getElementById('city-name').innerHTML = '';
    document.getElementById('humidity-value').innerHTML = '--';
    document.getElementById('wind-value').innerHTML = '--';
    document.getElementById('hourly-forecast').innerHTML = '';
    showWeatherElements();

    fetch(currentWeatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Location not found or network error');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            document.getElementById('temp-div').innerHTML = '<p>Error</p>';
            document.getElementById('weather-condition').innerHTML = error.message;
        });

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Forecast data unavailable');
            }
            return response.json();
        })
        .then(data => {
            displayHourlyForecast(data.forecast.forecastday[0].hour);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            document.getElementById('hourly-forecast').innerHTML = 'Forecast unavailable';
        });
}

function displayWeather(data) {
    const tempDiv = document.getElementById('temp-div');
    const weatherCondition = document.getElementById('weather-condition');
    const cityName = document.getElementById('city-name');
    const weatherIcon = document.getElementById('weather-icon');
    const humidityValue = document.getElementById('humidity-value');
    const windValue = document.getElementById('wind-value');
    const cityNameText = data.location.name;
    const temperature = Math.round(data.current.temp_c); 
    const description = data.current.condition.text;
    const humidity = data.current.humidity;
    const windSpeed = data.current.wind_kph;
    
    const iconMap = {
        'Sunny': 'https://cdn-icons-png.flaticon.com/512/979/979585.png',
        'Clear': 'https://cdn-icons-png.flaticon.com/512/3222/3222800.png',
        'Partly cloudy': 'https://cdn-icons-png.flaticon.com/512/1146/1146869.png',
        'Cloudy': 'https://cdn-icons-png.flaticon.com/512/414/414927.png',
        'Overcast': 'https://cdn-icons-png.flaticon.com/512/1779/1779940.png',
        'Mist': 'https://cdn-icons-png.flaticon.com/512/4005/4005901.png',
        'Patchy rain possible': 'https://cdn-icons-png.flaticon.com/512/1959/1959317.png',
        'Patchy snow possible': 'https://cdn-icons-png.flaticon.com/512/2315/2315309.png',
        'Patchy sleet possible': 'https://cdn-icons-png.flaticon.com/512/1779/1779927.png',
        'Patchy freezing drizzle possible': 'https://cdn-icons-png.flaticon.com/512/1779/1779927.png',
        'Thundery outbreaks possible': 'https://cdn-icons-png.flaticon.com/512/1779/1779963.png',
        'Blowing snow': 'https://cdn-icons-png.flaticon.com/512/2315/2315309.png',
        'Blizzard': 'https://cdn-icons-png.flaticon.com/512/2315/2315309.png',
        'Fog': 'https://cdn-icons-png.flaticon.com/512/4005/4005901.png',
        'Freezing fog': 'https://cdn-icons-png.flaticon.com/512/4005/4005901.png',
        'Patchy light drizzle': 'https://cdn-icons-png.flaticon.com/512/1779/1779927.png',
        'Light drizzle': 'https://cdn-icons-png.flaticon.com/512/1779/1779927.png',
        'Freezing drizzle': 'https://cdn-icons-png.flaticon.com/512/1779/1779927.png',
        'Heavy freezing drizzle': 'https://cdn-icons-png.flaticon.com/512/1779/1779927.png',
        'Patchy light rain': 'https://cdn-icons-png.flaticon.com/512/1959/1959317.png',
        'Light rain': 'https://cdn-icons-png.flaticon.com/512/1959/1959317.png',
        'Moderate rain at times': 'https://cdn-icons-png.flaticon.com/512/1959/1959317.png',
        'Moderate rain': 'https://cdn-icons-png.flaticon.com/512/1959/1959317.png',
        'Heavy rain at times': 'https://cdn-icons-png.flaticon.com/512/1779/1779940.png',
        'Heavy rain': 'https://cdn-icons-png.flaticon.com/512/1779/1779940.png',
        'Light freezing rain': 'https://cdn-icons-png.flaticon.com/512/1779/1779940.png',
        'Moderate or heavy freezing rain': 'https://cdn-icons-png.flaticon.com/512/1779/1779940.png',
        'Light sleet': 'https://cdn-icons-png.flaticon.com/512/1779/1779940.png',
        'Moderate or heavy sleet': 'https://cdn-icons-png.flaticon.com/512/1779/1779940.png',
        'Patchy light snow': 'https://cdn-icons-png.flaticon.com/512/2315/2315309.png',
        'Light snow': 'https://cdn-icons-png.flaticon.com/512/2315/2315309.png',
        'Patchy moderate snow': 'https://cdn-icons-png.flaticon.com/512/2315/2315309.png',
        'Moderate snow': 'https://cdn-icons-png.flaticon.com/512/2315/2315309.png',
        'Patchy heavy snow': 'https://cdn-icons-png.flaticon.com/512/2315/2315309.png',
        'Heavy snow': 'https://cdn-icons-png.flaticon.com/512/2315/2315309.png',
        'Ice pellets': 'https://cdn-icons-png.flaticon.com/512/1779/1779940.png',
        'Light rain shower': 'https://cdn-icons-png.flaticon.com/512/1959/1959317.png',
        'Moderate or heavy rain shower': 'https://cdn-icons-png.flaticon.com/512/1779/1779940.png',
        'Torrential rain shower': 'https://cdn-icons-png.flaticon.com/512/1779/1779940.png',
        'Light sleet showers': 'https://cdn-icons-png.flaticon.com/512/1779/1779940.png',
        'Moderate or heavy sleet showers': 'https://cdn-icons-png.flaticon.com/512/1779/1779940.png',
        'Light snow showers': 'https://cdn-icons-png.flaticon.com/512/2315/2315309.png',
        'Moderate or heavy snow showers': 'https://cdn-icons-png.flaticon.com/512/2315/2315309.png',
        'Light showers of ice pellets': 'https://cdn-icons-png.flaticon.com/512/1779/1779940.png',
        'Moderate or heavy showers of ice pellets': 'https://cdn-icons-png.flaticon.com/512/1779/1779940.png',
        'Patchy light rain with thunder': 'https://cdn-icons-png.flaticon.com/512/1779/1779963.png',
        'Moderate or heavy rain with thunder': 'https://cdn-icons-png.flaticon.com/512/1779/1779963.png',
        'Patchy light snow with thunder': 'https://cdn-icons-png.flaticon.com/512/1779/1779963.png',
        'Moderate or heavy snow with thunder': 'https://cdn-icons-png.flaticon.com/512/1779/1779963.png',
        'Broken clouds': 'https://cdn-icons-png.flaticon.com/512/1146/1146869.png'
    };
    const iconUrl = iconMap[description] || `https:${data.current.condition.icon}`;


    tempDiv.innerHTML = `<p>${temperature}<span style="font-size: 0.4em; vertical-align: super;">°C</span></p>`;
    weatherCondition.textContent = description;
    cityName.textContent = cityNameText;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    weatherIcon.style.display = 'block';
    
  
    humidityValue.textContent = `${humidity}%`;
    windValue.textContent = `${windSpeed}Km/h`;
}

function showWeatherElements() {

    const weatherMain = document.querySelector('.weather-main');
    weatherMain.style.display = 'block';
    
   
    void weatherMain.offsetWidth;
   
    weatherMain.classList.add('active');

    const weatherDetails = document.querySelector('.weather-details');
    weatherDetails.style.display = 'flex';
    void weatherDetails.offsetWidth;
    weatherDetails.classList.add('active');
    
    const hourlyForecast = document.getElementById('hourly-forecast');
    hourlyForecast.style.display = 'flex';
    void hourlyForecast.offsetWidth;
    hourlyForecast.classList.add('active');
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = ''; 
    const currentHour = new Date().getHours();
    
    const futureHours = hourlyData.filter(item => {
        const itemHour = new Date(item.time).getHours();
        return itemHour > currentHour;
    }).slice(0, 8);

    if (futureHours.length < 8) {
        const remainingHours = 8 - futureHours.length;
        for (let i = 0; i < remainingHours; i++) {
            if (hourlyData[i]) {
                futureHours.push(hourlyData[i]);
            }
        }
    }
    
    const iconMap = {
        'Sunny': 'https://cdn-icons-png.flaticon.com/512/979/979585.png',
        'Clear': 'https://cdn-icons-png.flaticon.com/512/3222/3222800.png',
        'Partly cloudy': 'https://cdn-icons-png.flaticon.com/512/1146/1146869.png',
        'Cloudy': 'https://cdn-icons-png.flaticon.com/512/414/414927.png',
        'Overcast': 'https://cdn-icons-png.flaticon.com/512/1779/1779940.png',
        'Mist': 'https://cdn-icons-png.flaticon.com/512/4005/4005901.png',
        'Patchy rain possible': 'https://cdn-icons-png.flaticon.com/512/1959/1959317.png',
        'Patchy snow possible': 'https://cdn-icons-png.flaticon.com/512/2315/2315309.png',
        'Patchy sleet possible': 'https://cdn-icons-png.flaticon.com/512/1779/1779927.png',
        'Patchy freezing drizzle possible': 'https://cdn-icons-png.flaticon.com/512/1779/1779927.png',
        'Thundery outbreaks possible': 'https://cdn-icons-png.flaticon.com/512/1779/1779963.png',
        'Light rain': 'https://cdn-icons-png.flaticon.com/512/1959/1959317.png',
        'Moderate rain': 'https://cdn-icons-png.flaticon.com/512/1959/1959317.png',
        'Heavy rain': 'https://cdn-icons-png.flaticon.com/512/1779/1779940.png',
        'Light snow': 'https://cdn-icons-png.flaticon.com/512/2315/2315309.png',
        'Moderate snow': 'https://cdn-icons-png.flaticon.com/512/2315/2315309.png',
        'Heavy snow': 'https://cdn-icons-png.flaticon.com/512/2315/2315309.png',
        'Broken clouds': 'https://cdn-icons-png.flaticon.com/512/1146/1146869.png'
    };

    futureHours.forEach(item => {
        const time = new Date(item.time).getHours() + ':00';
        const temperature = Math.round(item.temp_c);
        const condition = item.condition.text;
        const iconUrl = iconMap[condition] || `https:${item.condition.icon}`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span class="hourly-time">${time}</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span class="hourly-temp">${temperature}°</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const inputElement = document.getElementById('city');
    inputElement.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            getWeather();
        }
    });
  
    document.querySelector('.weather-main').classList.remove('active');
    document.querySelector('.weather-details').classList.remove('active');
    document.getElementById('hourly-forecast').classList.remove('active');
});
