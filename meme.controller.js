'use strict'

let positions

function renderMeme(isLineNew = false, isInit = false, isRect = true, isDownload = false, isInputFocus = false) {
    const gallery = document.querySelector('.gallery')
    const editor = document.querySelector('.editor')

    editor.classList.remove('hidden')
    gallery.classList.add('hidden')

    const meme = getMeme()
    const img = new Image()

    if (meme.uploadSrc) changeSelectedImg()
    img.src = (meme.uploadSrc) ? `${meme.uploadSrc}` : `img/meme-imgs/meme-imgs-square/${meme.selectedImgId}.jpg`

    img.addEventListener("load", () => {
        resizeCanvas(img)
        coverCanvasWithImg(img)

        if (isInit) {
            positions = [{ x: gElCanvas.width / 2, y: 40 }, { x: gElCanvas.width / 2, y: gElCanvas.height - 40 }]
            positions.forEach((pos, idx) => updatePosition(pos, idx))
            gStartPos = meme.lines[meme.selectedLineIdx].pos
        }

        renderText()

        if (isLineNew) onSwitchLine(meme.selectedLineIdx, isLineNew)

        if (isInputFocus) renderTextInput()

        if (isRect) renderRect(meme.selectedLineIdx)

        if (isDownload) onDownload()
    })
}

function renderText() {
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'

    getMeme().lines.forEach(line => {
        gCtx.beginPath()
        gCtx.fillStyle = line.color
        gCtx.font = `${line.size}px arial`
        drawText(line.txt, line.pos.x, line.pos.y)
        gCtx.closePath()
    })
}

function onSwitchLine(idx, isLineNew = false) {
    const newLineIdx = switchLine(idx)
    const elColor = document.querySelector('input[type="color"]')
    const newLineColor = getMeme().lines[newLineIdx].color
    const svgPath = document.querySelector('path')

    elColor.value = newLineColor
    svgPath.setAttribute('fill', `${newLineColor}`)

    if (isLineNew) return
    renderMeme(false, false, true, false, true)
}

function renderTextInput() {
    const elTxtInput = document.querySelector('input[type="text"]')
    const selectedLineTxt = getMeme().lines[getMeme().selectedLineIdx].txt
    const mq = window.matchMedia("(min-width: 770px)")


    elTxtInput.value = selectedLineTxt
    if (mq.matches) {
        elTxtInput.select()
    }
}

function renderRect(idx) {
    const size = getMeme().lines[getMeme().selectedLineIdx].size
    gCtx.font = size + "px arial"

    const textMetrics = gCtx.measureText(getMeme().lines[idx].txt)
    const width = textMetrics.width
    const height = textMetrics.actualBoundingBoxAscent
    const pos = getMeme().lines[idx].pos

    drawRect(pos.x - width / 2 - 10, pos.y - height - 10, width + 20, height * 2 + 20)
    updateCirclePos(pos.x - width / 2 - 10, pos.y - 2)
    drawCircle(pos.x - width / 2 - 10, pos.y - 2)
}

function onDownload() {
    const elLink = document.createElement('a')
    const dataUrl = gElCanvas.toDataURL()
    const firstLine = getMeme().lines[0].txt

    elLink.setAttribute('href', dataUrl)
    elLink.setAttribute('download', `${firstLine}.png`)
    elLink.click()
}

function onChangeTxt(val) {
    setLineTxt(val)
    renderMeme()
}

function onAddLine() {
    const isLineNew = true

    positions.push({ x: gElCanvas.width / 2, y: gElCanvas.height / 2 })
    addLine()
    updatePosition({ x: gElCanvas.width / 2, y: gElCanvas.height / 2 }, getMeme().lines.length - 1)

    renderMeme(isLineNew, false, true, false, true)
}

function onChangeColor(val, idx = getMeme().selectedLineIdx) {
    const svgPath = document.querySelector('path')

    setLineColor(val, idx)
    gCtx.fillStyle = val
    svgPath.setAttribute('fill', `${val}`)

    renderMeme()
}

function onChangeFontSize(by, discrete = false) {
    if (discrete) setFontSize(by, discrete)
    else setFontSize(by)

    renderMeme()
}

function onDown(ev) {
    gStartPos = getEvPos(ev)

    const line = clickedLine()

    if (line) {
        setDrag(true)
        onSwitchLine(getMeme().lines.indexOf(line))
    } else {
        renderMeme(false, false, false)
    }
}

function onMove(ev) {
    const { isDrag, isCirclePicked } = getMeme()
    if (!isDrag) return

    const pos = getEvPos(ev)
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    const circleDx = pos.x - getMeme().lines[getMeme().selectedLineIdx].circlePos.x

    if (isCirclePicked) onChangeFontSize(-circleDx)
    else moveRect(dx, dy)

    gStartPos = pos

    renderMeme()
}

function onUp() {
    setDrag(false)
    setCirclePicked(false)
}

function getEvPos(ev) {

    if (TOUCH_EVENTS.includes(ev.type)) {

        ev.preventDefault()
        ev = ev.changedTouches[0]

        return {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }

    } else {
        return {
            x: ev.offsetX,
            y: ev.offsetY,
        }
    }
}

function clickedLine() {
    const clickedPos = gStartPos

    const line = getMeme().lines.find(line => {
        const size = line.size
        gCtx.font = size + "px arial"
        const textMetrics = gCtx.measureText(line.txt)
        const width = textMetrics.width
        const height = textMetrics.actualBoundingBoxAscent
        const rectX = line.pos.x - (width / 2) - 10
        const rectY = line.pos.y - height - 10

        return (isCircleClicked(clickedPos, line)) || (clickedPos.x >= rectX && clickedPos.x <= rectX + width + 20 &&
            clickedPos.y >= rectY && clickedPos.y <= rectY + height * 2 + 20)
    })

    return line
}