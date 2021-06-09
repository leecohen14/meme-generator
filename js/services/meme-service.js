'use strict'
var gKeyWords = { 'happy': 12, 'funny': 1 };
var gId = 18;
var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['happy'] },
    { id: 2, url: 'img/2.jpg', keywords: ['happy'] },
    { id: 3, url: 'img/3.jpg', keywords: ['happy'] },
    { id: 4, url: 'img/4.jpg', keywords: ['happy'] },
    { id: 5, url: 'img/5.jpg', keywords: ['happy'] },
    { id: 6, url: 'img/6.jpg', keywords: ['happy'] },
    { id: 7, url: 'img/7.jpg', keywords: ['happy'] },
    { id: 8, url: 'img/8.jpg', keywords: ['happy'] },
    { id: 9, url: 'img/9.jpg', keywords: ['happy'] },
    { id: 10, url: 'img/10.jpg', keywords: ['happy'] },
    { id: 11, url: 'img/11.jpg', keywords: ['happy'] },
    { id: 12, url: 'img/12.jpg', keywords: ['happy'] },
    { id: 13, url: 'img/13.jpg', keywords: ['happy'] },
    { id: 14, url: 'img/14.jpg', keywords: ['happy'] },
    { id: 15, url: 'img/15.jpg', keywords: ['happy'] },
    { id: 16, url: 'img/16.jpg', keywords: ['happy'] },
    { id: 17, url: 'img/17.jpg', keywords: ['happy'] },
    { id: 18, url: 'img/18.jpg', keywords: ['happy'] }
];
var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,

    lines: [{
            txt: 'first line',
            size: 30,
            align: 'left',
            color: 'red',
            textWidth: 0,
            y: 40
        }, {
            txt: 'second line',
            size: 30,
            align: 'left',
            color: 'red',
            textWidth: 0,
            y: 160
        },
        {
            txt: 'third line',
            size: 30,
            align: 'left',
            color: 'red',
            textWidth: 0,
            y: 300
        }
    ]
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
            // drawText();
        drawAllLines();
        setInputFirstValue();
    }
}

function drawText() {
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

function drawAllLines() {
    //run over all lines
    //do draw text
    gMeme.lines.forEach(() => {
        drawText();
        if (gMeme.selectedLineIdx + 1 < gMeme.lines.length) {
            gMeme.selectedLineIdx++;
        } else {
            gMeme.selectedLineIdx = 0;
        }
    })
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

function switchLine() {
    console.log('line switched');
    var linesLength = gMeme.lines.length;
    gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1 === linesLength) ? 0 : gMeme.selectedLineIdx + 1;
    drawImg();
}