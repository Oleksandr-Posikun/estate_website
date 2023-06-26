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
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
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

    if (windowHeight > 1500) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.marginBottom = "calc(var(--index) * 25";
        }
    }else {
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.marginBottom = "calc(var(--index) * 15)";
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


function addClsAnimate(arg) {
    arg.forEach((caption, index) => {
        caption.style.animationDelay = `${index * 0.2}s`;
        caption.classList.add('animate-left-to-right');
    });
}

function removeClsAnimate(arg) {
    arg.forEach((caption) => {
        caption.style.animationDelay = '';
        caption.classList.remove('animate-left-to-right');
    });
}
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

    addClsAnimate(captions)
    addClsAnimate(titles)
};

const hideTextAnimation = (sliderLine) => {
    const captions = sliderLine.querySelectorAll('.layer__caption');
    const titles = sliderLine.querySelectorAll('.layer__title');

    removeClsAnimate(captions)
    removeClsAnimate(titles)
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

/*======================================================================================================================
MENU                                                                                                               MENU
======================================================================================================================*/
const mainMenu = document.querySelector('.main-menu');
const menuList = document.querySelector('.menu-list');
const menuText = document.querySelectorAll('.menu-text');

// Обработчик события клика на иконку
mainMenu.addEventListener('click', () => {
    menuList.style.display = menuList.style.display === 'block' ? 'none' : 'block';
});

menuList.addEventListener('mouseleave', () => {
    menuList.style.display = 'none';
});

// Получаем ссылки на элементы <li> и <p>
const menuLine = document.querySelectorAll('.menu-line');

menuLine.forEach((line) => {
    line.addEventListener('mouseover', function (event) {
        event.preventDefault();
        const menuLineId = this.id;
        const menuTextId = document.getElementById(menuLineId);
        const elementByMenuLineId = document.getElementById(menuLineId);

        elementByMenuLineId.addEventListener('mouseover', () => menuLineState(elementByMenuLineId, '100%'));
        elementByMenuLineId.addEventListener('mouseout', () => menuLineState(elementByMenuLineId, '15%'));
        menuTextId.addEventListener('mouseover', () => menuTextState(menuTextId, 'block'));
        menuTextId.addEventListener('mouseout', () => menuTextState(menuTextId, 'none'));
    });
});

function menuTextState(element, style) {
    const menuText = element.querySelector('.menu-text');
    menuText.style.display = style;
}

function menuLineState(element, style) {
    element.style.width = style;
}


