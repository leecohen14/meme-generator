'use strict'
var gKeyWords = { 'happy': 12, 'funny': 1 };
var gId = 1;
var gImgs = [{ id: gId++, url: 'img/1.jpg', keywords: ['happy'] }];
var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,

    lines: [{
        txt: 'Type here',
        size: 30,
        align: 'left',
        color: 'red',
        textWidth: 0,
        y: 40
    }]
}
var gElCanvas;
var gCtx;

function drawImg() {
    var img = new Image()
    var currImgId = gMeme.selectedImgId;
    img.src = `img/${currImgId}.jpg`;
    img.onload = () => {
        clearCanvas();
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        drawText();
        setInputFirstValue();
    }
}

function drawText(x = 40, y = 40) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = 'white'
    var gCurrLineSize = gMeme.lines[gMeme.selectedLineIdx].size;
    gCtx.font = `${gCurrLineSize}px IMPACT`;
    // gCtx.textAlign = 'center'
    var gCurrLineText = gMeme.lines[gMeme.selectedLineIdx].txt;
    gMeme.lines[gMeme.selectedLineIdx].textWidth = gCtx.measureText(gCurrLineText).width
    var gTextWidth = gMeme.lines[gMeme.selectedLineIdx].textWidth;
    var gCurrLineY = gMeme.lines[gMeme.selectedLineIdx].y;
    gCtx.fillText(gCurrLineText, (gElCanvas.width - gTextWidth) / 2, gCurrLineY)
    gCtx.strokeText(gCurrLineText, (gElCanvas.width - gTextWidth) / 2, gCurrLineY)
}

function updateLineText(el) {
    var text = el.value;
    // get the curr meme id
    gMeme.lines[gMeme.selectedLineIdx].txt = text;
    drawImg();
    // renderCanvas()
    // get into the specipied line
    //set text as the new text

}

function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
        // You may clear part of the canvas
        // gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height/4)
}

function setImg(id) {
    gMeme.selectedImgId = id;
    drawImg();
}

function increaseText() {
    gMeme.lines[gMeme.selectedLineIdx].size += 5;
    drawImg();
}

function decreaseText() {
    gMeme.lines[gMeme.selectedLineIdx].size -= 5;
    drawImg();
}

function lineUp() {
    gMeme.lines[gMeme.selectedLineIdx].y -= 5;
    drawImg();

}

function lineDown() {
    gMeme.lines[gMeme.selectedLineIdx].y += 5;
    drawImg();
}