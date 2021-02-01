let amplitude = 75.0; // Height of wave
let cur1 = 0;
let cur2 = 0;
let add = 0.07
const outset = 80;
let vehicles = [];
let canvas;
let mainTitle;
let title;
let centerX;
let centerY;
let pageTitle;

function preload(){
  font = loadFont('/../assets/Roboto-Regular.ttf');
  pageTitle = document.title;
}

function setup() {
  centerX = windowWidth/2;
  centerY = windowHeight/2;
  mainTitle = document.getElementById("mainTitle");
  title = document.getElementById("titleCanvas");
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0,0);
  canvas.style('z-index', '-1');
  strokeWeight(8);

  //Sets up the main page title
  if(mainTitle){
    textAlign(CENTER, CENTER);
    var points = font.textToPoints('Open Display', centerX-240, centerY, 80, {
      sampleFactor: 0.12
    });
  
    for (var i = 0; i < points.length; i++) {

      var pt = points[i];
      var vehicle = new Vehicle(pt.x, pt.y);
      vehicles.push(vehicle);
    }
    /*
    //this code repurposed from Daniel Shiffman
    */
  }
  if(title){
    textAlign(CENTER, CENTER);

    const center = document.getElementById('num')?document.getElementById('num').textContent:170;
    console.log(center);
    var points = font.textToPoints(document.getElementById('titleName').textContent, centerX-parseInt(center), 100, 60, {
      sampleFactor: 0.18
    });
  
    for (var i = 0; i < points.length; i++) {

      var pt = points[i];
      var vehicle = new Vehicle(pt.x, pt.y);
      vehicles.push(vehicle);
    }
  }
  
}

function windowResized(){
    canvas = resizeCanvas(windowWidth, windowHeight);
    let changeX = centerX;
    let changeY = centerY;
    centerX = windowWidth/2;
    centerY = windowHeight/2;
    changeX -= centerX;
    changeY -= centerY;
    console.log(changeX);
    console.log(changeY);
    
    if(mainTitle){
      //changes the locations of the title on resize
      vehicles.map((v) => {
        v.changeTarget(v.curX - changeX, v.curY - changeY);
        v.curX = v.curX - changeX;
        v.curY = v.curY - changeY;
      });
    }
    if(title){
      //changes the locations of the title on resize
      vehicles.map((v) => {
        v.changeTarget(v.curX - changeX, v.curY - changeY);
        v.curX = v.curX - changeX;
        v.curY = v.curY - changeY;
      });
    }
}

function draw() {
  cur1 += 0.05;
  cur2 += add;
  fill(18,51,200);
  background(0);
  beginShape();
  stroke(255);
  
  vertex(0, windowHeight);
  vertex(0,0);
  createSin(outset, 19, cur1);
 
  endShape();
  
  beginShape();
  vertex(windowWidth, windowHeight);
  vertex(windowWidth, 0);
  createSin(windowWidth-outset, 25, cur2);
  
  endShape();

  if(mainTitle){
    // textFont(font);
    // textSize(100);
    // fill(255);
    // noStroke();
    // text('Open Display', centerX, centerY);
    for (var i = 0; i < vehicles.length; i++) {
      var v = vehicles[i];
      v.behaviors();
      v.update();
      v.show();
    }
  }

  if(title){
    for (var i = 0; i < vehicles.length; i++) {
      var v = vehicles[i];
      v.behaviors();
      v.update();
      v.show();
    }
  }
  


}

function createSin(Xnorm, num, cur){
  let x;
  const space = windowHeight/num;
  for (let i = 0; i <= num; i++){
    y = i * space;
    vertex(Xnorm + sin(cur + y) * 20,y);
  }
}

function Vehicle(x, y) {
  this.pos = createVector(random(width), random(height));
  this.target = createVector(x, y);
  this.curX = x;
  this.curY = y;
  this.vel = p5.Vector.random2D();
  this.acc = createVector();
  this.r = 5;
  this.maxspeed = 10;
  this.maxforce = 1;
}

//This function was not created by Dan Shiffman
Vehicle.prototype.changeTarget = function(x,y){
  this.target = createVector(x, y);
}


Vehicle.prototype.behaviors = function() {
var arrive = this.arrive(this.target);
var mouse = createVector(mouseX, mouseY);
var flee = this.flee(mouse);

arrive.mult(1);
flee.mult(5);

this.applyForce(arrive);
this.applyForce(flee);
}

Vehicle.prototype.applyForce = function(f) {
this.acc.add(f);
}

Vehicle.prototype.update = function() {
this.pos.add(this.vel);
this.vel.add(this.acc);
this.acc.mult(0);
}

Vehicle.prototype.show = function() {
stroke(255);
strokeWeight(this.r);
point(this.pos.x, this.pos.y);
}


Vehicle.prototype.arrive = function(target) {
  var desired = p5.Vector.sub(target, this.pos);
  var d = desired.mag();
  var speed = this.maxspeed;
  if (d < 100) {
    speed = map(d, 0, 100, 0, this.maxspeed);
  }
  desired.setMag(speed);
  var steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxforce);
  return steer;
}

Vehicle.prototype.flee = function(target) {
  var desired = p5.Vector.sub(target, this.pos);
  var d = desired.mag();
  if (d < 50) {
    desired.setMag(this.maxspeed);
    desired.mult(-1);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}