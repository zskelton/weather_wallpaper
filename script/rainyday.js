// A class for rainy days.
function random(_min, _max) {
  return Math.random() * (_max - _min) + _min;
}

class RainyDay {
  constructor(_canvas, _ctx) {
    this.canvas = _canvas;
    this.ctx = _ctx;
    this.maxdrops = 1000;
    this.delay = 50;
    this.ready = false;

    this.drops = [];
    for (let i = 0; i < this.maxdrops; i++) {
      this.drops.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        l: Math.random() * 1,
        xs: Math.random() * -4 + Math.random() * 4 +2,
        ys: Math.random() * 10 + 10
      });
    }

    this.ctx.strokeStyle = 'rgba(174,194,224,0.5)';
    this.ctx.lineWidth = 1;
    this.ctx.lineCap = 'round';

    this.ready = true;
  }

  draw() {
    if(!this.ready) throw new Error("RainyDay not ready");
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.maxdrops; i++) {
      let p = this.drops[i];
      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y);
      this.ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
      this.ctx.stroke();
    }
  }

  update () {
    if(!this.ready) throw new Error("SnowyDay not ready");
    for (let i = 0; i < this.drops.length; i++) {
      const p = this.drops[i];
      p.x += p.xs;
      p.y += p.ys;
      if (p.x > this.canvas.width || p.y > this.canvas.height) {
        p.x = Math.random() * this.canvas.width;
        p.y = -20;
      }
    }
  }

  kill () {
    this.particles = [];
    this.ready = false;
  }
}
