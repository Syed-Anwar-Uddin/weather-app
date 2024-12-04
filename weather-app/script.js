const API_KEY = 'your-api-key'; // Replace with your Weather API key

const currentLocationElement = document.getElementById('currentLocation');
const currentTemperatureElement = document.getElementById('currentTemperature');
const currentConditionElement = document.getElementById('currentCondition');
const currentHumidityElement = document.getElementById('currentHumidity');
const currentWindElement = document.getElementById('currentWind');
const currentWeatherIconElement = document.getElementById('currentWeatherIcon');

const searchedCityElement = document.getElementById('searchedCity');
const searchedTemperatureElement = document.getElementById('searchedTemperature');
const searchedConditionElement = document.getElementById('searchedCondition');
const searchedHumidityElement = document.getElementById('searchedHumidity');
const searchedWindElement = document.getElementById('searchedWind');
const searchedWeatherIconElement = document.getElementById('searchedWeatherIcon');
const errorMessageElement = document.getElementById('errorMessage');
const searchButton = document.getElementById('searchButton');
const cityInput = document.getElementById('cityInput');

// Function to fetch weather data and update the UI
const fetchWeather = (city, isCurrentLocation = false) => {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
  
  fetch(apiURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const { name } = data;
      const { temp, humidity } = data.main;
      const { description, icon } = data.weather[0];
      const { speed } = data.wind;

      if (isCurrentLocation) {
        currentLocationElement.textContent = `Location: ${name}`;
        currentTemperatureElement.textContent = `Temperature: ${temp}°C`;
        currentConditionElement.textContent = `Condition: ${description}`;
        currentHumidityElement.textContent = `Humidity: ${humidity}%`;
        currentWindElement.textContent = `Wind Speed: ${speed} m/s`;
        currentWeatherIconElement.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        currentWeatherIconElement.hidden = false;
      } else {
        searchedCityElement.textContent = `City: ${name}`;
        searchedTemperatureElement.textContent = `Temperature: ${temp}°C`;
        searchedConditionElement.textContent = `Condition: ${description}`;
        searchedHumidityElement.textContent = `Humidity: ${humidity}%`;
        searchedWindElement.textContent = `Wind Speed: ${speed} m/s`;
        searchedWeatherIconElement.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        searchedWeatherIconElement.hidden = false;
      }

      errorMessageElement.textContent = '';
    })
    .catch((err) => {
      console.error('Error fetching weather data:', err);
      errorMessageElement.textContent = 'Failed to fetch weather data. Please check the city name.';
      searchedWeatherIconElement.hidden = true;
    });
};

// Get current location's weather using geolocation
const getCurrentLocationWeather = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

        fetch(apiURL)
          .then((response) => response.json())
          .then((data) => {
            const { name } = data;
            const { temp, humidity } = data.main;
            const { description, icon } = data.weather[0];
            const { speed } = data.wind;

            currentLocationElement.textContent = `Location: ${name}`;
            currentTemperatureElement.textContent = `Temperature: ${temp}°C`;
            currentConditionElement.textContent = `Condition: ${description}`;
            currentHumidityElement.textContent = `Humidity: ${humidity}%`;
            currentWindElement.textContent = `Wind Speed: ${speed} m/s`;
            currentWeatherIconElement.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            currentWeatherIconElement.hidden = false;

            errorMessageElement.textContent = '';
          })
          .catch((err) => {
            console.error('Error fetching weather data:', err);
            errorMessageElement.textContent = 'Failed to fetch weather data for your location.';
            currentWeatherIconElement.hidden = true;
          });
      },
      (error) => {
        errorMessageElement.textContent = 'Geolocation is not available or denied.';
      }
    );
  } else {
    errorMessageElement.textContent = 'Geolocation is not supported by your browser.';
  }
};

// Fetch current location weather on page load
getCurrentLocationWeather();

// Search weather by city name
searchButton.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city, false);
  } else {
    errorMessageElement.textContent = 'Please enter a city name.';
  }
});
