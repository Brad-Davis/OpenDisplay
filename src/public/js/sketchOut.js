
let angle;
let side;
let rotBool;
let sizeChange;
let sizeUp;
let mic;
let sound = false;
let video = false;
let micLevel;
let mult;
let color1;
let color2;
let color3;
const divide = 20;
let squareDim;
let lessCraze;
let timeTillZero;

function preload(){
  color1 = document.getElementById('color1').textContent;
  color2 = document.getElementById('color2').textContent;
  color3 = document.getElementById('color3').textContent;
  const out = document.getElementById('outReactive').textContent;
  if(out === "a"){
    sound = true;
  } else if (out === "v"){
    video = true;
  } else if (out === "b"){
    sound = true;
    video = true;
  }
}

function setup() {
  mult = 100;
  if (sound){
    mic = new p5.AudioIn()
    mic.start();
  }
  if (video){
    capture = createCapture(VIDEO);
    capture.size(320, 240);
  }
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0,0);
  canvas.style('z-index', '-1');
  rectMode(CENTER);
  angle = 0;
  sizeChange = 0;
  side = 40;
  sizeUp = false;
  rotBool = true; //used internally for drawing squares and stoping rotation at certain point
  squareDim = windowWidth/divide;
}

function draw() {
  if (sound){
    sizeChange = -mic.getLevel()*mult;
    if(sizeChange > 20){
      mult -= 1;
    } else if(sizeChange < 0.5){
      mult += 0.1;
    }
  } else {
    if(sizeUp){
      sizeChange += 0.02
    } else {
      sizeChange -= 0.02;
    }
    if(sizeChange < -15 || sizeChange > 0){
      sizeUp = !sizeUp
    }
  }
  
  background(color1);
  if(rotBool){
    angle += 0.001;
  }
  
  
  drawSquares(squareDim, false, sizeChange);
}

function drawSquares(dim, rotStop, sizeChange){
  //setting up colors
  fill(color2);
  stroke(color3);

  //if rotation is going
  if(rotBool){
    c = cos(angle); 
    if(c < 0.001 && c > -0.001 && rotStop === false){
      rotBool = false;
      c = 0;
      //sync timer starts going til it starts spinning again
      timeTillSpin(10000);
      crazed = Math.random()*3;
      //coin flip if it goes crazy or not
      if (crazed > 1.5){
        crazed = 0;
      }
    }
  } else if(video){
    
  }
  
  for(let y = dim/2; y < height; y+=dim){
    for(let x = dim/2; x < width; x+=dim){
      if(rotBool){
        rotate(c);
      } else if(video){

      }else{
        x += Math.random() * crazed - crazed;
        y += Math.random() * crazed - crazed;
      }
      rect(x, y, dim+sizeChange, dim+sizeChange);
    }
  }
    
   
}

function timeTillSpin(time){
  setTimeout(function(){
    rotBool = true;
    angle += 0.001
    while(!(c < 0.001 && c > -0.001)){
      c = cos(angle);
      angle += 0.001
    }

  }, time);
}
