/*
  Data and machine learning for creative practice
  Portfolio Project 3
  Matt Jones
  
  Program takes video (dance.mp4) and detects the skeleton of the dancer, 
  it then draws white circles at the skeleton key points. 
  
  It works using multiple layers, 
    the video - which is not shown, 
    the skeleton - which is drawn over the video, 
    the backgorund layer, 
    the white keypoints
  
  as the dance loops through the video, it slowly cuts out an image of the total movement of the dancer.
  
*/

let poseNet,
    poses = [];
let vid;
let playing=true;
let pg;



function setup() {
  createCanvas(640, 480);
  
    video = createVideo("dance.mp4",cameraReady);
    video.size(640,480);
    video.volume(0);
    video.speed(0.75);
    video.loop();
  
    pixelDensity(1);
    pg = createGraphics(width, height);
}

function cameraReady(stream) {
  // Create a new poseNet method with a single detection
    poseNet = ml5.poseNet(video, modelReady);
  
  // .on() is an event listener
    poseNet.on('pose', detectedPose);
  
  // Hide the video element, and just show the canvas
    video.hide();
}

function detectedPose(results) {
  // we store the pose in the poses global variable
    poses = results;
}

function modelReady() {
    console.log("Model ready");
}

function draw() {
    let img = video.get();
    
    image(img, 0, 0);
    background(77);
  
    image(pg, 0, 0, width, height);


  // We can call both functions to draw all keypoints and the skeletons
    drawKeypoints();
    drawSkeleton();
    
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  console.log(poses);
  for (let this_pose of poses) {
    let pose = this_pose.pose;
    
    for (let keypoint of pose.keypoints) {
      // if we are confident of keypoint we draw it
      if (keypoint.score > 0.75) {
        pg.fill(255);
        pg.noStroke();
        // Draws white ellipse at keypoint position
        pg.ellipse(keypoint.position.x, keypoint.position.y, 15, 15);
        
      }
    }
    
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let this_pose of poses) {
    let skeleton = this_pose.skeleton;
    
    for (let parts of skeleton) {
      let partA = parts[0];
      let partB = parts[1];
      stroke(77);
      strokeWeight(10);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}