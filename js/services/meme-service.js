'use strict'
var gKeyWords = { 'happy': 12, 'funny': 1 };
var gId = 18;
var gImgs = [
    { id: 1, name: 'aviv', url: 'img/1.jpg', keywords: ['happy'] },
    { id: 2, name: 'puppies', url: 'img/2.jpg', keywords: ['happy'] },
    { id: 3, name: 'baby and dog', url: 'img/3.jpg', keywords: ['happy'] },
    { id: 4, name: 'cat', url: 'img/4.jpg', keywords: ['happy'] },
    { id: 5, name: 'hero boy', url: 'img/5.jpg', keywords: ['happy'] },
    { id: 6, name: '1', url: 'img/6.jpg', keywords: ['happy'] },
    { id: 7, name: '1', url: 'img/7.jpg', keywords: ['happy'] },
    { id: 8, name: '1', url: 'img/8.jpg', keywords: ['happy'] },
    { id: 9, name: '1', url: 'img/9.jpg', keywords: ['happy'] },
    { id: 10, name: '1', url: 'img/10.jpg', keywords: ['happy'] },
    { id: 11, name: '1', url: 'img/11.jpg', keywords: ['happy'] },
    { id: 12, name: '1', url: 'img/12.jpg', keywords: ['happy'] },
    { id: 13, name: '1', url: 'img/13.jpg', keywords: ['happy'] },
    { id: 14, name: '1', url: 'img/14.jpg', keywords: ['happy'] },
    { id: 15, name: '1', url: 'img/15.jpg', keywords: ['happy'] },
    { id: 16, name: '1', url: 'img/16.jpg', keywords: ['happy'] },
    { id: 17, name: '1', url: 'img/17.jpg', keywords: ['happy'] },
    { id: 18, name: '1', url: 'img/18.jpg', keywords: ['happy'] }
];
var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,

    lines: [{
            txt: '',
            size: 30,
            align: 'left',
            color: 'red',
            textWidth: 0,
            x: 0,
            y: 40,
            isDrag: false,
            everDragged: false
        }, {
            txt: '',
            size: 30,
            align: 'left',
            color: 'red',
            textWidth: 0,
            x: 0,
            y: 160,
            isDrag: false,
            everDragged: false
        },
        {
            txt: '',
            size: 30,
            align: 'left',
            color: 'red',
            textWidth: 0,
            x: 0,
            y: 300,
            isDrag: false
        }
    ]
}
var gMemes = [];
var gGrabbedLine = '';



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
    var gCurrLine = gMeme.lines[gMeme.selectedLineIdx]
    var gCurrLineSize = gCurrLine.size;
    gCtx.font = `${gCurrLineSize}px IMPACT`;
    // gCtx.textAlign = 'center'
    var gCurrLineText = gCurrLine.txt;
    gCurrLine.textWidth = gCtx.measureText(gCurrLineText).width;
    var gTextWidth = gCurrLine.textWidth;
    var gCurrLineY = gCurrLine.y;
    if (!gCurrLine.everDragged) {
        gCurrLine.x = ((gElCanvas.width - gTextWidth) / 2); // update model
    }
    var gCurrLineX = gCurrLine.x;

    gCtx.fillText(gCurrLineText, gCurrLineX, gCurrLineY)
    gCtx.strokeText(gCurrLineText, gCurrLineX, gCurrLineY)
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
    //set grabbed line 
    // gGrabbedLine = gMeme.lines[gMeme.selectedLineIdx];
    drawImg();

}

function saveCanvasToStorage() {
    const data = gElCanvas.toDataURL();
    gMemes.push(data);
    saveToStorage('memes', gMemes);
}

function updateGMemes() {
    gMemes = loadFromStorage('memes');
    if (!gMemes) gMemes = [];
}

// drag and drop

function isLineClicked(clickedPos) {
    var line = gMeme.lines.filter((line) => {
        const pos = { x: line.x, y: line.y };
        return ((pos.x + line.textWidth > clickedPos.x && clickedPos.x > pos.x) &&
            (clickedPos.y > pos.y - line.size && pos.y > clickedPos.y))
    });
    gGrabbedLine = line[0];
    return line[0];
}


//
// return ((pos.x+line.textWidth > clickedPos.x && clickedPos.x>pos.x) &&
//  (pos.y+line.size > clickedPos.y && clickedPos.y > y))
//

function setLineDrag(isDrag) {
    gGrabbedLine.isDrag = isDrag;
}

function moveLine(dx, dy) {
    gGrabbedLine.x += dx
    gGrabbedLine.y += dy

}

function setEverDragged() {
    gGrabbedLine.everDragged = true;
}