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
        // initCanvasWidth(img)
        coverCanvasWithImg(img)
        if (isInit) positions = [{ x: gElCanvas.width / 2, y: 40 }, { x: gElCanvas.width / 2, y: gElCanvas.height - 40 }]
        positions.forEach((pos, idx) => updatePosition(pos, idx))
        // getMeme().lines.forEach(line => updateCirclePos)
        // /*if (isInit)*/ gCircle = getMeme().lines[0].circlePos
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
        if (isInit) gStartPos = getMeme().lines[getMeme().selectedLineIdx].pos
    })
}
function renderText(isLineNew = false) {
    const [firstLine, secondLine, ...rest] = getMeme().lines
    gCtx.beginPath()
    gCtx.fillStyle = getMeme().lines[0].color
    gCtx.font = `${firstLine.size}px arial`
    // drawText(firstLine.txt, positions[0].x, positions[0].y)
    drawText(firstLine.txt, firstLine.pos.x, firstLine.pos.y)
    gCtx.closePath()

    gCtx.beginPath()
    gCtx.fillStyle = getMeme().lines[1].color
    gCtx.font = `${secondLine.size}px arial`
    // drawText(secondLine.txt, positions[1].x, positions[1].y)
    drawText(secondLine.txt, secondLine.pos.x, secondLine.pos.y)
    gCtx.closePath()

    rest.forEach((line, idx) => {
        gCtx.beginPath()
        gCtx.fillStyle = line.color
        gCtx.font = `${line.size}px arial`
        drawText(line.txt, line.pos.x, line.pos.y)
        gCtx.closePath()
    })
    // gCtx.closePath()
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
    updateCirclePos(pos.x - width / 2 - 10, pos.y - 2)
    drawCircle(pos.x - width / 2 - 10, pos.y - 2)
}

function onCanvasClick(ev) {
    // const { offsetX, offsetY, clientX, clientY } = ev

    const line = clickedLine()

    // const line = getMeme().lines.find(line => {
    //     // var { x, y } = line.pos
    //     const size = line.size
    //     gCtx.font = size + "px arial"
    //     const textMetrics = gCtx.measureText(line.txt)
    //     // console.log('textMetrics', textMetrics)
    //     const width = textMetrics.width
    //     const height = textMetrics.actualBoundingBoxAscent
    //     // console.log('width', width)
    //     // console.log('height', height)
    //     const rectX = line.pos.x - (width / 2) - 10
    //     const rectY = line.pos.y - height - 10
    //     // console.log('offsetX', offsetX)
    //     // console.log('offsetY', offsetY)
    //     // console.log('rectX', rectX)
    //     // console.log('rectY', rectY)

    //     return (offsetX >= rectX && offsetX <= rectX + width + 20 &&
    //         offsetY >= rectY && offsetY <= rectY + height * 2 + 20)
    // })
    console.log('line', line)
    if (line) onSwitchLine(getMeme().lines.indexOf(line))
    else {
        setCirclePicked(false)
        renderMeme(false, false, true)
    }
    console.log('getMeme().isCirclePicked', getMeme().isCirclePicked)
    return line
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

function onChangeFontSize(by, discrete = false) {
    if (discrete) setFontSize(by, discrete)
    else setFontSize(by)
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

function onDown(ev) {
    console.log('mousedown')
    // Save the position we started from...
    // Get the event position from mouse or touch
    gStartPos = getEvPos(ev)
    console.log('gStartPos', gStartPos)
    // console.log('gCircle', gCircle)
    const isRect = isRectClicked2(gStartPos)
    console.log('isRect', isRect)
    const isCircle = isCircleClicked(gStartPos)
    console.log('isCircle', isCircle)
    if (!isRect && !isCircle) {
        // ev.preventDefault()
        renderMeme()
        return
    }

    if (isRect) {
        ev.preventDefault()
        onCanvasClick(ev)
        console.log('rect is clicked')
        setDrag(true)
    }
    if (isCircle) {
        ev.preventDefault()
        console.log('cicle is clicked')
        setDrag(true)
        setCirclePicked(true)
    }
    document.body.style.cursor = 'grabbing'
    console.log('ev.button', ev.button)
    if (ev.button === 2) {
        console.log('right click')
    }
    renderMeme()
}

function onDown2(ev) {
    console.log('mousedown')
    // Save the position we started from...
    // Get the event position from mouse or touch
    gStartPos = getEvPos(ev)
    console.log('gStartPos', gStartPos)
    // console.log('gCircle', gCircle)

    const line = onCanvasClick()

    if (line) {
        setDrag(true)
    }
    // if (isCircle) {
    //     ev.preventDefault()
    //     console.log('cicle is clicked')
    //     setDrag(true)
    //     setCirclePicked(true)
    // }
    // document.body.style.cursor = 'grabbing'

}

function onMove(ev) {
    const { isDrag, isCirclePicked } = getMeme()
    if (!isDrag && !isCirclePicked) return
    console.log('isDrag', isDrag)
    console.log('isCircle', isCirclePicked)
    const pos = getEvPos(ev)
    console.log('gStartPos.x', gStartPos.x)
    console.log('gStartPos.y', gStartPos.y)
    // Calc the delta, the diff we moved
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    console.log('dx', dx)
    console.log('dy', dy)

    const circleDx = pos.x - getMeme().lines[getMeme().selectedLineIdx].circlePos.x

    console.log('isCirclePicked', isCirclePicked)
    if (isDrag && !isCirclePicked) moveRect(dx, dy)
    else if (isDrag && isCirclePicked) {
        onChangeFontSize(-circleDx)
    }

    // Save the last pos, we remember where we`ve been and move accordingly
    gStartPos = pos

    // The canvas is rendered again after every move
    renderMeme()
}

function onUp() {
    setDrag(false)
    setCirclePicked(false)
    document.body.style.cursor = 'auto'
}

function getEvPos(ev) {

    if (TOUCH_EVENTS.includes(ev.type)) {

        ev.preventDefault()         // Prevent triggering the mouse events
        ev = ev.changedTouches[0]   // Gets the first touch point

        // Calculate the touch position inside the canvas

        // ev.pageX = distance of touch position from the documents left edge
        // target.offsetLeft = offset of the elemnt's left side from the it's parent
        // target.clientLeft = width of the elemnt's left border

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
    // const { offsetX, offsetY, clientX, clientY } = ev
    const clickedPos = gStartPos


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

        // const distance =
        //     Math.sqrt((line.pos.x - clickedPos.x) ** 2 + (line.pos.y - clickedPos.y) ** 2)

        return (isCircleClicked(clickedPos, line)) || (clickedPos.x >= rectX && clickedPos.x <= rectX + width + 20 &&
            clickedPos.y >= rectY && clickedPos.y <= rectY + height * 2 + 20)
    })

    return line
}

function isRectClicked(pos) {
    // console.log('pos', pos)
    // const { pos: posX, pos: posY } = pos
    const posX = pos.x
    const posY = pos.y
    // console.log('posX', posX)
    // console.log('posY', posY)

    const line = getMeme().lines[getMeme().selectedLineIdx]
    console.log('line', line)
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

    const isClicked = (posX >= rectX && posX <= rectX + width + 20 &&
        posY >= rectY && posY <= rectY + height * 2 + 20)
    console.log('isRectClicked', isClicked)
    return isClicked
}

function isRectClicked2(ev) {
    const { x, y, clientX, clientY } = ev

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

        return (x >= rectX && x <= rectX + width + 20 &&
            y >= rectY && y <= rectY + height * 2 + 20)
    })

    if (line) return true
    else return false
}