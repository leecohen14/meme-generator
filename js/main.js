'use strict'
console.log('work');
var gElCanvas;
var gCtx;
var gStartPos;
var gElLink;
var gDownloadMode = false;
var gFilterBy = {
    txt: '',
}
const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];


function init() {
    renderGalleryImgs();
    createCanvas();
    addListeners();
    // resizeCanvas()
    renderCanvas();
    renderMemes();
}

function renderCanvas(renderCanvasForSave, renderCanvasForDownload) {
    var img = new Image()
    var currImgId = gMeme.selectedImgId;
    // img.src = `img/${currImgId}.jpg`;
    img.src = gImgs.find((img) => {
        return img.id === currImgId;
    }).url;
    img.onload = () => {
        clearCanvas();
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
            // drawAllLinesBg();
        drawAllLines();
        setInputFirstValue();
        if (gSaveMode) renderCanvasForSave();
        if (gDownloadMode) renderCanvasForDownload();
    }
}

function createCanvas() {
    gElCanvas = document.getElementById('my-canvas')
    gCtx = gElCanvas.getContext('2d')
}

function onSetImg(id) {
    setImg(id);
    renderCanvas();
}

function setInputFirstValue() {
    gCurrLine = gMeme.lines[gMeme.selectedLineIdx];
    var elInput = document.querySelector('#line-text');
    if (gMeme.lines.length === 0) return;
    elInput.value = gCurrLine.txt;
}

function renderGalleryImgs() {
    var images = getImages();
    var elGallery = document.querySelector('.gallery');
    var strHtml = '';
    images.forEach((img) => {
        strHtml += `<img src="${img.url}" alt="" onclick="onSetImg(${img.id}),showEditor()">`;
    })
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
    cleanGMeme();
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
    elMemes.style.display = 'grid';
}

function hideMemes() {
    var elMemes = document.querySelector('.memes-container');
    elMemes.style.display = 'none';
}

function downloadCanvas(elLink) {
    gDownloadMode = true;
    gElLink = elLink;
    renderCanvas(renderCanvasForSave, renderCanvasForDownload);

}

function renderCanvasForDownload() {
    const data = gElCanvas.toDataURL()
    var elLink = document.querySelector('.download-link');
    elLink.href = data
    elLink.download = 'puki'
    gDownloadMode = false;


}

function saveCanvas() {
    gSaveMode = true;
    renderCanvas(renderCanvasForSave);
}

function renderCanvasForSave() {
    saveCanvasToStorage();
    renderMemes();
    showMemes();
    hideEditor();
    cleanInput();
    gSaveMode = false;
}

function renderMemes() {
    updateGMemes();
    var strHtml = ``;
    if (!gMemes) return;
    gMemes.forEach(meme => {
        strHtml += ` <div class="meme-container">    
        <button class="btn delete-meme" onclick="onDeleteMeme('${meme.id}')">X</button>
        <img class="meme" src="${meme.data}" alt="a" onclick="onEditMeme('${meme.id}'), showEditor(), hideMemes() " height="200" width="200">
        </div>
        `;
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
    gElCanvas.addEventListener('touchmove', onMove /*,{ passive: true}*/ );
    gElCanvas.addEventListener('touchstart', onDown /*,{ passive: true}*/ )
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
        moveLine(dx, dy)
        gStartPos = pos
        renderCanvas();
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
    setFilter({ txt: txt })
    renderGalleryImgs();
}

//color
function onUpdateColor(el) {
    updateColor(el.value);
    renderCanvas();
}

function onUpdateStroke(el) {
    updateStroke(el.value);
    renderCanvas();
}

// add new line
function onAddNewLine() {
    addNewLine();
    renderCanvas();
    setInputFirstValue();
}

//delete line
function onDeleteLine() {
    deleteLine();
    cleanInput();
    renderCanvas();
}

function onChangeFont(el) {
    var font = el.value;
    changeFont(font);
    renderCanvas();
}


//edit meme
function onEditMeme(id) {
    editMeme(id);
    renderCanvas();

}

//alignments
function onAlignText(alignTo) {
    gCurrLine.align = alignTo;
    alignText();
    renderCanvas();
}

//delete meme
function onDeleteMeme(memeId) {
    deleteMeme(memeId);
    renderMemes();
}

//choce file

function renderImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
}

function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}

function loadImageFromInput(ev, onImageReady) {
    // document.querySelector('.share-container').innerHTML = ''
    var reader = new FileReader()

    reader.onload = function(event) {
        var img = new Image()
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result
        gImgs.push({ id: _makeId(), name: 'aviv2', url: img.src, keywords: ['happy'] },

        )
        gMeme.selectedImgId = gImgs[gImgs.length - 1].id;
        clearCanvas();
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
            // drawAllLinesBg();
        drawAllLines();
        setInputFirstValue();
        if (gSaveMode) renderCanvasForSave();
        if (gDownloadMode) renderCanvasForDownload();
        showEditor();
    }

    reader.readAsDataURL(ev.target.files[0])
}