'use strict'

var positions

function renderMeme(isLineNew = false, isInit = false, isNoRect = false, isDownload = false) {
    const gallery = document.querySelector('.gallery')
    const editor = document.querySelector('.editor')

    editor.classList.remove('hidden')
    gallery.classList.add('hidden')

    const meme = getMeme()
    const img = new Image()
    img.src = `img/meme-imgs/meme-imgs-square/${meme.selectedImgId}.jpg`

    img.addEventListener("load", () => {
        // coverCanvasWithImg(img)
        initCanvasWidth(img)
        positions = [{ x: gElCanvas.width / 2, y: 40 }, { x: gElCanvas.width / 2, y: gElCanvas.height - 40 }]
        positions.forEach((pos, idx) => updatePosition(pos, idx))
        gCtx.textAlign = 'center'
        gCtx.textBaseline = 'middle'
        renderText(isLineNew)

        if (!isNoRect) renderRect(meme.selectedLineIdx)
        if (isDownload) onDownload()
    })
}
function renderText(isLineNew = false) {
    const [firstLine, secondLine, ...rest] = getMeme().lines

    gCtx.fillStyle = getMeme().lines[0].color
    gCtx.font = `${firstLine.size}px arial`
    drawText(firstLine.txt, positions[0].x, positions[0].y)

    gCtx.fillStyle = getMeme().lines[1].color
    gCtx.font = `${secondLine.size}px arial`
    drawText(secondLine.txt, positions[1].x, positions[1].y)

    rest.forEach((line, idx) => {
        gCtx.fillStyle = line.color
        gCtx.font = `${line.size}px arial`
        drawText(line.txt, line.pos.x, line.pos.y)
    })

    if (isLineNew) onSwitchLine(getMeme().selectedLineIdx, isLineNew)
}

function renderRects() {
    getMeme().lines.forEach((line, idx) => {
        drawRectAround(positions[idx], idx)
    })
}

function renderRect(idx) {
    drawRectAround(getMeme().lines[idx].pos, idx)

}

function drawRectAround(pos, idx) {
    const size = getMeme().lines[getMeme().selectedLineIdx].size + ''

    gCtx.font = size + "px arial"
    const textMetrics = gCtx.measureText(getMeme().lines[idx].txt)
    const width = textMetrics.width
    const height = textMetrics.actualBoundingBoxAscent

    console.log(textMetrics)
    drawRect(pos.x - width / 2 - 10, pos.y - height - 10, width + 20, height * 2 + 20)
}

function onRectClick(ev) {
    const { offsetX, offsetY, clientX, clientY } = ev

    const line = getMeme().lines.find(line => {
        var { x, y } = line.pos
        const textMetrics = gCtx.measureText(line.txt)
        const width = textMetrics.width
        const height = textMetrics.actualBoundingBoxAscent
        const rectX = line.pos.x - width / 2 - 10
        const rectY = line.pos.y - height - 10


        return (offsetX >= rectX && offsetX <= rectX + width + 20 &&
            offsetY >= rectY && offsetY <= rectY + height * 2 + 20)
    })

    if (line) onSwitchLine(getMeme().lines.indexOf(line))
    else renderMeme(false, false, true)
}

function onChangeTxt(val) {
    setLineTxt(val)
    renderMeme()
}

function onChangeColor(val, idx = getMeme().selectedLineIdx) {
    const svgPath = document.querySelector('path')

    setLineColor(val, idx)
    gCtx.fillStyle = val
    console.log('gCtx', gCtx)
    svgPath.setAttribute('fill', `${val}`)

    renderMeme()
}

function onChangeFontSize(dir) {
    setFontSize(dir)
    console.log('getMeme().lines[getMeme().selectedLineIdx].size', getMeme().lines[getMeme().selectedLineIdx].size)
    // const size = getMeme().lines[getMeme().selectedLineIdx].size + ''

    // gCtx.font = size + "px arial"
    // console.log('gCtx.font', gCtx.font)

    renderMeme()
}

function onAddLine() {
    const isLineNew = true
    positions.push({ x: gElCanvas.width / 2, y: gElCanvas.height / 2 })
    addLine()
    updatePosition({ x: gElCanvas.width / 2, y: gElCanvas.height / 2 }, getMeme().lines.length - 1)
    renderMeme(isLineNew)
}

function onSwitchLine(idx, isLineNew = false) {
    const newLineIdx = switchLine(idx)
    const elTxtInput = document.querySelector('input[type="text"]')
    const newLineTxt = getMeme().lines[newLineIdx].txt

    const elColor = document.querySelector('input[type="color"]')
    const newLineColor = getMeme().lines[newLineIdx].color
    const svgPath = document.querySelector('path')
    const mq = window.matchMedia("(min-width: 768px)");


    elTxtInput.value = newLineTxt
    if (mq.matches) elTxtInput.select()

    elColor.value = newLineColor
    svgPath.setAttribute('fill', `${newLineColor}`)
    if (isLineNew) return
    renderMeme()
}

function onDownload() {
    const elLink = document.createElement('a')
    const dataUrl = gElCanvas.toDataURL()
    const firstLine = getMeme().lines[0].txt

    elLink.setAttribute('href', dataUrl)

    // getMeme().downloadClicked = true

    elLink.setAttribute('download', `${firstLine}.png`)
    elLink.click()
}