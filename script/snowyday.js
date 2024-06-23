// A class for snowy days.
class SnowyDay {
  constructor(_canvas, _ctx) {
    this.canvas = _canvas;
    this.ctx = _ctx;
    this.particles = [];
    this.angle = 0;
    this.mp = 50;
    this.ready = false;

    this.particles = [];
    for (let i = 0; i < this.mp; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        r: Math.random() * 4 + 1,
        d: Math.random() * this.mp
      });
    }
    this.ready = true;
  }

  draw() {
    if(!this.ready) throw new Error("SnowyDay not ready");
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.beginPath();
    for (let i = 0; i < this.mp; i++) {
      const p = this.particles[i];
      this.ctx.moveTo(p.x, p.y);
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
    }
    this.ctx.fill();
  }

  update () {
    if(!this.ready) throw new Error("SnowyDay not ready");
    this.angle += 0.01
    for (let i = 0; i < this.mp; i++) {
      const p = this.particles[i];
      p.y += Math.cos(p.d) + 1 + p.r / 2;
      p.x += Math.sin(p.d) * 2;

      // If snow reaches the bottom, send it back to the top
      if (p.x > this.canvas.width + 5 || p.x < -5 || p.y > this.canvas.height) {
        if (i % 3 > 0) {
          this.particles[i] = { x: Math.random() * this.canvas.width, y: -10, r: p.r, d: p.d };
        } else {
          if (Math.sin(p.d) > 0) {
            this.particles[i] = { x: -5, y: Math.random() * this.canvas.height, r: p.r, d: p.d };
          } else {
            this.particles[i] = { x: this.canvas.width + 5, y: Math.random() * this.canvas.height, r: p.r, d: p.d };
          }
        }
      }
    }
  }

  kill () {
    this.particles = [];
    this.ready = false;
  }
}
