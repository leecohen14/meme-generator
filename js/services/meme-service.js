'use strict'
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

function drawImg() {
    var img = new Image()
    var currImgId = gMeme.selectedImgId;
    img.src = `img/${currImgId}.jpg`;
    img.onload = () => {
        clearCanvas();
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        drawText();
    }
}

function drawText(x = 40, y = 40) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = 'white'
    gCtx.font = '40px IMPACT'
        // gCtx.textAlign = 'center'
    var gCurrLineText = gMeme.lines[gMeme.selectedLineIdx].txt;
    var textWidth = gCtx.measureText(gCurrLineText).width

    gCtx.fillText(gCurrLineText, (gElCanvas.width - textWidth) / 2, y)
    gCtx.strokeText(gCurrLineText, (gElCanvas.width - textWidth) / 2, y)
    console.log('gCurrLineText.neasureText() :>> ');
}

function updateLineText(el) {
    var text = el.value;
    console.log('text :>> ', text);
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