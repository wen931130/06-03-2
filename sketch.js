/* MoveNet Skeleton - Steve's Makerspace (most of this code is from TensorFlow)

MoveNet is developed by TensorFlow:
https://www.tensorflow.org/hub/tutorials/movenet

*/

let video, detector, dinosaurImg;
let poses = [];

function preload() {
  dinosaurImg = loadImage("dinosaur.gif");
}

async function init() {
  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
  };
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    detectorConfig
  );
}

async function videoReady() {
  console.log("video ready");
  await getPoses();
}

async function getPoses() {
  if (detector) {
    poses = await detector.estimatePoses(video.elt, {
      maxPoses: 2,
      // flipHorizontal: true,
    });
  }
  requestAnimationFrame(getPoses);
}

async function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, videoReady);
  video.size(width, height);
  video.hide();
  await init();

  stroke(255);
  strokeWeight(5);
}

function draw() {
  image(video, 0, 0);
  drawSkeleton();
  // flip horizontal
  cam = get();
  translate(cam.width, 0);
  scale(1, -1);  //反向
  image(cam, 0, 0);

}


function drawSkeleton() {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    let leftEar = pose.keypoints[3];
    let rightEar = pose.keypoints[4];

    if (leftEar.score > 0.1) {
      push();
      textSize(40);
      text("412730748 陳玟慈", 10, 40);
      pop();
    }
    
    if (leftEar.score > 0.1 && rightEar.score > 0.1) {
      let distance = 100; // Adjust this value to increase or decrease the separation
      image(dinosaurImg, leftEar.x - distance-100, leftEar.y - 50, 50, 50);
      image(dinosaurImg, rightEar.x + distance+75, rightEar.y -25, 50, 50);
    }
  }
}

/* Points (view on left of screen = left part - when mirrored)
  0 nose
  1 left eye
  2 right eye
  3 left ear
  4 right ear
  5 left shoulder
  6 right shoulder
  7 left elbow
  8 right elbow
  9 left wrist
  10 right wrist
  11 left hip
  12 right hip
  13 left knee
  14 right knee
  15 left foot
  16 right foot
*/