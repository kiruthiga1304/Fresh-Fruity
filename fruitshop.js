// Add to cart confirmation when "Buy Now" is clicked
document.querySelectorAll('.btn').forEach(function (button) {
    button.addEventListener('click', function (event) {
        event.preventDefault();
        alert('Item added to cart!');
    });
});

// Display dynamic product details on hover
document.querySelectorAll('.product-item').forEach(function (product) {
    product.addEventListener('mouseenter', function () {
        this.style.backgroundColor = '#f9f9f9'; // Change background color
        this.querySelector('p').style.display = 'block'; // Show details
    });

    product.addEventListener('mouseleave', function () {
        this.style.backgroundColor = ''; // Reset background color
        this.querySelector('p').style.display = ''; // Hide details
    });
});

const TIME_API_URL = 'https://api.timezonedb.com/v2.1/get-time-zone'; // Timezone API (requires API key)
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather'; // Weather API
const TIMEZONE_API_KEY = 'KLN6OG1EBDP2'; // Replace with your valid TimezoneDB API key
const WEATHER_API_KEY = '20a1ed8ced5685ca4039dafa7b99f5e8'; // Replace with your valid OpenWeatherMap API key

// Get user's location and display time
async function fetchTime() {
    try {
        // Step 1: Get user's geolocation (latitude and longitude)
        const position = await getGeolocation();

        const { latitude, longitude } = position.coords;

        // Step 2: Fetch time data for the latitude and longitude
        const timeResponse = await fetch(
            `${TIME_API_URL}?key=${TIMEZONE_API_KEY}&format=json&by=position&lat=${latitude}&lng=${longitude}`
        );

        if (!timeResponse.ok) throw new Error(`Time API Error: ${timeResponse.statusText}`);
        const timeData = await timeResponse.json();

        const { zoneName, formatted } = timeData;

        // Step 3: Display the results
        displayTime(latitude, longitude, zoneName, formatted);
    } catch (error) {
        console.error('Error fetching time:', error);
        document.getElementById('time-display').innerHTML =
            '<p>Error: Unable to fetch time data. Please try again later.</p>';
    }
}

// Get user's location using browser's Geolocation API
function getGeolocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser.'));
        }

        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

// Display the date and time on the page
function displayTime(lat, lng, timezone, datetime) {
    const timeDisplay = document.getElementById('time-display');

    timeDisplay.innerHTML = `
    <p><strong>Coordinates:</strong> ${lat.toFixed(2)}, ${lng.toFixed(2)}</p>
    <p><strong>Timezone:</strong> ${timezone}</p>
    <p><strong>Current Date and Time:</strong> ${datetime}</p>
  `;
}

// Fetch weather data
async function fetchWeather(lat, lng) {
    try {
        const response = await fetch(
            `${WEATHER_API_URL}?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`
        );
        if (!response.ok) throw new Error(`Weather API Error: ${response.statusText}`);
        return response.json();
    } catch (error) {
        console.error('Error fetching weather:', error);
        document.getElementById('weather-display').innerHTML =
            '<p>Error: Unable to fetch weather data. Please try again later.</p>';
    }
}

// Display weather information on the page
function displayWeather(weatherData) {
    if (!weatherData) return; // If no weather data is available, exit
    const weatherDisplay = document.getElementById('weather-display');
    const { name, main, weather } = weatherData;

    weatherDisplay.innerHTML = `
      <p><strong>Location:</strong> ${name}</p>
      <p><strong>Temperature:</strong> ${main.temp} °C</p>
      <p><strong>Weather:</strong> ${weather[0].description}</p>
      <p><strong>Humidity:</strong> ${main.humidity}%</p>
    `;
}

// Load time and weather on page load
async function fetchData() {
    try {
        const position = await getGeolocation();
        const { latitude, longitude } = position.coords;

        // Fetch and display time
        await fetchTime();

        // Fetch and display weather
        const weatherData = await fetchWeather(latitude, longitude);
        displayWeather(weatherData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchData();
