/* 6/19/2024 - Live Weather Wallpaper */
/* Adds a layer of weather on your background image. */

// VARIABLES
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let power = true;
let weather = "Rain";
let cloudy = false;
let debug = false;

let snowday = null;
let rainday = null;

// FUNCTIONS
const setpower = (powerstatus) => {
  const status_text = document.getElementById('status_text');
  const stop_btn = document.getElementById('stop');
  const start_btn = document.getElementById('start');
  power = powerstatus;
  status_text.innerHTML = power ? "On" : "Off";
  status_text.style = power ? "color: green" : "color: red";
  stop_btn.disabled = power ? false : true;
  start_btn.disabled = power ? true : false;
  if (!power) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
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
  const background = document.getElementById('background');
  background.style = _cloudy ? "filter: grayscale(0.5)" : "filter: grayscale(0)";

  const cloudy_text = document.getElementById('cloudy_text');
  cloudy_text.innerHTML = _cloudy ? "☁" : "☀";
  cloudy = _cloudy;
}

const main = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  snowday = new SnowyDay(canvas, ctx);
  rainday = new RainyDay(canvas, ctx);

  // Loop
  // if on, draw current weather
  // if off, clear canvas
  setInterval(() => {
    if (power) {
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
    }
  }, 1000 / 60);
}

// START
main();

// EVENT LISTENERS
document.getElementById('start').addEventListener('click', () => {
  setpower(true);
});

document.getElementById('stop').addEventListener('click', () => {
  setpower(false);
});

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

// Catch Debug
document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.key === 'd') {
    event.preventDefault();
    debug = !debug;
    const debugs = document.getElementsByClassName('debug');
    const notification = document.getElementById('notification');
    for (let i = 0; i < debugs.length; i++) {
      if (debug) {
        debugs[i].style = "display: block";
        notification.style = "display: none";
      } else {
        debugs[i].style = "display: none";
        notification.style = "display: block";
      }
    }
  }
});
