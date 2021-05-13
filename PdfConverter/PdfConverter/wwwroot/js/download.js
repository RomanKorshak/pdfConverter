"use strict";

// control preloader
window.onload = (event) => {
    setTimeout(() => document.querySelector('#preloader-field').hidden = true,
        5 * 1000);
}

// preloader animation
const preloaderTL = new TimelineMax({});

let boxes = document.querySelectorAll('.square-box'),
    xMin = 20,
    xMax = 400,
    yMin = 200,
    yMax = 250,
    randomX, labelTime, $currentFill,
    timeline = {};

boxes.forEach(function (element, index) {
    if ((index % 2) == 0) {
        randomX = randomInt(-xMax, -xMin);
    }
    else {
        randomX = randomInt(xMin, xMax);
    }

    const boxes = document.querySelectorAll('.square-box');
    labelTime = index * 0.75;
    $currentFill = boxes[index].querySelector('.square-fill');

    timeline["sven-" + index] = new TimelineMax({
        repeat: -1,
        repeatDelay: 0.75,
        yoyo: false
    });

    timeline["sven-" + index].from($currentFill, 0.75, {
        backgroundColor: "transparent"
    });

    timeline["sven-" + index].from(boxes[index], 3, {
        rotation: 720,
        opacity: 0,
        x: randomX + "px",
        y: randomInt(-yMax, -yMin) + "px",
        ease: Linear.easeNone
    });

    timeline["sven-" + index].to($currentFill, 0.25, {
        y: "104%",
        ease: Linear.easeNone
    });

    preloaderTL.add(timeline["sven-" + index], labelTime);
});

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomFloat(min, max) {
    return (Math.random() * (max - min) + min).toFixed(1);
}

const downloadButton = document.querySelector('.button');
const backIcon = document.querySelector('.back-icon');


const uri = window.location.pathname.split('/')[2];
downloadButton.addEventListener('click', async (event) => {
    const a = document.createElement('a');
    a.href = window.location.href + '/getpdf';
    a.download = "file.pdf";

    a.click();
});

backIcon.addEventListener('click', (event) => {
    window.location.href = '/';
});
