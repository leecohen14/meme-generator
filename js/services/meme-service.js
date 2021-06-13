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
    { id: 18, name: '1', url: 'img/18.jpg', keywords: ['happy'] },
    { id: 19, name: '1', url: 'img/19.jpg', keywords: ['happy'] },
    { id: 20, name: '1', url: 'img/20.jpg', keywords: ['happy'] }
];
var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,

    lines: [{
        txt: '',
        size: 30,
        align: '',
        color: 'white',
        stroke: 'black',
        textWidth: 0,
        x: 0,
        y: 40,
        font: 'IMPACT',
        isDrag: false,
        everDragged: false
    }]
}
var gMemes = [];
var gGrabbedLine = '';

var gCurrLine = gMeme.lines[0];
var gSaveMode = false;

function drawLineBgc() {
    if (!gCurrLine) return;
    // console.log('gCurrLine :>> ', gCurrLine);
    var gCurrLineY = gCurrLine.y
    gCtx.beginPath()
    gCtx.rect(0, gCurrLineY - (gCurrLine.size * 0.8) - 4, gElCanvas.width, gCurrLine.size + 2)
    gCtx.fillStyle = '#d8cfc56b';
    gCtx.fillRect(0, gCurrLineY - (gCurrLine.size * 0.8) - 4, gElCanvas.width, gCurrLine.size + 2)
    gCtx.strokeStyle = 'black'
    gCtx.stroke()
}

function drawText() {
    if (gMeme.lines.length === 0) return;
    gCurrLine = gMeme.lines[gMeme.selectedLineIdx];
    gCtx.lineWidth = 2
    gCtx.strokeStyle = gCurrLine.stroke;
    gCtx.fillStyle = gCurrLine.color;
    var gCurrLineSize = gCurrLine.size;
    gCtx.font = `${gCurrLineSize}px ${gCurrLine.font}`;
    var gCurrLineText = gCurrLine.txt;
    gCurrLine.textWidth = gCtx.measureText(gCurrLineText).width;
    var gTextWidth = gCurrLine.textWidth;
    var gCurrLineY = gCurrLine.y;

    if (!gCurrLine.everDragged) {
        if (gCurrLine.align !== '') {
            alignText();
        } else gCurrLine.x = ((gElCanvas.width - gTextWidth) / 2); // update model
    }
    var gCurrLineX = gCurrLine.x;

    gCtx.fillText(gCurrLineText, gCurrLineX, gCurrLineY)
    gCtx.strokeText(gCurrLineText, gCurrLineX, gCurrLineY)
}

function drawAllLines() {

    if (!gSaveMode && !gDownloadMode) drawLineBgc();

    gMeme.lines.forEach(() => {
        drawText();
        if (gMeme.selectedLineIdx + 1 < gMeme.lines.length) {
            gMeme.selectedLineIdx++;
        } else {
            gMeme.selectedLineIdx = 0;
        }
    })
}

function cleanInput() {
    var elInput = document.querySelector('#line-text');
    elInput.value = '';
}

function updateLineText(el) {

    if (gMeme.lines.length === 0) { // if has no lines!
        cleanInput();
        alert('please add line!')
        return;
    }
    var text = el.value;
    gCurrLine.txt = text;
    renderCanvas();
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function setImg(id) {
    gMeme.selectedImgId = id;
}

function increaseText() {
    gMeme.lines[gMeme.selectedLineIdx].size += 5;
    renderCanvas();
}

function decreaseText() {
    gMeme.lines[gMeme.selectedLineIdx].size -= 5;
    renderCanvas();
}

function lineUp() {
    gMeme.lines[gMeme.selectedLineIdx].y -= 5;
    renderCanvas();

}

function lineDown() {
    gMeme.lines[gMeme.selectedLineIdx].y += 5;
    renderCanvas();
}

function switchLine() {
    var linesLength = gMeme.lines.length;
    if (linesLength === 1) {
        alert('no more lines, add line on + button!');
        return;
    }
    console.log('line switched');
    gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1 === linesLength) ? 0 : gMeme.selectedLineIdx + 1;
    //set grabbed line 
    // gGrabbedLine = gMeme.lines[gMeme.selectedLineIdx];
    renderCanvas();

}

//save canvas to storage
function saveCanvasToStorage() {
    const data = gElCanvas.toDataURL();
    var meme = {
        id: `${_makeId()}`,
        data,
        meme: _.cloneDeep(gMeme) //make deep copy
    }
    gMemes.unshift(meme);
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

function setLineDrag(isDrag) {
    if (!gGrabbedLine) return;
    gGrabbedLine.isDrag = isDrag;
}

function moveLine(dx, dy) {
    gGrabbedLine.x += dx
    gGrabbedLine.y += dy

}

function setEverDragged() {
    gGrabbedLine.everDragged = true;
}

// search filter

function getImages() {
    var regex = new RegExp(gFilterBy.txt, 'i');
    var images = gImgs.filter(img => {
        return regex.test(img.name);
    })
    return images
}

function setFilter(filterBy) {
    gFilterBy = filterBy;
}

// color

function updateColor(color) {
    gCurrLine.color = color
}

function updateStroke(color) {
    gCurrLine.stroke = color
}

//add new line

function addNewLine() {
    var line = {
        txt: '',
        size: 30,
        align: '',
        color: 'white',
        stroke: 'black',
        textWidth: 0,
        x: 0,
        y: 160,
        font: 'IMPACT',
        isDrag: false,
        everDragged: false
    }
    if (gMeme.lines.length === 1) line.y = 300;
    gMeme.lines.push(line);
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
    gCurrLine = gMeme.lines[gMeme.selectedLineIdx];
    setInputFirstValue();
}

//delete line
function deleteLine() {
    var idx = gMeme.selectedLineIdx;
    gMeme.lines.splice(idx, 1);
    if (gMeme.selectedLineIdx > 0) gMeme.selectedLineIdx--;

    gCurrLine = gMeme.lines[gMeme.selectedLineIdx]
}

// font
function changeFont(font) {
    gCurrLine.font = font;
}

//edit meme
function editMeme(id) {
    var meme = gMemes.find(meme => {
        return meme.id === id;
    });
    gMeme = _.cloneDeep(meme.meme);
    gCurrLine = gMeme.lines[0];
}
// make id
function _makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function cleanGMeme() {
    var meme = {
        selectedImgId: 1,
        selectedLineIdx: 0,

        lines: [{
            txt: '',
            size: 30,
            align: '',
            color: 'white',
            stroke: 'black',
            textWidth: 0,
            x: 0,
            y: 40,
            font: 'IMPACT',
            isDrag: false,
            everDragged: false
        }]
    };
    gMeme = _.cloneDeep(meme);
}

//alignment

function alignText() {
    switch (gCurrLine.align) {
        case 'left':
            gCurrLine.x = 3;
            break;
        case 'right':
            gCurrLine.x = gElCanvas.width - gCurrLine.textWidth - 3;
            break;
        case 'center':
            gCurrLine.x = ((gElCanvas.width - gCurrLine.textWidth) / 2);
            break;
    }
}

function deleteMeme(memeId) {
    var idx = gMemes.findIndex((meme) => {
        return (meme.id === memeId)
    })
    gMemes.splice(idx, 1);
    saveToStorage('memes', gMemes);
}