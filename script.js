// APIs used
const GEO_API_URL = 'https://ipapi.co/json/'; // API to get user's location
const TIME_API_URL = 'https://worldtimeapi.org/api/timezone/'; // API to get time for a timezone

// Fetch location data and display time
async function fetchTime() {
    try {
      // Get the user's location
      const geoResponse = await fetch('https://ipapi.co/json/');
      if (!geoResponse.ok) throw new Error(`Geolocation API Error: ${geoResponse.statusText}`);
      const locationData = await geoResponse.json();
  
      const { city, region, country_name, timezone } = locationData;
  
      // Fetch the current time for the user's timezone
      const timeResponse = await fetch(`https://worldtimeapi.org/api/timezone/${timezone}`);
      if (!timeResponse.ok) throw new Error(`Time API Error: ${timeResponse.statusText}`);
      const timeData = await timeResponse.json();
  
      const { datetime } = timeData;
  
      displayTime(city, region, country_name, datetime);
    } catch (error) {
      console.error('Error fetching time:', error);
      document.getElementById('time-display').innerHTML = `<p>Error: ${error.message}</p>`;
    }
  }
  

// Display the date and time on the page
function displayTime(city, region, country, datetime) {
  const timeDisplay = document.getElementById('time-display');
  const formattedDateTime = new Date(datetime).toLocaleString(); // Convert ISO string to a readable format

  timeDisplay.innerHTML = `
    <p><strong>Location:</strong> ${city}, ${region}, ${country}</p>
    <p><strong>Current Date and Time:</strong> ${formattedDateTime}</p>
  `;
}

// Load time on page load
fetchTime();
