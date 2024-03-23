'use strict'

var gElCanvas
var gCtx
let gStartPos = getMeme().lines[getMeme().selectedLineIdx].pos
let gCircle = getMeme().lines[getMeme().selectedLineIdx].circlePos

const TOUCH_EVENTS = ['touchstart', 'touchmove', 'touchend']

function onInit() {
    initMeme()
    initGallery()
    renderMeme(false, true)
}

function initMeme() {
    initCanvas()
    initInputs()
}

function initCanvas() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    addListeners()
    // initCanvasWidth()
    // resizeCanvas()

    window.addEventListener('resize', () => {
        const isEditorHidden = document.querySelector('.editor').classList.contains('hidden')

        if (!isEditorHidden) {
            resizeCanvas()
            renderMeme()
        }
    })
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()

    // window.addEventListener('resize', () => {
    //     resizeCanvas()

    //     const center = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 }
    //     createCircle(center)

    //     renderCanvas()
    // })
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchend', onUp)
}


function initInputs() {
    const elTxtInput = document.querySelector('input[type="text"]')
    const firstLineTxt = getMeme().lines[0].txt

    const elColor = document.querySelector('input[type="color"]')
    const firstLineColor = getMeme().lines[0].color

    const svgPath = document.querySelector('path')

    elTxtInput.value = firstLineTxt
    elColor.value = firstLineColor
    svgPath.setAttribute('fill', `${firstLineColor}`)
}

function onDraw(ev) {
    const { offsetX, offsetY } = ev

    switch (gCurrShape) {
        case 'triangle':
            drawTriangle(offsetX, offsetY)
            break
        case 'rect':
            drawRect(offsetX, offsetY)
            break
        case 'text':
            drawText('Coding Academy', offsetX, offsetY)
            break
        case 'line':
            drawLine(offsetX, offsetY)
            break
    }
}

function drawText(text, x, y) {
    gCtx.beginPath()
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
    gCtx.closePath()
}

function drawRect(x, y, width, height) {
    const oldSyle = gCtx.strokeStyle

    gCtx.beginPath()
    gCtx.fillStyle = 'lightblack'
    gCtx.strokeStyle = 'lightblack'
    gCtx.setLineDash([10, 10])
    gCtx.lineWidth = 1.5
    gCtx.strokeRect(x, y, width, height)
    gCtx.closePath()
}

function drawCircle(x, y) {
    gCtx.beginPath()
    gCtx.fillStyle = 'lightblack'
    gCtx.setLineDash([])
    gCtx.arc(x, y, 6, 0, 2 * Math.PI)
    gCtx.stroke()
    gCtx.fill()
    gCtx.closePath()
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')

    gElCanvas.width = elContainer.clientWidth
}

function initCanvasWidth(elImg) {
    gElCanvas.height = elImg.height
    gElCanvas.width = elImg.width
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)

}

function coverCanvasWithImg(elImg) {
    gElCanvas.height = (elImg.naturalHeight / elImg.naturalWidth) * gElCanvas.width
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
}