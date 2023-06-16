/*======================================================================================================================
PARALLAX                                                                                                       PARALLAX
======================================================================================================================*/
const bodyStyle = document.body.style;
const selectors = document.getElementsByClassName('layer__head');

window.addEventListener('scroll', (event) => {
    bodyStyle.setProperty('--scrollTop', `${window.scrollY}px`);

    const scrollTop = event.target.scrollingElement.scrollTop;
    const zIndex = scrollTop > 150 ? '1' : '11';

    for (let i = 0; i < selectors.length; i++) {
        selectors[i].style.zIndex = zIndex;
    }
});

/*======================================================================================================================
BUTTON DECORATION                                                                                     BUTTON DECORATION
======================================================================================================================*/
const buttonLink = document.querySelector('.button-link');
const line = document.createElement('span');
line.classList.add('underline-line');
buttonLink.appendChild(line);

buttonLink.addEventListener('mouseenter', () => {
    const buttonWidth = buttonLink.offsetWidth;
    line.style.width = '50px';
    line.style.transform = `translateX(${buttonWidth - 50}px)`;
});

buttonLink.addEventListener('mouseleave', () => {
    line.style.width = '0';
    line.style.transform = 'translateX(0)';
});

/*======================================================================================================================
UPDATE MARGIN SIZE                                                                                   UPDATE MARGIN SIZE
======================================================================================================================*/
function updateStyles(cls_name) {
    const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const elements = document.getElementsByClassName(cls_name);
    if (windowWidth < 900) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.marginBottom = "calc(" + 2 * 115 + "px + " + Math.floor(400 / 2) + "px)";
        }
    } else {
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.marginBottom = "calc(var(--index) * 24)";
        }
    }
}

updateStyles('layer__head');

window.addEventListener('resize', () => {
    updateStyles('layer__head');
});

/*======================================================================================================================
SLIDER                                                                                                           SLIDER
======================================================================================================================*/
const nextButton = document.querySelector('.button-next');
const prevButton = document.querySelector('.button-prev');
const sliderLines = document.querySelectorAll('.slider-line');
const dots = document.querySelectorAll('.dot');

let dotIndex = 0;
let touchStartX = 0;
let touchEndX = 0;
let intervalId = null;

const startCarousel = () => {
    intervalId = setInterval(() => {
        skipSlide(dotIndex + 1);
    }, 6000);
};

const stopCarousel = () => {
    clearInterval(intervalId);
};

const showTextAnimation = (sliderLine) => {
    const captions = sliderLine.querySelectorAll('.layer__caption');
    const titles = sliderLine.querySelectorAll('.layer__title');

    captions.forEach((caption, index) => {
        caption.style.animationDelay = `${index * 0.2}s`;
        caption.classList.add('animate-left-to-right');
    });

    titles.forEach((title, index) => {
        title.style.animationDelay = `${index * 0.2 + 0.2}s`;
        title.classList.add('animate-left-to-right');
    });
};

const hideTextAnimation = (sliderLine) => {
    const captions = sliderLine.querySelectorAll('.layer__caption');
    const titles = sliderLine.querySelectorAll('.layer__title');

    captions.forEach((caption) => {
        caption.style.animationDelay = '';
        caption.classList.remove('animate-left-to-right');
    });

    titles.forEach((title) => {
        title.style.animationDelay = '';
        title.classList.remove('animate-left-to-right');
    });
};

const skipSlide = (index) => {
    const activeIndex = dotIndex % sliderLines.length;
    sliderLines[activeIndex].classList.remove('active-slide');
    dots[activeIndex].classList.remove('active');
    if (dotIndex !== 0) {
        dotIndex = index;
    } else {
        dotIndex = dots.length + index;
    }

    const nextIndex = dotIndex % sliderLines.length;
    sliderLines[nextIndex].classList.add('active-slide');
    dots[nextIndex].classList.add('active');

    hideTextAnimation(sliderLines[activeIndex]);
    showTextAnimation(sliderLines[nextIndex]);
};

const handleClickNextButton = () => {
    stopCarousel();
    skipSlide(dotIndex + 1);
    startCarousel();
};

const handleClickPrevButton = () => {
    stopCarousel();
    skipSlide(dotIndex - 1);
    startCarousel();
};

const handleClickDot = (index) => {
    stopCarousel();
    skipSlide(index);
    startCarousel();
};

const handleTouchStart = (event) => {
    stopCarousel();
    touchStartX = event.touches[0].clientX;
};

const handleTouchMove = (event) => {
    touchEndX = event.touches[0].clientX;
};

const handleTouchEnd = () => {
    const touchDiff = touchEndX - touchStartX;
    const swipeThreshold = 50;

    if (touchDiff > swipeThreshold) {
        skipSlide(dotIndex - 1);
    } else if (touchDiff < -swipeThreshold) {
        skipSlide(dotIndex + 1);
    }

    startCarousel();
};

nextButton.addEventListener('click', handleClickNextButton);
prevButton.addEventListener('click', handleClickPrevButton);

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => handleClickDot(index));
});

sliderLines.forEach((sliderLine) => {
    sliderLine.addEventListener('touchstart', handleTouchStart);
    sliderLine.addEventListener('touchmove', handleTouchMove);
    sliderLine.addEventListener('touchend', handleTouchEnd);
});

startCarousel();
