'use strict'
console.log('work');



function init() {
    renderGalleryImgs();
    gElCanvas = document.getElementById('my-canvas')
    gCtx = gElCanvas.getContext('2d')
        // resizeCanvas()
    drawImg();
    // renderCanvas();
    // gElCanvas.textAlign = "center";
}

function onSetImg(id) {
    setImg(id);
}

function setInputFirstValue() {
    var elInput = document.querySelector('input');
    elInput.value = gMeme.lines[gMeme.selectedLineIdx].txt;
}

function renderGalleryImgs() {
    //run all over the gImgs
    // inject img tags with all imgs
    var elGallery = document.querySelector('.gallery-container');
    var strHtml = '';
    gImgs.forEach((img) => {
            // ` <img src="${img.url}" alt="" onclick="onSetImg(1)"> `;
            strHtml += `<img src="${img.url}" alt="" onclick="onSetImg(1)">`;
        })
        // console.log('strHtml :>> ', strHtml);
    elGallery.innerHTML = strHtml;
}