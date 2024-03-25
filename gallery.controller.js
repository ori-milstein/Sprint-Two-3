'use strict'

function initGallery() {
    const imgs = getImgs()
    const gallery = document.querySelector('.gallery')

    gallery.innerHTML = `
    <a href="#">
        <img src="Fonts/upload-solid.svg" alt="" class="upload">
        <input type="file" class="file-input btn" name="image" onchange="onImgInput(event)" accept="image/*" />
        </a>
    `
    gallery.innerHTML += imgs.map(img =>
        `
        <a href="#">
            <img src="img/meme-imgs/meme-imgs-square/${img.id}.jpg" alt="" onclick="onImgSelect(${img.id})">
        </a>`
    ).join('')
}

function renderGallery() {
    const gallery = document.querySelector('.gallery')
    const editor = document.querySelector('.editor')
    gallery.classList.remove('hidden')
    editor.classList.add('hidden')
}

function onImgSelect(id) {
    setImg(id)
    renderMeme(false, true)
}

function onImgInput(ev) {
    console.log('hi')
    loadImageFromInput(ev)
}
