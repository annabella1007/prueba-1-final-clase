// Global variables
let walls = []; // Array to store boundary objects
let particle;
let stars = []; // Array for background stars
let constellations = [
  { name: "Orion", stars: [[200, 300], [250, 400], [300, 300], [350, 400], [400, 500]] },
  { name: "Cassiopeia", stars: [[100, 200], [150, 250], [200, 200], [250, 150], [300, 200]] },
  { name: "Ursa Major", stars: [[300, 300], [350, 350], [400, 300], [450, 250], [500, 300]] },
  { name: "Lyra", stars: [[400, 200], [450, 250], [500, 200], [550, 150], [600, 200]] },
  { name: "Scorpius", stars: [[250, 500], [300, 550], [350, 500], [400, 450], [450, 400]] },
  { name: "Taurus", stars: [[600, 400], [650, 450], [700, 400], [750, 350], [800, 400]] },
  { name: "Gemini", stars: [[450, 500], [500, 550], [550, 500], [600, 450], [650, 500]] },
  { name: "Leo", stars: [[200, 500], [250, 550], [300, 500], [350, 450], [400, 500]] },
  { name: "Aquila", stars: [[100, 350], [150, 400], [200, 350], [250, 300], [300, 350]] },
  { name: "Virgo", stars: [[500, 150], [550, 200], [600, 150], [650, 100], [700, 150]] }
];
let currentConstellationIndex = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Initialize background stars
  for (let i = 0; i < 500; i++) {
    stars.push({
      pos: createVector(random(width), random(height)),
      size: random(1, 3),
      brightness: random(100, 255),
      flicker: random(0.5, 1.5)
    });
  }

  // Initialize the first constellation and boundary walls
  createConstellation(constellations[currentConstellationIndex].stars);
  createBoundaryWalls();

  // Initialize the particle
  particle = new Particle();
  noCursor();
}

function draw() {
  // Apply fisheye effect to background
  background(0);
  noStroke();
  for (let star of stars) {
    let distToCenter = dist(star.pos.x, star.pos.y, width / 2, height / 2);
    let fisheyeDist = map(distToCenter, 0, width / 2, 1, 0.5); // Fisheye effect strength
    let fisheyeX = width / 2 + (star.pos.x - width / 2) * fisheyeDist;
    let fisheyeY = height / 2 + (star.pos.y - height / 2) * fisheyeDist;
    
    fill(star.brightness, star.brightness, star.brightness, 200);
    ellipse(fisheyeX, fisheyeY, star.size);
    star.brightness += random(-star.flicker, star.flicker); // Flickering effect
    star.brightness = constrain(star.brightness, 100, 255);
  }

  // Display title if no mouse is pressed yet
  if (frameCount < 200) {
    fill(255);
    textSize(32);
    textAlign(CENTER);
    text("Click here to know constellations", width / 2, height / 2);
  }

  // Display walls and particle behavior
  walls.forEach(wall => wall.show());
  particle.update(mouseX, mouseY);
  particle.show();
  particle.look(walls);

  // Display constellation name
  noStroke();
  fill(192, 192, 192);
  textSize(24);
  textAlign(CENTER);
  text(
    constellations[currentConstellationIndex].name,
    width / 2,
    height - 20
  );

  // Display constellation points and names
  drawConstellationPoints(constellations[currentConstellationIndex]);
}

function mousePressed() {
  // Change to the next constellation
  currentConstellationIndex = (currentConstellationIndex + 1) % constellations.length;
  walls = [];
  createConstellation(constellations[currentConstellationIndex].stars);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  stars = []; // Reinitialize stars for the new canvas size
  for (let i = 0; i < 500; i++) {
    stars.push({
      pos: createVector(random(width), random(height)),
      size: random(1, 3),
      brightness: random(100, 255),
      flicker: random(0.5, 1.5)
    });
  }
  walls = [];
  createConstellation(constellations[currentConstellationIndex].stars);
}

// Function to create a constellation from a given set of star coordinates
function createConstellation(starPositions) {
  for (let i = 0; i < starPositions.length; i++) {
    let start = createVector(starPositions[i][0], starPositions[i][1]);
    let end = createVector(
      starPositions[(i + 1) % starPositions.length][0],
      starPositions[(i + 1) % starPositions.length][1]
    );
    walls.push(new Boundary(start.x, start.y, end.x, end.y));
  }
}

// Function to add canvas boundary walls
function createBoundaryWalls() {
  walls.push(new Boundary(0, 0, width, 0)); // Top
  walls.push(new Boundary(width, 0, width, height)); // Right
  walls.push(new Boundary(width, height, 0, height)); // Bottom
  walls.push(new Boundary(0, height, 0, 0)); // Left
}

// Function to draw points and name of the constellation
function drawConstellationPoints(constellation) {
  let avgX = 0;
  let avgY = 0;

  // Draw point for each star
  for (let i = 0; i < constellation.stars.length; i++) {
    let star = constellation.stars[i];
    let distToCenter = dist(star[0], star[1], width / 2, height / 2);
    let fisheyeDist = map(distToCenter, 0, width / 2, 1, 0.5); // Fisheye effect strength
    let fisheyeX = width / 2 + (star[0] - width / 2) * fisheyeDist;
    let fisheyeY = height / 2 + (star[1] - height / 2) * fisheyeDist;

    ellipse(fisheyeX, fisheyeY, 10, 10); // Draw point for each star

    // Accumulate the positions to calculate the average (center)
    avgX += fisheyeX;
    avgY += fisheyeY;
  }

  // Calculate the center of the constellation
  avgX /= constellation.stars.length;
  avgY /= constellation.stars.length;

  // Display the name of the constellation in the center
  fill(255);
  textSize(20);
  textAlign(CENTER);
  text(constellation.name, avgX, avgY - 15); // Name displayed above the center of the constellation
}

// Boundary class
class Boundary {
  constructor(x1, y1, x2, y2) {
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2);
  }

  show() {
    stroke(192); // Silver color
    strokeWeight(2);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}

// Particle class
class Particle {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.rays = [];

    // Create rays at 1-degree intervals
    for (let angle = 0; angle < 360; angle++) {
      this.rays.push(new Ray(this.pos, radians(angle)));
    }
  }

  update(x, y) {
    this.pos.set(x, y);
  }

  look(walls) {
    for (let ray of this.rays) {
      let closest = null;
      let record = Infinity;

      for (let wall of walls) {
        const pt = ray.cast(wall);
        if (pt) {
          const d = p5.Vector.dist(this.pos, pt);
          if (d < record) {
            record = d;
            closest = pt;
          }
        }
      }

      if (closest) {
        stroke(192, 192, 192, 100); // Silver for rays
        line(this.pos.x, this.pos.y, closest.x, closest.y);
      }
    }
  }

  show() {
    fill(192);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 8); // Larger particle
  }
}

// Ray class
class Ray {
  constructor(pos, angle) {
    this.pos = pos;
    this.dir = p5.Vector.fromAngle(angle);
  }

  show() {
    stroke(192);
    push();
    translate(this.pos.x, this.pos.y);
    line(0, 0, this.dir.x * 10, this.dir.y * 10);
    pop();
  }

  cast(wall) {
    const x1 = wall.a.x;
    const y1 = wall.a.y;
    const x2 = wall.b.x;
    const y2 = wall.b.y;
    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.pos.x + this.dir.x;
    const y4 = this.pos.y + this.dir.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den === 0) return;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t > 0 && t < 1 && u > 0) {
      return createVector(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
    }
  }
}
