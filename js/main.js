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
            strHtml += `<img src="${img.url}" alt="" onclick="onSetImg(${img.id}),mainToggle()">`;
        })
        // console.log('strHtml :>> ', strHtml);
    elGallery.innerHTML = strHtml;
}

function mainToggle() {
    toggleGallery()
    toggleEditor()
}

function toggleGallery() {
    var elGallery = document.querySelector('.gallery-container');
    elGallery.style.display = (elGallery.style.display === 'none') ? 'grid' : 'none';
}

function toggleEditor() {
    var elEditor = document.querySelector('.meme-editor');
    elEditor.style.display = (elEditor.style.display === 'none') ? 'flex' : 'none';
}

function downloadCanvas(elLink) {
    const data = gElCanvas.toDataURL()
    console.log('DATA', data);
    elLink.href = data
    elLink.download = 'puki'
}

function saveCanvas() {
    saveCanvasToStorage()
}