'use strict'

var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat'] },
    { id: 2, url: 'img/2.jpg', keywords: ['funny', 'cat'] },
    { id: 3, url: 'img/3.jpg', keywords: ['funny', 'cat'] },
    { id: 4, url: 'img/4.jpg', keywords: ['funny', 'cat'] },
    { id: 5, url: 'img/5.jpg', keywords: ['funny', 'cat'] },
    { id: 6, url: 'img/6.jpg', keywords: ['funny', 'cat'] },
    { id: 7, url: 'img/7.jpg', keywords: ['funny', 'cat'] },
    { id: 8, url: 'img/8.jpg', keywords: ['funny', 'cat'] },
    { id: 9, url: 'img/9.jpg', keywords: ['funny', 'cat'] },
    { id: 10, url: 'img/10.jpg', keywords: ['funny', 'cat'] },
    { id: 11, url: 'img/11.jpg', keywords: ['funny', 'cat'] },
    { id: 12, url: 'img/12.jpg', keywords: ['funny', 'cat'] },
    { id: 13, url: 'img/13.jpg', keywords: ['funny', 'cat'] },
    { id: 14, url: 'img/14.jpg', keywords: ['funny', 'cat'] },
    { id: 15, url: 'img/15.jpg', keywords: ['funny', 'cat'] },
    { id: 16, url: 'img/16.jpg', keywords: ['funny', 'cat'] },
    { id: 17, url: 'img/17.jpg', keywords: ['funny', 'cat'] },
    { id: 18, url: 'img/18.jpg', keywords: ['funny', 'cat'] },
    { id: 19, url: 'img/19.jpg', keywords: ['funny', 'cat'] },
]
var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        { txt: 'I sometimes eat Falafel', size: 20, color: '#ff0000', pos: {}, circlePos: {} },
        { txt: 'I enjoy eating Falafel', size: 20, color: '#ff0000', pos: {}, circlePos: {} },
    ],
    isDrag: false,
    isCirclePicked: false,
    uploadSrc: null,
}

function getMeme() {
    return gMeme
}

function getImgs() {
    return gImgs
}

function addImg(src) {
    gImgs.push({ id: gImgs[gImgs.length - 1].id + 1, url: `${src}`, keywords: ['funny', 'cat'] },)
    gMeme.uploadSrc = src
}

function changeSelectedImg(id = gImgs.length) {
    gMeme.selectedImgId = id
}

function setImg(id) {
    gMeme.uploadSrc = null
    gMeme.selectedImgId = id
}

function setLineTxt(txt) {
    const { selectedLineIdx, lines } = gMeme

    lines[selectedLineIdx].txt = txt
}


function setLineColor(color, lineIdx = gMeme.selectedLineIdx) {
    gMeme.lines[lineIdx].color = color
}

function setFontSize(by, discrete) {
    if (discrete) gMeme.lines[gMeme.selectedLineIdx].size += by * 2.5
    else gMeme.lines[gMeme.selectedLineIdx].size += by / 5
}

function addLine() {
    gMeme.lines.push({ txt: 'Enter Text Here', size: 20, color: '#ff0000', pos: {} })
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function switchLine(idx) {
    var { selectedLineIdx, lines } = gMeme

    gMeme.selectedLineIdx = (idx === undefined) ? (selectedLineIdx === lines.length - 1) ? 0 : ++gMeme.selectedLineIdx : idx

    return gMeme.selectedLineIdx
}

function deleteLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    if (gMeme.lines.length) gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function updatePosition(pos, idx) {
    gMeme.lines[idx].pos = pos
}

function moveRect(dx, dy) {
    gMeme.lines[gMeme.selectedLineIdx].pos.x += dx
    gMeme.lines[gMeme.selectedLineIdx].pos.y += dy
}

function updateCirclePos(x, y) {
    gMeme.lines[gMeme.selectedLineIdx].circlePos = { x, y }
}

function setDrag(isDrag) {
    gMeme.isDrag = isDrag
}

function setCirclePicked(isCircle) {
    gMeme.isCirclePicked = isCircle
}

function isCircleClicked(clickedPos, line) {
    const { x, y } = line.circlePos
    //console.log('x', x)
    //console.log('y', y)
    const distance =
        Math.sqrt((x - clickedPos.x) ** 2 + (y - clickedPos.y) ** 2)

    //console.log('distance', distance)
    //console.log('isCircleClicked', distance <= 6)

    if (distance <= 6) setCirclePicked(true)

    return distance <= 6
}