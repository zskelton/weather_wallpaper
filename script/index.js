/* 6/19/2024 - Live Weather Wallpaper */
/* Adds a layer of weather on your background image. */

// VARIABLES
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let power = false;
let weather = "clear";
let cloudy = false;
let debug = true;
let snowparticles = [];
let angle = 0;
let mp = 50;

// GENERATE WEATHER VARIABLES
const generate_snow = (_mp = 50) => {
  mp = _mp;
  console.log("Generating snow")
  const particles = [];
  for (let i = 0; i < mp; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 4 + 1,
      d: Math.random() * mp
    });
  }
  snowparticles = [...particles];
}

// WEATHER EFFECTS
const draw_snow = () => {
  console.log("Drawing snow");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.beginPath();
  for (let i = 0; i < mp; i++) {
    const p = snowparticles[i];
    ctx.moveTo(p.x, p.y);
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
  }
  ctx.fill();

  // Update snow position
  angle += 0.01
  for (let i = 0; i < mp; i++) {
    const p = snowparticles[i];
    p.y += Math.cos(p.d) + 1 + p.r / 2;
    p.x += Math.sin(p.d) * 2;

    // If snow reaches the bottom, send it back to the top
    if (p.x > canvas.width + 5 || p.x < -5 || p.y > canvas.height) {
      if (i % 3 > 0) {
        snowparticles[i] = { x: Math.random() * canvas.width, y: -10, r: p.r, d: p.d };
      } else {
        if (Math.sin(p.d) > 0) {
          snowparticles[i] = { x: -5, y: Math.random() * canvas.height, r: p.r, d: p.d };
        } else {
          snowparticles[i] = { x: canvas.width + 5, y: Math.random() * canvas.height, r: p.r, d: p.d };
        }
      }
    }
  }
}

// FUNCTIONS
const reset_variables = () => {
  snowparticles = [];
}

const setpower = (on) => {
  const status_text = document.getElementById('status_text');
  const stop_btn = document.getElementById('stop');
  const start_btn = document.getElementById('start');
  if (on) {
    power = true;
    status_text.innerHTML = "On";
    status_text.style = "color: green";
    stop_btn.disabled = false;
    start_btn.disabled = true;
  } else {
    power = false;
    status_text.innerHTML = "Off";
    status_text.style = "color: red";
    stop_btn.disabled = true;
    start_btn.disabled = false;
  }
}

const setweather = (_weather) => {
  const weather_text = document.getElementById('weather_text');
  weather_text.innerHTML = _weather;
  weather = _weather;
}

const setcloudy = (_cloudy) => {
  const cloudy_text = document.getElementById('cloudy_text');
  if (_cloudy) {
    cloudy_text.innerHTML = "☁";
  } else {
    cloudy_text.innerHTML = "☀";
  }
  cloudy = _cloudy;
}

const main = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Loop
  // if on, draw current weather
  // if off, clear canvas
  setInterval(() => {
    if (power) {
      console.log("Drawing weather");
      console.log("Weather: " + weather);
      console.log("Power: " + power);
      switch (weather) {
        case "Snow":
          draw_snow();
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
  reset_variables();
  switch (event.target.value) {
    case "clear":
      setweather("Clear");
      break;
    case "rainy":
      setweather("Rain");
      break;
    case "snowy":
      generate_snow(50);
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
