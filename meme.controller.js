'use strict'

var positions

function renderMeme(isLineNew = false, isInit = false, isNoRect = false, isDownload = false) {
    // var rectX
    // var rectY
    // if (getMeme().lines[getMeme().selectedLineIdx].pos) rectX = getMeme().lines[getMeme().selectedLineIdx].pos.x - (gCtx.measureText(getMeme().lines[getMeme().selectedLineIdx].txt).width / 2) - 10
    // if (getMeme().lines[getMeme().selectedLineIdx].pos) rectY = getMeme().lines[getMeme().selectedLineIdx].pos.y - gCtx.measureText(getMeme().lines[getMeme().selectedLineIdx].txt).actualBoundingBoxAscent - 10
    // console.log('rectX', rectX)
    // console.log('rectY', rectY)

    const gallery = document.querySelector('.gallery')
    const editor = document.querySelector('.editor')

    editor.classList.remove('hidden')
    gallery.classList.add('hidden')

    const meme = getMeme()
    const img = new Image()
    img.src = `img/meme-imgs/meme-imgs-square/${meme.selectedImgId}.jpg`

    // const size = getMeme().lines[getMeme().selectedLineIdx].size

    // gCtx.font = size + "px arial"

    img.addEventListener("load", () => {
        // coverCanvasWithImg(img)
        initCanvasWidth(img)
        positions = [{ x: gElCanvas.width / 2, y: 40 }, { x: gElCanvas.width / 2, y: gElCanvas.height - 40 }]
        positions.forEach((pos, idx) => updatePosition(pos, idx))
        gCtx.textAlign = 'center'
        gCtx.textBaseline = 'middle'
        renderText(isLineNew)

        // const size = getMeme().lines[getMeme().selectedLineIdx].size

        // gCtx.font = size + "px arial"
        // console.log('size', size)



        if (!isNoRect) renderRect(meme.selectedLineIdx)

        // renderRect(meme.selectedLineIdx, isNoRect)
        if (isDownload) onDownload()
        // const size = getMeme().lines[getMeme().selectedLineIdx].size

        // gCtx.font = size + "px arial"
        // if (getMeme().lines[getMeme().selectedLineIdx].pos) rectX = getMeme().lines[getMeme().selectedLineIdx].pos.x - (gCtx.measureText(getMeme().lines[getMeme().selectedLineIdx].txt).width / 2) - 10
        // if (getMeme().lines[getMeme().selectedLineIdx].pos) rectY = getMeme().lines[getMeme().selectedLineIdx].pos.y - gCtx.measureText(getMeme().lines[getMeme().selectedLineIdx].txt).actualBoundingBoxAscent - 10
        // console.log('rectX', rectX)
        // console.log('rectY', rectY)
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

function drawRectAround(pos, idx, isNoRect) {
    const size = getMeme().lines[getMeme().selectedLineIdx].size

    gCtx.font = size + "px arial"
    // console.log('size', size)
    const textMetrics = gCtx.measureText(getMeme().lines[idx].txt)
    const width = textMetrics.width
    const height = textMetrics.actualBoundingBoxAscent

    // console.log(textMetrics)
    // if (isNoRect) return
    drawRect(pos.x - width / 2 - 10, pos.y - height - 10, width + 20, height * 2 + 20)
}

function onRectClick(ev) {
    const { offsetX, offsetY, clientX, clientY } = ev

    const line = getMeme().lines.find(line => {
        // var { x, y } = line.pos
        const size = line.size
        gCtx.font = size + "px arial"
        const textMetrics = gCtx.measureText(line.txt)
        // console.log('textMetrics', textMetrics)
        const width = textMetrics.width
        const height = textMetrics.actualBoundingBoxAscent
        // console.log('width', width)
        // console.log('height', height)
        const rectX = line.pos.x - (width / 2) - 10
        const rectY = line.pos.y - height - 10
        // console.log('offsetX', offsetX)
        // console.log('offsetY', offsetY)
        // console.log('rectX', rectX)
        // console.log('rectY', rectY)

        return (offsetX >= rectX && offsetX <= rectX + width + 20 &&
            offsetY >= rectY && offsetY <= rectY + height * 2 + 20)
    })
    // console.log('line', line)
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
    // console.log('getMeme().lines[getMeme().selectedLineIdx].size', getMeme().lines[getMeme().selectedLineIdx].size)
    // const size = getMeme().lines[getMeme().selectedLineIdx].size + ''

    // gCtx.font = size + "px arial"
    // console.log('gCtx.font', gCtx.font)

    // var rectX = getMeme().lines[0].pos.x - gCtx.measureText(getMeme().lines[0]).width / 2 - 10
    // var rectY = getMeme().lines[0].pos.y - gCtx.measureText(getMeme().lines[0]).actualBoundingBoxAscent - 10

    // var rectX = getMeme().lines[getMeme().lines.length - 1].pos.x - gCtx.measureText(getMeme().lines[getMeme().lines.length - 1]).width / 2 - 10
    // var rectY = getMeme().lines[getMeme().lines.length - 1].pos.y - gCtx.measureText(getMeme().lines[getMeme().lines.length - 1]).actualBoundingBoxAscent - 10
    // console.log('rectX after font change', rectX)
    // console.log('rectY after font change', rectY)

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