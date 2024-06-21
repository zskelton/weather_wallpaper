/* 6/19/2024 - Live Weather Wallpaper */
/* Adds a layer of weather on your background image. */

// VARIABLES
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let power = false;
let weather = "clear";
let cloudy = false;
let debug = true;

// FUNCTIONS
const setpower = (on) => {
  const status_text = document.getElementById('status_text');
  if (on) {
    power = true;
    status_text.innerHTML = "On";
    status_text.style = "color: green";
  } else {
    power = false;
    status_text.innerHTML = "Off";
    status_text.style = "color: red";
  }
}

const setweather = (weather) => {
  const weather_text = document.getElementById('weather_text');
  weather_text.innerHTML = weather;
}

const setcloudy = (cloudy) => {
  const cloudy_text = document.getElementById('cloudy_text');
  if (cloudy) {
    cloudy_text.innerHTML = "☁";
  } else {
    cloudy_text.innerHTML = "☀";
  }
}

const main = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// START
main();

// EVENT LISTENERS
document.getElementById('start').addEventListener('click', () => {
  ctx.fillStyle = 'red';
  ctx.fillRect(100, 100, 100, 100);
  setpower(true);
});

document.getElementById('stop').addEventListener('click', () => {
  setpower(false);
});

document.getElementById('clear').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById('weather').addEventListener('change', (event) => {
  switch (event.target.value) {
    case "clear":
      setweather("Clear");
      break;
    case "rainy":
      setweather("Rain");
      break;
    case "snowy":
      setweather("Snow");
      break;
    default:
      setweather("Clear");
  }
});

document.getElementById('cloudy').addEventListener('change', (event) => {
  const cloudy_text = document.getElementById('cloudy_text');
  if (event.target.checked) {
    cloudy = true;
  } else {
    cloudy = false;
  }
  setcloudy(cloudy);
});

document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.key === 'd') {
    event.preventDefault();
    debug = !debug;
    const debugs = document.getElementsByClassName('debug');
    for (let i = 0; i < debugs.length; i++) {
      if (debug) {
        debugs[i].style = "display: block";
      } else {
        debugs[i].style = "display: none";
      }
    }
  }
});
