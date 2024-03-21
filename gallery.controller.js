'use strict'

function initGallery() {
    const imgs = getImgs()
    const gallery = document.querySelector('.gallery')

    gallery.innerHTML = `
    <a href="#">
        <img src="Fonts/upload-solid.svg" alt="" class="upload">
        </a>
    `
    gallery.innerHTML += imgs.map(img =>
        `
        <a href="#">
            <img src="img/meme-imgs/meme-imgs-square/${img.id}.jpg" alt="" onclick="onImgSelect(${img.id})">
        </a>`
    ).join('')
}

function renderGallery(params) {
    const gallery = document.querySelector('.gallery')
    const editor = document.querySelector('.editor')
    // gallery.innerHTML = ``
    editor.classList.add('hidden')
    gallery.classList.remove('hidden')
}

function onImgSelect(id) {
    setImg(id)
    // document.querySelector('input').value = ''
    renderMeme()
}
