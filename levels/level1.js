function createLevel1() {
  return new Level(
    [
      createEnemy1(400, 260),
      createEnemy2(700, 310),
      createEnemy2(1200, 310),
      createEnemy1(1600, 260),
      createEnemy2(2000, 310),
      createEnemy1(2300, 260),
      createEnemy2(2600, 310),
      new Endboss(),
    ],
    [new Cloud()],
    [
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/1.png", -720),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/3.png", -720),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/4.png", -720),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/5.png", -720),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/6.png", -720),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/7.png", -720),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/9.png", -720),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/1.png", 0),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/3.png", 0),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/4.png", 0),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/5.png", 0),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/6.png", 0),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/7.png", 0),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/9.png", 0),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/1.png", 720),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/2.png", 720),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/3.png", 720),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 3/4.png", 720),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 3/5.png", 720),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/6.png", 720),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/7.png", 720),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 3/7.png", 720),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/9.png", 720),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/1.png", 1440),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/3.png", 1440),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/4.png", 1440),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/5.png", 1440),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/6.png", 1440),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/7.png", 1440),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/8.png", 1440),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/9.png", 1440),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/1.png", 2160),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/3.png", 2160),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 1/4.png", 2160),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 1/5.png", 2160),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/6.png", 2160),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/7.png", 2160),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/9.png", 2160),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/1.png", 2880),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/3.png", 2880),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 1/4.png", 2880),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 1/5.png", 2880),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/6.png", 2880),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/7.png", 2880),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 1/8.png", 2880),
      new BackgroundObject("../CYBERSTEVE/img/Background/city 2/9.png", 2880),
    ],
    [
      new Crystal(200 + Math.random() * 300, 250 + Math.random() * 60),
      new Crystal(600 + Math.random() * 300, 180 + Math.random() * 100),
      new Crystal(1000 + Math.random() * 400, 220 + Math.random() * 80),
      new Crystal(1500 + Math.random() * 300, 160 + Math.random() * 120),
      new Crystal(1900 + Math.random() * 350, 200 + Math.random() * 90),
      new Crystal(2300 + Math.random() * 250, 240 + Math.random() * 70),
      new Crystal(2700 + Math.random() * 200, 190 + Math.random() * 110),

      new Crystal(800 + Math.random() * 500, 150 + Math.random() * 80),
      new Crystal(1400 + Math.random() * 400, 280 + Math.random() * 40),
      new Crystal(2000 + Math.random() * 600, 170 + Math.random() * 100),
      new Crystal(2500 + Math.random() * 300, 230 + Math.random() * 60),
    ]
  );
}

function createEnemy1(x, y) {
  let enemy = new Enemy1();
  enemy.x = x;
  enemy.y = y;
  return enemy;
}

function createEnemy2(x, y) {
  let enemy = new Enemy2();
  enemy.x = x;
  enemy.y = y;
  return enemy;
}
