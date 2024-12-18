class EnemyProjectile extends MovableObject {
  height = 20;
  width = 20;
  speed = 7.5;
  moveInterval;

  constructor(x, y, targetX, targetY) {
    super().loadImage("../CYBERSTEVE/img/Enemies/3/Projectile.png");
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.shoot();
  }

  shoot() {
    const angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
    const vx = Math.cos(angle) * this.speed;
    const vy = Math.sin(angle) * this.speed;

    this.moveInterval = setInterval(() => {
      this.x += vx;
      this.y += vy;
    }, 16);
  }

  clearProjectile() {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
    }
  }
}
