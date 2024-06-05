'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const message = document.createElement('div');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const header = document.querySelector('.header');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const allSections = document.querySelectorAll('.section');
const imgTarget = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');

const openModal = function (e) {

    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal))

// for (let i = 0; i < btnsOpenModal.length; i++)
//     btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});



message.classList.add('cookie-message');
message.innerHTML = "We use cookies for improved functionality and analytics. <button class='btn btn--close-cookie'>Got It!</button>"
// console.log(message)
header.prepend(message)

document.querySelector('.btn--close-cookie').addEventListener('click', function () {
    message.remove()
});

message.style.backgroundColor = '#37383d';
message.style.width = '120%';

message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');


btnScrollTo.addEventListener('click', function () {
    const s1coords = section1.getBoundingClientRect();
    // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

    // window.scrollTo({
    //     left: s1coords.left + window.pageXOffset,
    //     top: s1coords.top + window.pageYOffset,
    //     behavior: 'smooth'
    // });

    section1.scrollIntoView({ behavior: 'smooth' });
});

// document.querySelectorAll('.nav__link').forEach(function (el) {
//     el.addEventListener('click', function (e) {
//         e.preventDefault();

//         const id = this.getAttribute('href');
//         console.log(id);

//         document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
//     })
// });

document.querySelector('.nav__links').addEventListener('click', function (e) {
    // console.log(e.target);

    e.preventDefault();
    if (e.target.classList.contains('nav__link')) {
        // console.log('lick');

        const id = e.target.getAttribute('href');
        //         console.log(id);
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
});



tabsContainer.addEventListener('click', function (e) {
    const clicked = e.target.closest('.operations__tab');
    console.log(clicked);
    if (!clicked) return;

    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    clicked.classList.add('operations__tab--active');


    tabsContent.forEach(t => t.classList.remove('operations__content--active'));

    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
    console.log(clicked.dataset.tab);
});

const handleover = function (e, opacity) {
    if (e.target.classList.contains('nav__link')) {
        // console.log(this)
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img');

        siblings.forEach(el => {
            if (el !== link) el.style.opacity = this;
        });
        logo.style.opacity = this;
    }
}

nav.addEventListener('mouseover', handleover.bind(0.5));

nav.addEventListener('mouseout', handleover.bind(1));

// nav.addEventListener('mouseover', function (e) {
//     handleover(e, 0.5)
// });

// nav.addEventListener('mouseout', function (e) {
//     handleover(e, 1 )
// });
// const initalcoords = section1.getBoundingClientRect();
// console.log(initalcoords);
// window.addEventListener('scroll', function () {
//     // console.log(this);
//     // console.log(window);
//     console.log(window.scrollY);
//     if (window.scrollY > initalcoords.top) nav.classList.add('sticky');
//     else nav.classList.remove('sticky');
// });

// sticky navigation


// const obsCallback = function (entries, observer) {
//     entries.forEach(entry => {
//         console.log(entry)
//     })
// };
// const obsOption = {
//     root: null,
//     threshold: 0.1
// };
// const observer = new IntersectionObserver(obsCallback, obsOption);
// observer.observe(section1);

const navHeight = nav.getBoundingClientRect().height
const stickyNavy = function (entries, headobserver) {
    //     entries.forEach(entry => {

    //     });
    const [entry] = entries;

    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
}
const headobserver = new IntersectionObserver(stickyNavy, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
});
headobserver.observe(header);

//revealing content on screen


const revealSection = function (entries, observer) {
    const [entry] = entries;
    // console.log(entry);
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target)
}


const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15
});

allSections.forEach(function (section) {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
})



//Lazy loading
const loadImage = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;

    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {

        entry.target.classList.remove('lazy-img');
    })
    observer.unobserve(entry.target);

}

const imgObserver = new IntersectionObserver(loadImage, {
    root: null,
    threshold: 0,
    rootMargin: '200px'
});

imgTarget.forEach(img => imgObserver.observe(img));

//image sliders
const slider = function () {
    const sliders = document.querySelector('.slider');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const dotsContainer = document.querySelector('.dots');
    let curSlide = 0;
    const maxSlide = slides.length;


    // sliders.style.transform = 'scale(0.3) translateX(-800px)';
    // sliders.style.overflow = 'visible';

    const createDots = function () {
        slides.forEach(function (_, i) {
            dotsContainer.insertAdjacentHTML('beforeend', `<button class='dots__dot' data-slide='${i}'></button>`);
        });
    };




    const activateDots = function (slide) {
        document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
        document.querySelector(`.dots__dot[data-slide='${slide}']`).classList.add('dots__dot--active')
    }


    const goToSlide = function (slide) {
        slides.forEach((s, i) => (s.style.transform =
            `translateX(${100 * (i - slide)}%)`));
    }



    const init = function () {
        createDots();
        activateDots(0)
        goToSlide(0);
    }

    init();


    const nextSlide = function () {
        if (curSlide === maxSlide - 1) {
            curSlide = 0;
        }
        else {

            curSlide++;
        }
        goToSlide(curSlide);
        activateDots(curSlide)
    }

    const prevSlide = function () {
        if (curSlide === 0) {
            curSlide = maxSlide - 1;
        } else {

            curSlide--;
        }
        goToSlide(curSlide);
        activateDots(curSlide);
    }

    btnRight.addEventListener('click', nextSlide);

    btnLeft.addEventListener('click', prevSlide);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') prevSlide();
        e.key === 'ArrowRight' && nextSlide();
    });


    dotsContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('dots__dot')) {
            // console.log('Tab');
            const { slide } = e.target.dataset;
            goToSlide(slide);
            activateDots(slide)
        }
    });
}
slider();

// const randomInt = (max, min) =>
//     Math.floor(Math.random() * (max - min + 1) + min);
// const randomcolor = () =>
//     `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// // console.log(randomcolor());

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//     this.style.backgroundColor = randomcolor();
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {

//     this.style.backgroundColor = randomcolor();
// });
// document.querySelector('.nav').addEventListener('click', function (e) {
//     this.style.backgroundColor = randomcolor();
// });

// console.log(document.documentElement);

// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// document.getElementById('section--1');

// const allButtons = document.getElementsByTagName('button');

// console.log(allButtons);
// document.getElementsByClassName('btn');
