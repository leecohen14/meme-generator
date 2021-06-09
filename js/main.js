'use strict'
console.log('work');



function init() {
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