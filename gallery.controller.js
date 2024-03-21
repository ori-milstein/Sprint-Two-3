'use strict'

function initGallery() {
    const imgs = getImgs()

    document.querySelector('.gallery').innerHTML = imgs.map(img =>
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
