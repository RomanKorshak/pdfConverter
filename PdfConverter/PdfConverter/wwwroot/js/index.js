"use strict";


let convertButton = document.querySelector('#convert-button');
let dropZone = document.querySelector(".upload-container");
let sendButton = document.querySelector("#send-button");


dropZone.ondrag = (event) => event.preventDefault();
dropZone.ondragstart = (event) => event.preventDefault();
dropZone.ondragend = (event) => event.preventDefault();
dropZone.ondragover = (event) => event.preventDefault();
dropZone.ondragenter = (event) => event.preventDefault();
dropZone.ondragleave = (event) => event.preventDefault();
dropZone.ondrop = (event) => event.preventDefault();

dropZone.ondragover = function () { dropZone.classList.add("dragover"); return false; }
dropZone.ondragenter = function () { dropZone.classList.add("dragover"); return false; }
dropZone.ondragleave = function () { dropZone.classList.remove("dragover"); return false; }

let images = [];

convertButton.addEventListener('click', (event) => {
    sendData(images, "image/jpeg");
});

dropZone.ondrop = function (event) {
    dropZone.classList.remove("dragover");
    let files = event.dataTransfer.files;

    if (files != undefined) {
        for (let file of files) {
            images.push(file);
        }
    }

    let image_list = document.querySelector("#image-list");

    for (let file of files) {
        let img = document.createElement("img");
        img.src = window.URL.createObjectURL(file);
        img.classList.add("custom-image");

        image_list.append(img);
    }

    event.preventDefault();
}

async function sendData(files, contentType) {

    let formData = new FormData();

    for (let file of files) {
        formData.append('files', file);
    }

    let response = await fetch('upload', {
        method: 'post',
        body: formData
    });

    if (response.status == 200) {
        window.location.href = "download";
    }
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


