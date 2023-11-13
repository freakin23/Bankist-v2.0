'use strict';

// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const section3 = document.querySelector('#section--3');

const openModal = function (e) {
	e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach(function(btn) {
	btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

// button scrolling
btnScrollTo.addEventListener('click', function(e) {
	const s1cords = section1.getBoundingClientRect();
	section1.scrollIntoView({behavior: 'smooth'}); // Works only on modern browsers 
});


/*
Page Navigation
Implementing through event delegation
1. add el to commmon parent element
2. determine what element originated the event
*/
const navLinks = document.querySelector('.nav__links');
navLinks.addEventListener('click', function(e) {
	e.preventDefault();
	console.log(e.target); // where it happens;

	// Matching strategy
	if (e.target.classList.contains('nav__link')) {
		const id = e.target.getAttribute('href');
		const toSection = document.querySelector(id);
		toSection.scrollIntoView({behavior: 'smooth'});
	}
});

// Tabs
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
tabsContainer.addEventListener('click', function(e) {
	e.preventDefault();
	const clicked = e.target.closest('.operations__tab');
	
	// Guard clause
	if (!clicked) {
		return;
	}
	const dataTab = clicked.getAttribute('data-tab');
	
	// Active tab
	tabs.forEach(function(tab) {
		tab.classList.remove('operations__tab--active');
	});
	clicked.classList.add('operations__tab--active');

	// Active content tab
	tabsContent.forEach(function(con) {
		con.classList.remove('operations__content--active');
	});
	// console.log(clicked.dataset.tab); // -> similar to datatab
	document.querySelector(`.operations__content--${dataTab}`).classList.add('operations__content--active');

});


// Menu fade animation
const nav = document.querySelector('.nav');
const handleHover = function(e, opacity) {
	if (e.target.classList.contains('nav__link')) {
		const link = e.target;
		const siblings = link.closest('.nav').querySelectorAll('.nav__link');
		const logo = link.closest('.nav').querySelector('img');

		siblings.forEach(function(el) {
			if (el !== link) {
				el.style.opacity = opacity;
			}
		});
		logo.style.opacity = opacity;
	}
};
nav.addEventListener('mouseover', function(e) {
	handleHover(e, 0.5)
});

nav.addEventListener('mouseout', function(e) {
	handleHover(e, 1);
});


// Sticky navigation
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function(entries) {
	const [entry] = entries;
	// console.log(entry);
	if (!entry.isIntersecting) {
		nav.classList.add('sticky');
	}
	else {
		nav.classList.remove('sticky');
	}
};
const headerObserver = new IntersectionObserver(stickyNav, {
	root: null,
	threshold: 0,
	rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);


// Reveal Sections
const allSections = document.querySelectorAll('.section');
const reveal = function(entries, observer) {
	const [entry] = entries;
	// console.log(entry);
	if (!entry.isIntersecting) {
		return;
	}
	entry.target.classList.remove('section--hidden');
	observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(reveal, {
	root: null,
	threshold: 0.15,
});

allSections.forEach(function(section) {	
	sectionObserver.observe(section);
	section.classList.add('section--hidden');
});


// Lazy loading images
const imgTarget = document.querySelectorAll('img[data-src]');
const loadImg = function(entries, observer) {
	const [entry] = entries;
	// console.log(entry);
	if (!entry.isIntersecting) {
		return;
	}

	// Replace src with data-src
	entry.target.src = entry.target.dataset.src;
	entry.target.addEventListener('load', function() {
		entry.target.classList.remove('lazy-img');
	});
	observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
	root: null,
	threshold: 0,
	rootMargin: '+200px',
});

imgTarget.forEach(function(img) {
	imgObserver.observe(img);
});


// Slider
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const slides = document.querySelectorAll('.slide')
const dotContainer = document.querySelector('.dots');

// Functions
const createDots = function() {
	slides.forEach(function(s, i) {
		dotContainer.insertAdjacentHTML('beforeend',
		`<button class="dots__dot" data-slide="${i}">
		</button>`);
	});
};

const activeDot = function(now) {
	document.querySelectorAll('.dots__dot').forEach(function(dot) {
		dot.classList.remove('dots__dot--active');
	});

	document.querySelector(`.dots__dot[data-slide="${now}"]`).classList.add('dots__dot--active');
};

const goToSlide = function(now) {
	slides.forEach(function(s, i) {
		s.style.transform = `translateX(${(i - now) * 100}%)`
	});
	activeDot(now);
};

const nextSlide = function() {
	currSlide = (currSlide + 1) % maxSlides
	goToSlide(currSlide);
};

const prevSlide = function() {
	currSlide = (currSlide - 1 + maxSlides) % maxSlides;
	goToSlide(currSlide);
};

// Initial values
let currSlide = 0;
const maxSlides = slides.length;

const init = function() {
	createDots();
	goToSlide(0);
}; init();

// Event listener
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function(e) {
	if (e.key === 'ArrowLeft') {
		prevSlide();
	}
	if (e.key === 'ArrowRight') {
		nextSlide();
	}
});

dotContainer.addEventListener('click', function(e) {
	if (e.target.classList.contains('dots__dot')) {
		const {slide} = e.target.dataset;
		goToSlide(slide);
	}
});
