'use strict'
console.log('work');
var gKeyWords = { 'happy': 12, 'funny': 1 };
var gId = 1;
var gImgs = [{ id: gId++, url: 'img/1.jpg', keywords: ['happy'] }];
var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,

    lines: [{
        txt: 'I never eat Falafel',
        size: 20,
        align: 'left',
        color: 'red'
    }]
}
var gElCanvas;
var gCtx;

function init() {
    gElCanvas = document.getElementById('my-canvas')
    gCtx = gElCanvas.getContext('2d')
        // resizeCanvas()
    drawImg();
}

function drawImg() {
    var img = new Image()
    var currImgId = gMeme.selectedImgId;
    img.src = `img/${currImgId}.jpg`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
    }
}