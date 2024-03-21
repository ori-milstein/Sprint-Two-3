'use strict'

var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat'] },
    { id: 2, url: 'img/2.jpg', keywords: ['funny', 'cat'] },
]
var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        { txt: 'I sometimes eat Falafel', size: 20, color: '#ff0000' },
        { txt: 'I enjoy eating Falafel', size: 20, color: '#ff0000' },
    ],
    alreadyDownload: false
}

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

function getMeme() {
    return gMeme
}

function updatePosition(pos, idx) {
    gMeme.lines[idx].pos = pos
}

function addLine() {
    gMeme.lines.push({ txt: 'Enter Text Here', size: 20, color: '#ff0000', pos: {} })
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function getImgs() {
    return gImgs
}

function setLineTxt(txt, lineIdx = 0) {
    const { selectedLineIdx, lines } = gMeme

    // if (selectedLineIdx !== lineIdx) gMeme.selectedLineIdx = lineIdx
    lines[selectedLineIdx].txt = txt
}

function switchLine(idx) {
    // console.log('idx', idx)
    var { selectedLineIdx, lines } = gMeme
    // console.log('selectedLineIdx', selectedLineIdx)
    // console.log('lines.length', lines.length)

    gMeme.selectedLineIdx = (idx === undefined) ? (selectedLineIdx === lines.length - 1) ? 0 : ++gMeme.selectedLineIdx : idx

    // console.log('selectedLineIdx', gMeme.selectedLineIdx)
    // gCtx.font = `${lines[selectedLineIdx].size}px arial`
    return gMeme.selectedLineIdx
}

function setLineColor(color, lineIdx = gMeme.selectedLineIdx) {
    gMeme.lines[lineIdx].color = color
}

function setFontSize(dir) {
    gMeme.lines[gMeme.selectedLineIdx].size += dir * 2.5
    // gMeme.lines.forEach(line => line.size += dir * 5)
}

function setImg(id) {
    gMeme.selectedImgId = id
}