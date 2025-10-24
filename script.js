const containerElement = document.querySelector('.slideshow_container');

let slideIndex = 0;
let memesData = [];

class Meme {
    constructor(element, memeData) {
        this.element = element;
        this.name = memeData.name;
        this.url = memeData.url;

        this.element.classList.add('meme');
        this.element.innerHTML = '';

        const imageEl = document.createElement('img');
        imageEl.classList.add('meme-image');
        imageEl.src = this.url;
        imageEl.alt = this.name;
        this.element.appendChild(imageEl);
    }
}

async function getMemeAsync() {
    try {
        const response = await fetch('https://api.imgflip.com/get_memes');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.success && data.data && data.data.memes) {
            memesData = data.data.memes;
            displayMeme(memesData);
        } else {
            console.error('Failed to fetch memes:', data);
        }
    } catch (error) {
        console.error('An error occurred while fetching memes:', error);
    }
}

function displayMeme(memes) {
    containerElement.innerHTML = '';

    memes.forEach((memeData, index) => {
        const el = document.createElement("div");
        new Meme(el, memeData);
        containerElement.appendChild(el);
    });

    showSlides(slideIndex);
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    const slides = document.querySelectorAll('.meme');

    if (slides.length === 0) return;

    if (n >= slides.length) { slideIndex = 0; }
    if (n < 0) { slideIndex = slides.length - 1; }

    const offset = -slideIndex * 100;
    containerElement.style.transform = `translateX(${offset}%)`;
}

document.addEventListener('DOMContentLoaded', () => {
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');

    if (prevButton) {
        prevButton.addEventListener('click', () => plusSlides(-1));
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => plusSlides(1));
    }

    if (containerElement) {
        getMemeAsync();
    } else {
        console.error('Element with class "slideshow_container" not found.');
    }
});
