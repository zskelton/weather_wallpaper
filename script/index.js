const start = () => {
  console.log("hit draw")
  ctx.fillStyle = 'red';
  ctx.fillRect(100, 100, 100, 100);
}

const stop = () => {
  console.log("hit stop")
}

const clear = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const main = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

main();


document.getElementById('start').addEventListener('click', start);
document.getElementById('stop').addEventListener('click', stop);
document.getElementById('clear').addEventListener('click', clear);