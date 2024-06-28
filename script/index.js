/* 6/19/2024 - Live Weather Wallpaper */
/* Adds a layer of weather on your background image. */

// VARIABLES
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let snowday = null;
let rainday = null;
let properties = {
  zipcode: 50010,
  image: "images//background.jpg",
  debug: false
}

// TODO: Make this a secret
const api_key = "8a501082a8bb88ac1a46b416876164b2";

// FUNCTIONS
async function getWeather(_zipcode) {
  const url = `https://api.openweathermap.org/data/2.5/weather?zip=${_zipcode}&appid=${api_key}&units=imperial`

  fetch(url).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function processWeatherData(data) {
  cloudy = data?.clouds?.all || false;
  cloudiness = data?.clouds?.all || 0;

  if (data?.rain) {
    weather = "Rain";
  } else if (data?.snow) {
    weather = "Snow";
  } else {
    weather = "Clear";
  }
}


function livelyPropertyListener(name, val) {
  const property_text = document.getElementById('properties_text');

  switch(name) {
    case "zipcode":
      properties.zipcode = val;
      break;
    case "background":
      properties.image = val;
      break;
    case "debug":
      properties.debug = val;
      break;
    default:
      break;
  }

  property_text.innerHTML = JSON.stringify(properties, null, 2);
}

const setweather = (_weather) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const weather_text = document.getElementById('weather_text');
  weather_text.innerHTML = _weather;
  weather = _weather;
}

const setcloudy = (_cloudy) => {
  const cloud = document.getElementById('cloud');
  cloud.style = _cloudy ? "display: block" : "display: none";

  const cloudy_text = document.getElementById('cloudy_text');
  cloudy_text.innerHTML = _cloudy ? "☁" : "☀";
  cloudy = _cloudy;
}

const setcloudiness = (_cloudiness) => {
  const background = document.getElementById('background');
  background.style = `filter: grayscale(${_cloudiness})`;

  const cloud = document.getElementById('cloud');
  cloud.style = `opacity: ${_cloudiness}`;
  cloudiness = _cloudiness;

  const cloudiness_text = document.getElementById('cloudiness_text');
  cloudiness_text.innerHTML = _cloudiness;
}

const showWeather = async () => {
  getWeather(properties?.zipcode || "50010").then((data) => {
    processWeatherData(data);
    if (cloudy) {
      setcloudy(cloudy);
    }

    if (cloudiness !== 0) {
      setcloudiness(cloudiness);
    }

    switch (weather) {
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
    
    console.log(data);
    console.log("Weather: ", weather);
    console.log("Cloudy: ", cloudy);
    console.log("Cloudiness: ", cloudiness);
  });
}

const main = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  snowday = new SnowyDay(canvas, ctx);
  rainday = new RainyDay(canvas, ctx);

  // Loop
  // if on, draw current weather
  // if off, clear canvas

  showWeather();

  // setInterval(() => {
  //   showWeather();
  // }, 1000 * 15);
}

// START
main();

// EVENT LISTENERS
document.getElementById('clear').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.querySelectorAll('input[name="weather_opts"]').forEach((input) => {
  input.addEventListener('change', (event) => {
    setweather(event.target.value);
  });
});

document.getElementById('cloudy').addEventListener('change', (event) => {
  setcloudy(event.target.checked);
});

document.getElementById('cloudiness').addEventListener('change', (event) => {
  if (cloudy) {
    setcloudiness(event.target.value);
  }
});

// Catch Debug
document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.key === 'd') {
    event.preventDefault();
    properties.debug = !proerpties.debug;
    const debugs = document.getElementsByClassName('debug');
    const notification = document.getElementById('notification');
    for (let i = 0; i < debugs.length; i++) {
      if (properties.debug) {
        debugs[i].style = "display: block";
        notification.style = "display: none";
      } else {
        debugs[i].style = "display: none";
        notification.style = "display: block";
      }
    }
  }
});
