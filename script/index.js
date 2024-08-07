/* 6/19/2024 - Live Weather Wallpaper */
/* Adds a layer of weather on your background image. */

// VARIABLES
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let network_status = true;
let snowday = null;
let rainday = null;
let properties = {
  zipcode: 50201,
  image: "images//background.jpg",
  debug: false
}

let currentWeather = {
  weather: "Clear",
  cloudy: false,
  cloudiness: 0,
  temperature: 0,
  location: "NA"
}

// FUNCTIONS
async function getWeather(_zipcode) {
  const url = `https://api.openweathermap.org/data/2.5/weather?zip=${_zipcode}&appid=${api_key}&units=imperial`

  const _data = await fetch(url).then(response => {
    if (!response.ok) {
      console.error("Failed to fetch weather data");
      return false;
    }
    return response.json();
  }).catch(() => {
    return false;
  })

  network_status = _data ? true : false;

  return _data
}

function processWeatherData(data) {
  currentWeather.cloudy = data?.clouds?.all ? true : false;
  currentWeather.cloudiness = data?.clouds?.all || 0;
  currentWeather.temperature = Math.floor(data?.main?.temp) || 0;
  currentWeather.location = data?.name || "";

  const _weather = data?.weather[0]?.main || "";

  switch (_weather) {
    case "Rain":
      currentWeather.weather = "Rain";
      break;
    case "Snow":
      currentWeather.weather = "Snow";
      break;
    default:
      currentWeather.weather = "Clear";
      break;
  }
}

// Get Changes to Properties
function livelyPropertyListener(name, val) {
  const property_text = document.getElementById('properties_text');

  switch(name) {
    case "zipcode":
      properties.zipcode = val;
      setWeather();
      break;
    case "background":
      properties.image = val;
      setBackground();
      break;
    case "debug":
      properties.debug = val;
      setDebug();
      break;
    default:
      break;
  }

  property_text.innerHTML = JSON.stringify(properties, null, 2);
}

// Change Background Image
const setBackground = () => {
  const _background = getElementById("background");
  _background.src = properties.image;
}


// Debug Setters
const setDebug = () => {
  const debugs = document.getElementsByClassName('debug');

  for (let i = 0; i < debugs.length; i++) {
    if (properties.debug) {
      debugs[i].style = "display: block";
    } else {
      debugs[i].style = "display: none";
    }
  }
}

const setWeatherDebug = (_weather) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const weather_text = document.getElementById('weather_text');
  weather_text.innerHTML = _weather;
  currentWeather.weather = _weather;
}

// Weather Setters
const setCloudy = (_cloudy) => {
  const cloud = document.getElementById('cloud');
  cloud.style = _cloudy ? "display: block" : "display: none";

  const cloudy_text = document.getElementById('cloudy_text');
  cloudy_text.innerHTML = _cloudy ? "☁" : "☀";
  currentWeather.cloudy = _cloudy;
}

const setCloudiness = (_cloudiness) => {
  const background = document.getElementById('background');
  background.style = `filter: grayscale(${_cloudiness})`;

  const cloud = document.getElementById('cloud');
  cloud.style = `opacity: ${_cloudiness * 0.01}`;
  currentWeather.cloudiness = _cloudiness;

  const cloudiness_text = document.getElementById('cloudiness_text');
  cloudiness_text.innerHTML = _cloudiness;
}


const setWeather = async () => {
  const _data = await getWeather(properties?.zipcode || "50010");

  if (!_data) {
    return;
  } else {
    console.log(_data);
    processWeatherData(_data);
  }
}

const setLocationInfo = () => {
  const location = document.getElementById('location_output');
  const _info = `${currentWeather.location}, ${currentWeather.temperature}°F`

  if (network_status) {
    location.innerHTML = _info;
    location.style = "color: white"
  } else {
    location.innerHTML = "Network Error";
    location.style = "color: red"
  }
}

const drawWeather = () => {
  switch (currentWeather.weather) {
    case "Snow":
      snowday.draw();
      snowday.update();
      break;
    case "Rain":
      rainday.draw();
      rainday.update();
      break;
    default:
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  setCloudiness(currentWeather.cloudiness);
  setCloudy(currentWeather.cloudy);
  setLocationInfo();
}

const main = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  snowday = new SnowyDay(canvas, ctx);
  rainday = new RainyDay(canvas, ctx);

  // Initiatialize
  setWeather();

  // Set Updaters
  setInterval(() => {
    setWeather();
  }, 1000 * 60 * 15); // Pull new weather every 15 minutes

  setInterval(() => {
    drawWeather();
  }, 1000 / 30); // Draw weather every 60th of a second
}

// START
main();

// EVENT LISTENERS
document.getElementById('clear').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.querySelectorAll('input[name="weather_opts"]').forEach((input) => {
  input.addEventListener('change', (event) => {
    setWeatherDebug(event.target.value);
  });
});

document.getElementById('cloudy').addEventListener('change', (event) => {
  setCloudy(event.target.checked);
});

document.getElementById('cloudiness').addEventListener('change', (event) => {
  if (cloudy) {
    setCloudiness(event.target.value);
  }
});

// Catch Debug
document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.key === 'd') {
    event.preventDefault();
    properties.debug = !properties.debug;
    setDebug();
  }
});
