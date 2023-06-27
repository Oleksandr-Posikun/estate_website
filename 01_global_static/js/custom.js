class StylesUpdater {
    constructor() {
        this.windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        this.windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }

    /**
     * Updates the styles of elements with the specified class name.
     * @param {string} clsName - The class name of the elements to update.
     */
    update(clsName) {
        const elements = document.getElementsByClassName(clsName);

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];

            if (this.windowWidth < 900) {
                element.style.marginBottom = `calc(${2 * 115}px + ${Math.floor(400 / 2)}px)`;
            } else {
                element.style.marginBottom = 'calc(var(--index) * 24)';
            }

            if (this.windowHeight > 1500) {
                element.style.marginBottom = 'calc(var(--index) * 25)';
            } else {
                element.style.marginBottom = 'calc(var(--index) * 15)';
            }
        }
    }
}

class TextAnimation {
    constructor(container, ...args) {
        this.lists = [];

        for (let i = 0; i < args.length; i++) {
            const list = Array.from(container.querySelectorAll(args[i]));
            this.lists.push(list);
        }
    }

    /**
     * Adds class animation to the items in the list.
     */
    addAnimation() {
        for (let i = 0; i < this.lists.length; i++) {
            const list = this.lists[i];
            list.forEach((caption, index) => {
                caption.style.animationDelay = `${index * 0.2}s`;
                caption.classList.add('animate-left-to-right');
            });
        }
    }

    /**
     * Removes class animation from the items in the list.
     */
    removeAnimation() {
        for (let i = 0; i < this.lists.length; i++) {
            const list = this.lists[i];
            list.forEach((caption) => {
                caption.style.animationDelay = '';
                caption.classList.remove('animate-left-to-right');
            });
        }
    }

    /**
     * Checks if the element is in the visible area of the screen
     * and adds or removes class animation accordingly.
     * @param {HTMLElement} element - The element to check.
     */
    elementShowCheck(element) {
        const elementRect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const threshold = viewportHeight * 0.8;

        if (elementRect.top < threshold) {
            this.addAnimation();
        } else {
            this.removeAnimation();
        }
    }
}


class Page {
    constructor() {
        this.bodyStyle = document.body.style;
        this.selectors = document.getElementsByClassName('layer__head');
        this.mainArticle = document.querySelector('.main-article');
        this.animText = new TextAnimation(this.mainArticle, '.text__animation');
        this.buttonLink = document.querySelector('.button-link');
        this.line = document.createElement('span');
        this.line.classList.add('underline-line');
        this.buttonLink.appendChild(this.line);

        this.stylesUpdater = new StylesUpdater();
        this.initializeEvents();
        this.stylesUpdater.update('layer__head');
    }

    /**
     * initializeEvents - Initializes the event listeners.
     */
    initializeEvents() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        this.buttonLink.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
        this.buttonLink.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    /**
     * Handles the scroll event.
     */
    handleScroll() {
        this.bodyStyle.setProperty('--scrollTop', `${window.scrollY}px`);

        const scrollTop = window.scrollY;
        const zIndex = scrollTop > 150 ? '1' : '11';

        for (let i = 0; i < this.selectors.length; i++) {
            this.selectors[i].style.zIndex = zIndex;
        }

        this.animText.elementShowCheck(this.mainArticle);
    }

    /**
     * Handles the mouseenter event.
     */
    handleMouseEnter() {
        const buttonWidth = this.buttonLink.offsetWidth;
        this.line.style.width = '50px';
        this.line.style.transform = `translateX(${buttonWidth - 50}px)`;
    }

    /**
     * Handles the mouseleave event.
     */
    handleMouseLeave() {
        this.line.style.width = '0';
        this.line.style.transform = 'translateX(0)';
    }

    /**
     * Handles the resize event.
     */
    handleResize() {
        this.stylesUpdater.update('layer__head');
    }
}

const page = new Page();

/*======================================================================================================================
SLIDER                                                                                                           SLIDER
======================================================================================================================*/
class Slide {
    constructor(container) {
        this.container = container;
        this.textAnimation = new TextAnimation(this.container, '.text__animation');
    }

    show() {
        this.container.classList.add('active-slide');
        this.textAnimation.addAnimation();
    }

    hide() {
        this.container.classList.remove('active-slide');
        this.textAnimation.removeAnimation();
    }
}

class Slider {
    constructor() {
        this.nextButton = document.querySelector('.button-next');
        this.prevButton = document.querySelector('.button-prev');
        this.containers = document.querySelectorAll('.slider-line');
        this.dots = document.querySelectorAll('.dot');
        this.dotIndex = 0;
        this.slides = Array.from(this.containers).map((container) => new Slide(container));
        this.intervalId = null;

        // Bind the context for the methods
        this.startCarousel = this.startCarousel.bind(this);
        this.stopCarousel = this.stopCarousel.bind(this);
        this.skipSlide = this.skipSlide.bind(this);
        this.handleClickNextButton = this.handleClickNextButton.bind(this);
        this.handleClickPrevButton = this.handleClickPrevButton.bind(this);
        this.handleClickDot = this.handleClickDot.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);

        this.nextButton.addEventListener('click', this.handleClickNextButton);
        this.prevButton.addEventListener('click', this.handleClickPrevButton);

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.handleClickDot(index));
        });

        this.containers.forEach((container) => {
            container.addEventListener('touchstart', this.handleTouchStart);
            container.addEventListener('touchmove', this.handleTouchMove);
            container.addEventListener('touchend', this.handleTouchEnd);
        });

        this.startCarousel();
    }


    /**
     * Starts the carousel by setting an interval to automatically
     * skip to the next slide.
     */
    startCarousel() {
        this.intervalId = setInterval(() => {
            this.skipSlide(this.dotIndex + 1);
        }, 6000);
    }

    /**
     * Stops the carousel by clearing the interval.
     */
    stopCarousel() {
        clearInterval(this.intervalId);
    }

    /**
     * Skips to the specified slide by hiding the current active slide,
     * showing the next slide, and updating the active dot.
     * @param {number} index - The index of the slide to skip to.
     */
    skipSlide(index) {
        const activeIndex = this.dotIndex % this.containers.length;
        this.slides[activeIndex].hide();

        if (this.dotIndex !== 0) {
            this.dotIndex = index;
        } else {
            this.dotIndex = this.dots.length + index;
        }

        const nextIndex = this.dotIndex % this.containers.length;
        this.slides[nextIndex].show();
        this.updateActiveDot(nextIndex);
    }

    /**
     * Updates the active dot by adding the 'active' class to the
     * corresponding dot and removing it from the rest.
     * @param {number} index - The index of the dot to make active.
     */
    updateActiveDot(index) {
        this.dots.forEach((dot) => {
            dot.classList.remove('active');
        });
        this.dots[index].classList.add('active');
    }

    /**
     * Handles the click event on the next button.
     * Stops the carousel, skips to the next slide, and restarts the carousel.
     */
    handleClickNextButton() {
        this.stopCarousel();
        this.skipSlide(this.dotIndex + 1);
        this.startCarousel();
    }

    /**
     * Handles the click event on the previous button.
     * Stops the carousel, skips to the previous slide, and restarts the carousel.
     */
    handleClickPrevButton() {
        this.stopCarousel();
        this.skipSlide(this.dotIndex - 1);
        this.startCarousel();
    }

    /**
     * Handles the click event on a dot.
     * Stops the carousel, skips to the corresponding slide, and restarts the carousel.
     * @param {number} index - The index of the dot that was clicked.
     */
    handleClickDot(index) {
        this.stopCarousel();
        this.skipSlide(index);
        this.startCarousel();
    }

    /**
     * Handles the touchstart event on a slide container.
     * Stops the carousel and records the starting touch position.
     * @param {TouchEvent} event - The touchstart event object.
     */
    handleTouchStart(event) {
        this.stopCarousel();
        this.touchStartX = event.touches[0].clientX;
    }

    /**
     * Handles the touchmove event on a slide container.
     * Records the current touch position.
     * @param {TouchEvent} event - The touchmove event object.
     */
    handleTouchMove(event) {
        this.touchEndX = event.touches[0].clientX;
    }

    /**
     * Handles the touchend event on a slide container.
     * Determines the touch swipe direction and skips to the corresponding slide.
     */
    handleTouchEnd() {
        const touchDiff = this.touchEndX - this.touchStartX;
        const swipeThreshold = 50;

        if (touchDiff > swipeThreshold) {
            this.skipSlide(this.dotIndex - 1);
        } else if (touchDiff < -swipeThreshold) {
            this.skipSlide(this.dotIndex + 1);
        }

        this.startCarousel();
    }
}

const slider = new Slider();


/*======================================================================================================================
MENU                                                                                                               MENU
======================================================================================================================*/


