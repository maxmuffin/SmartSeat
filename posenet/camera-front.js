/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import * as posenet from '@tensorflow-models/posenet';
import dat from 'dat.gui';
import Stats from 'stats.js';

import {drawBoundingBox, drawKeypoints, drawSkeleton} from './demo_util';

const videoWidth = 600;
const videoHeight = 500;
const stats = new Stats();
const uuidv4 = require('uuid/v4');
var moment = require('moment');
var save = false;
var savedData = "yRightShoulder,yLeftShoulder,xRightKnee,yRightKnee,yLeftKnee,xLeftKnee,xLeftAnkle,yLeftAnkle,xRightAnkle,yRightAnkle,Correct,Timestamp\r\n";

function isAndroid() {
    return /Android/i.test(navigator.userAgent);
}

function isiOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMobile() {
    return isAndroid() || isiOS();
}

function download(strData, strFileName, strMimeType) {
    var D = document,
        A = arguments,
        a = D.createElement("a"),
        d = A[0],
        n = A[1],
        t = A[2] || "text/plain";

    //build download link:
    a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);


    if (window.MSBlobBuilder) { // IE10
        var bb = new MSBlobBuilder();
        bb.append(strData);
        return navigator.msSaveBlob(bb, strFileName);
    } /* end if(window.MSBlobBuilder) */


    if ('download' in a) { //FF20, CH19
        a.setAttribute("download", n);
        a.innerHTML = "downloading...";
        D.body.appendChild(a);
        setTimeout(function () {
            var e = D.createEvent("MouseEvents");
            e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
            D.body.removeChild(a);
        }, 66);
        return true;
    }
    ; /* end if('download' in a) */


    //do iframe dataURL download: (older W3)
    var f = D.createElement("iframe");
    D.body.appendChild(f);
    f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
    setTimeout(function () {
        D.body.removeChild(f);
    }, 333);
    return true;
}

function saveButton() {
    if (save === false) {
        document.getElementById("button").textContent = "STOP";
        save = true;
    } else {
        let filename = 'FRONT-' + uuidv4() + '.txt';
        console.log(filename);
        download(savedData, filename, 'text/plain');
        savedData = "yRightShoulder,yLeftShoulder,xRightKnee,yRightKnee,yLeftKnee,xLeftKnee,xLeftAnkle,yLeftAnkle,xRightAnkle,yRightAnkle\n";
        document.getElementById("button").textContent = "START";
        save = false;
    }
}

$("button").on("click", function () {
    saveButton()
});

/**
 * Loads a the camera to be used in the demo
 *
 */
async function setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
            'Browser API navigator.mediaDevices.getUserMedia not available');
    }

    const video = document.getElementById('video');
    video.width = videoWidth;
    video.height = videoHeight;

    const mobile = isMobile();
    const stream = await navigator.mediaDevices.getUserMedia({
        'audio': false,
        'video': {
            facingMode: 'user',
            width: mobile ? undefined : videoWidth,
            height: mobile ? undefined : videoHeight,
        },
    });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function loadVideo() {
    const video = await setupCamera();
    video.play();

    return video;
}

const guiState = {
    algorithm: 'single-pose',
    input: {
        mobileNetArchitecture: isMobile() ? '0.50' : '1.00',
        outputStride: 16,
        imageScaleFactor: 0.5,
    },
    singlePoseDetection: {
        minPoseConfidence: 0.3,
        minPartConfidence: 0.5,
    },
    output: {
        showVideo: true,
        showSkeleton: true,
        showPoints: true,
        showBoundingBox: false,
    },
    net: null,
};

/**
 * Sets up dat.gui controller on the top-right of the window
 */
function setupGui(cameras, net) {
    guiState.net = net;

    if (cameras.length > 0) {
        guiState.camera = cameras[0].deviceId;
    }

    const gui = new dat.GUI({width: 300});

    // The single-pose algorithm is faster and simpler but requires only one
    // person to be in the frame or results will be innaccurate. Multi-pose works
    // for more than 1 person

    // The input parameters have the most effect on accuracy and speed of the
    // network
    let input = gui.addFolder('Input');
    // Architecture: there are a few PoseNet models varying in size and
    // accuracy. 1.01 is the largest, but will be the slowest. 0.50 is the
    // fastest, but least accurate.
    const architectureController = input.add(
        guiState.input, 'mobileNetArchitecture',
        ['1.01', '1.00', '0.75', '0.50']);
    // Output stride:  Internally, this parameter affects the height and width of
    // the layers in the neural network. The lower the value of the output stride
    // the higher the accuracy but slower the speed, the higher the value the
    // faster the speed but lower the accuracy.
    input.add(guiState.input, 'outputStride', [8, 16, 32]);
    // Image scale factor: What to scale the image by before feeding it through
    // the network.
    input.add(guiState.input, 'imageScaleFactor').min(0.2).max(1.0);
    input.open();

    // Pose confidence: the overall confidence in the estimation of a person's
    // pose (i.e. a person detected in a frame)
    // Min part confidence: the confidence that a particular estimated keypoint
    // position is accurate (i.e. the elbow's position)
    let single = gui.addFolder('Single Pose Detection');
    single.add(guiState.singlePoseDetection, 'minPoseConfidence', 0.0, 1.0);
    single.add(guiState.singlePoseDetection, 'minPartConfidence', 0.0, 1.0);
    single.open();

    let output = gui.addFolder('Output');
    output.add(guiState.output, 'showVideo');
    output.add(guiState.output, 'showSkeleton');
    output.add(guiState.output, 'showPoints');
    output.add(guiState.output, 'showBoundingBox');
    output.open();


    architectureController.onChange(function (architecture) {
        guiState.changeToArchitecture = architecture;
    });
}

/**
 * Sets up a frames per second panel on the top-left of the window
 */
function setupFPS() {
    stats.showPanel(0);  // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
}

/**
 * Feeds an image to posenet to estimate poses - this is where the magic
 * happens. This function loops with a requestAnimationFrame method.
 */
function detectPoseInRealTime(video, net) {
    const canvas = document.getElementById('output');
    const ctx = canvas.getContext('2d');
    // since images are being fed from a webcam
    const flipHorizontal = true;

    canvas.width = videoWidth;
    canvas.height = videoHeight;

    async function poseDetectionFrame() {
        if (guiState.changeToArchitecture) {
            // Important to purge variables and free up GPU memory
            guiState.net.dispose();

            // Load the PoseNet model weights for either the 0.50, 0.75, 1.00, or 1.01
            // version
            guiState.net = await posenet.load(+guiState.changeToArchitecture);

            guiState.changeToArchitecture = null;
        }

        // Begin monitoring code for frames per second
        stats.begin();

        // Scale an image down to a certain factor. Too large of an image will slow
        // down the GPU
        const imageScaleFactor = guiState.input.imageScaleFactor;
        const outputStride = +guiState.input.outputStride;

        let poses = [];
        let minPoseConfidence;
        let minPartConfidence;
        const pose = await guiState.net.estimateSinglePose(
            video, imageScaleFactor, flipHorizontal, outputStride);
        poses.push(pose);
        minPoseConfidence = +guiState.singlePoseDetection.minPoseConfidence;
        minPartConfidence = +guiState.singlePoseDetection.minPartConfidence;


        ctx.clearRect(0, 0, videoWidth, videoHeight);

        if (guiState.output.showVideo) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.translate(-videoWidth, 0);
            ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
            ctx.restore();
        }

        // For each pose (i.e. person) detected in an image, loop through the poses
        // and draw the resulting skeleton and keypoints if over certain confidence
        // scores
        var rightShoulder;
        var leftShoulder;
        var rightKnee;
        var leftKnee;
        var leftAnkle;
        var rightAnkle;
        poses.forEach(({score, keypoints}) => {
            if (score >= minPoseConfidence) {
                if (guiState.output.showPoints) {
                    drawKeypoints(keypoints, minPartConfidence, ctx);
                }
                if (guiState.output.showSkeleton) {
                    drawSkeleton(keypoints, minPartConfidence, ctx);
                }
                if (guiState.output.showBoundingBox) {
                    drawBoundingBox(keypoints, ctx);
                }

                rightShoulder = keypoints[5];
                leftShoulder = keypoints[6];
                leftKnee = keypoints[13];
                rightKnee = keypoints[14];
                leftAnkle = keypoints[15];
                rightAnkle = keypoints[16]
            }
        });
        if (rightShoulder != null) {

            let rangeShoulder = 16;
            let rangeKnee = 20;
            let rangeFeet = 20;
            let yRightShoulder = rightShoulder.position.y;
            let yLeftShoulder = leftShoulder.position.y;
            let xRightKnee = rightKnee.position.x;
            let yRightKnee = rightKnee.position.y;
            let yLeftKnee = leftKnee.position.y;
            let xLeftKnee = leftKnee.position.x;
            let xLeftAnkle = leftAnkle.position.x;
            let yLeftAnkle = leftAnkle.position.y;
            let xRightAnkle = rightAnkle.position.x;
            let yRightAnkle = rightAnkle.position.y;

            if (save === true) {
                savedData += ~~yRightShoulder + "," + ~~yLeftShoulder + "," + ~~xRightKnee + "," +
                    ~~yRightKnee + "," + ~~yLeftKnee + "," + ~~xLeftKnee + "," + ~~xLeftAnkle + "," +
                    ~~yLeftAnkle + "," + ~~xRightAnkle + "," + ~~yRightAnkle + ",";
            }

            document.getElementById("rightS").textContent =
                "Right Shoulder: " + ~~yRightShoulder;
            document.getElementById("leftS").textContent =
                "Left Shoulder: " + ~~yLeftShoulder;
            document.getElementById("rightK").textContent =
                "Right Knee: " + ~~yRightKnee;
            document.getElementById("leftK").textContent =
                "Left Knee: " + ~~yLeftKnee;
            document.getElementById("leftAx").textContent =
                "Left Ankle X: " + ~~xLeftAnkle;
            document.getElementById("leftAy").textContent =
                "Left Ankle Y: " + ~~yLeftAnkle;
            document.getElementById("rightAx").textContent =
                "Right Ankle X: " + ~~xRightAnkle;
            document.getElementById("rightAy").textContent =
                "Right Ankle Y: " + ~~yRightAnkle;

            //ALLINEAMENTO SPALLE
            if (yLeftShoulder - (rangeShoulder / 2) <= yRightShoulder &&
                yRightShoulder <= yLeftShoulder + (rangeShoulder / 2)) {
                document.getElementById("shoulder").style.backgroundColor = "Green";
                if (save === true) {
                    savedData += "1-";
                }
            } else {
                document.getElementById("shoulder").style.backgroundColor = "Red";
                if (save === true) {
                    savedData += "0-";
                }
            }

            //ALLINEAMENTO GINOCCHIA
            if (yLeftKnee - (rangeKnee / 2) <= yRightKnee &&
                yRightKnee <= yLeftKnee + (rangeKnee / 2)) {
                document.getElementById("knee").style.backgroundColor = "Green";
                if (save === true) {
                    savedData += "1-";
                }
            } else {
                document.getElementById("knee").style.backgroundColor = "Red";
                if (save === true) {
                    savedData += "0-";
                }
            }

            //ALLINEAMENTO PIEDE-GINOCCHIA SINISTRA
            if (xLeftAnkle - (rangeFeet / 2) <= xLeftKnee &&
                xLeftKnee <= xLeftAnkle + (rangeFeet / 2)) {
                document.getElementById("feetKneeL").style.backgroundColor = "Green";
                if (save === true) {
                    savedData += "1-";
                }
            } else {
                document.getElementById("feetKneeL").style.backgroundColor = "Red";
                if (save === true) {
                    savedData += "0-";
                }
            }

            //ALLINEAMENTO PIEDE-GINOCCHIA DESTRA
            if (xRightAnkle - (rangeFeet / 2) <= xRightKnee &&
                xRightKnee <= xRightAnkle + (rangeFeet / 2)) {
                document.getElementById("feetKneeR").style.backgroundColor = "Green";
                if (save === true) {
                    savedData += "1-";
                }
            } else {
                document.getElementById("feetKneeR").style.backgroundColor = "Red";
                if (save === true) {
                    savedData += "0-";
                }
            }

            //ALLINEAMENTO PIEDI A TERRA
            if (yRightAnkle - (rangeFeet / 2) <= yLeftAnkle &&
                yLeftAnkle <= yRightAnkle + (rangeFeet / 2)) {
                document.getElementById("feetGround").style.backgroundColor = "Green";
                if (save === true) {
                    savedData += "1,";
                }
            } else {
                document.getElementById("feetGround").style.backgroundColor = "Red";
                if (save === true) {
                    savedData += "0,";
                }
            }

            if (save === true) {
                savedData += moment().format() + "\r\n";
            }
        }

        // End monitoring code for frames per second
        stats.end();

        requestAnimationFrame(poseDetectionFrame);
    }

    poseDetectionFrame();
}

/**
 * Kicks off the demo by loading the posenet model, finding and loading
 * available camera devices, and setting off the detectPoseInRealTime function.
 */
export async function bindPage() {
    // Load the PoseNet model weights with architecture 0.75
    const net = await posenet.load(0.75);

    document.getElementById('loading').style.display = 'none';
    document.getElementById('main').style.display = 'block';

    let video;

    try {
        video = await loadVideo();
    } catch (e) {
        let info = document.getElementById('info');
        info.textContent = 'this browser does not support video capture,' +
            'or this device does not have a camera';
        info.style.display = 'block';
        throw e;
    }

    setupGui([], net);
    setupFPS();
    detectPoseInRealTime(video, net);
}

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// kick off the demo
bindPage();
