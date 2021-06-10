'use strict'
console.log('work');
var gElCanvas;
var gCtx;
var gStartPos;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];


function init() {
    renderGalleryImgs();
    gElCanvas = document.getElementById('my-canvas')
    gCtx = gElCanvas.getContext('2d')
        // resizeCanvas()
    drawImg();
    addListeners();
    renderMemes();
    // renderCanvas();
    // gElCanvas.textAlign = "center";
}

function onSetImg(id) {
    setImg(id);
}

function setInputFirstValue() {
    var elInput = document.querySelector('input');
    if (gMeme.lines.length === 0) return;
    elInput.value = gMeme.lines[gMeme.selectedLineIdx].txt;
}

function renderGalleryImgs() {
    //run all over the gImgs
    // inject img tags with all imgs

    var images = getImages();
    var elGallery = document.querySelector('.gallery');
    var strHtml = '';
    images.forEach((img) => {
            // ` <img src="${img.url}" alt="" onclick="onSetImg(1)"> `;
            strHtml += `<img src="${img.url}" alt="" onclick="onSetImg(${img.id}),showEditor()">`;
        })
        // console.log('strHtml :>> ', strHtml);
    elGallery.innerHTML = strHtml;
}

function hideGallery() {
    hideEditor();
    var elGallery = document.querySelector('.gallery-container');
    elGallery.style.display = 'none';
}

function showGallery() {
    var elGallery = document.querySelector('.gallery-container');
    elGallery.style.display = 'grid';
    hideEditor();
}

function showEditor() {
    hideGallery();
    var elEditor = document.querySelector('.meme-editor');
    elEditor.style.display = 'flex';
}

function hideEditor() {
    var elEditor = document.querySelector('.meme-editor');
    elEditor.style.display = 'none';
}

function showMemes() {
    hideEditor();
    hideGallery();
    var elMemes = document.querySelector('.memes-container');
    elMemes.style.display = 'block';
}

function hideMemes() {
    var elMemes = document.querySelector('.memes-container');
    elMemes.style.display = 'none';
}

function downloadCanvas(elLink) {
    const data = gElCanvas.toDataURL()
    console.log('DATA', data);
    elLink.href = data
    elLink.download = 'puki'
}

function saveCanvas() {
    saveCanvasToStorage();
    renderMemes();
}

function renderMemes() {
    updateGMemes();
    var strHtml = ``;
    if (!gMemes) return;
    gMemes.forEach(memeUrl => {
        strHtml += ` <img src="${memeUrl}" alt="a" height="200" width="200"> `;
    })
    var elMemes = document.querySelector('.memes-container');
    elMemes.innerHTML = strHtml;
}

function toggleMenu() {
    if (document.documentElement.clientWidth > 750) return; // to not toggle screen on mobile mode
    document.body.classList.toggle('menu-open');
}

function closeScreen() {
    var elScreen = document.querySelector('.main-screen');
    elScreen.style.opacity = '0';
}
//drag and drop


function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove, { passive: true });
    gElCanvas.addEventListener('touchstart', onDown, { passive: true })
    gElCanvas.addEventListener('touchend', onUp)
}

function addListeners() {
    addMouseListeners();
    addTouchListeners();
}

function onDown(ev) {
    const pos = getEvPos(ev)
    if (!isLineClicked(pos)) return
    setLineDrag(true)
    setEverDragged();
    gStartPos = pos
    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
    const line = gGrabbedLine;
    if (!gGrabbedLine) return;
    if (line.isDrag) {
        const pos = getEvPos(ev)
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
            // console.log('dx :>> ', dx);
            // console.log('dy :>> ', dy);
        moveLine(dx, dy)
        gStartPos = pos
            // renderCanvas();
            // drawAllLines();
        drawImg();
    }
}

function onUp() {
    setLineDrag(false)
    document.body.style.cursor = 'grab';
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos;
}

//filter

function onSetFilter(txt) {
    console.log('set');
    setFilter({ txt: txt })
    renderGalleryImgs();
}

//color
function onUpdateColor(el) {
    updateColor(el.value);
    drawImg();
}

function onUpdateStroke(el) {
    updateStroke(el.value);
    drawImg();
}

// add new line
function onAddNewLine() {
    addNewLine();
}

//delete line
function onDeleteLine() {
    deleteLine();
    drawImg();
}