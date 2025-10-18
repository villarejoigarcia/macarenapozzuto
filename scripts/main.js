// content

$(document).ready(function () {

	if (!window.content || !window.content.projects) return;
	const c = window.content;

	const $carousel = $('#gallery');
	$carousel.empty();

	c.projects.forEach((project, index) => {
		const $slide = $('<div>').addClass('post');

		// media

		if (project.media) {
			const $imgs = $('<div>').addClass('media');
			project.media.forEach(m => {
				if (m.type === "image") {
					const $media = $('<img>').attr('src', m.src);
					$imgs.append($media);
				}
			});
			$slide.append($imgs);

			const $mainContainer = $('<div>').addClass('content');

			const $infoContainer = $('<div>').addClass('fields');
			if (project.excerpt || project.credits) {
				const $excerpt = $('<p>').addClass('excerpt').text(project.excerpt || '');
				const $credits = $('<p>').addClass('credits').text(project.credits || '');
				$infoContainer.append($excerpt, $credits);
			}

			const $buttons = $('<div>').addClass('buttons').attr('data-index', index + 1);

			const texts = [
				buttons.button1,
				buttons.button2,
				buttons.button3
			];

			texts.forEach(text => {
				const className = text
					.toLowerCase()
					.replace(/\s+/g, '-')
					+ '-button';

				const $div = $('<div>').addClass(className);
				const $span = $('<p>').text(text);
				$div.append($span);
				$buttons.append($div);
			});

			$mainContainer.append($infoContainer, $buttons);

			$slide.append($mainContainer);
		}

		$carousel.append($slide);
	});

	const $list = $('#list');
	$list.empty();

	c.projects.forEach((project, index) => {

		if (project.fields) {
			const $fields = $('<div>').attr('data-index', index + 1);

			$fields.append($('<p>').text(project.fields.title));
			$fields.append($('<p>').text(project.fields.category));
			$fields.append($('<p>').text(project.fields.year));

			$list.append($fields);
		}

	});

	// functions

	viewModes();
	logoAnimation();
	initBlur();
	initBlurFooterHover();
	initScroll();
	initButtonStatus();
	showPostImages();
	showInfo();
	list();
	listInteractive();
	postButtons();

});

const posts = document.querySelectorAll('#gallery .post');

let largeView = true;
let smallView = false;
let info = false;

function viewModes() {

	const blurBottom = document.getElementById('blur-footer');

	const large = document.getElementById('large');
	const small = document.getElementById('small');
	const gallery = document.getElementById('gallery');

	const posts = Array.from(gallery.children);

	posts.forEach((post, index) => {

		post.dataset.index = index + 1;

		const firstImg = post.querySelector('img:first-of-type');

		function setSize() {
			const firstImgWidth = firstImg.getBoundingClientRect().width;
			post.dataset.initialMaxWidth = firstImgWidth + 'px';
			post.style.maxWidth = post.dataset.initialMaxWidth;

		}

		if (!firstImg) return;

		if (firstImg.complete && firstImg.naturalWidth !== 0) {
			setSize();
		} else {
			firstImg.addEventListener('load', setSize);
		}
	});

	// large

	large?.addEventListener('click', function () {

		if (info) return;

		largeView = true;
		smallView = false;

		posts.forEach(post => {

			post.style.height = '100%';

		});

	});

	// small

	small?.addEventListener('click', function () {

		if (info) return;

		smallView = true;
		largeView = false;

		posts.forEach(post => {

			post.style.height = '50%';

		});

	});

}

// logo animation

function logoAnimation() {

	const header = document.querySelector('header');
	const logo = document.getElementById('logo');
	const zz = document.getElementById('zz');

	if (!logo) return;

	const logoDivs = Array.from(logo.querySelectorAll('div:not(#zz)'));

	function getH1Width(div) {
		const h1 = div.querySelector('h1');
		if (!h1) return 0;
		const originalMaxWidth = div.style.maxWidth;
		const originalVisibility = div.style.visibility;
		const originalPosition = div.style.position;
		div.style.maxWidth = 'none';
		div.style.visibility = 'hidden';
		div.style.position = 'absolute';
		const width = h1.scrollWidth;
		div.style.maxWidth = originalMaxWidth;
		div.style.visibility = originalVisibility;
		div.style.position = originalPosition;
		return width;
	}

	logoDivs.forEach(div => {
		const width = getH1Width(div);
		div.dataset.realWidth = width;
		div.style.maxWidth = '0';
	});
	if (zz) {
		const width = getH1Width(zz);
		zz.dataset.realWidth = width;
		zz.style.maxWidth = width + 'px';
	}

	header?.addEventListener('mouseenter', () => {
		logoDivs.forEach(div => {
			div.style.maxWidth = div.dataset.realWidth + 'px';
		});
		if (zz) zz.style.maxWidth = '0';
	});
	header?.addEventListener('mouseleave', () => {
		logoDivs.forEach(div => {
			div.style.maxWidth = '0';
		});
		if (zz) zz.style.maxWidth = zz.dataset.realWidth + 'px';
	});
}

// blur expansion

function initBlur() {
	const headerBlur = $('header');
	headerBlur.on('mouseenter', () => headerBlur.addClass('hover'));
	headerBlur.on('mouseleave', () => headerBlur.removeClass('hover'));
}

function initBlurFooterHover() {
	const blurFooter = document.getElementById('blur-footer');
	if (!blurFooter) return;

	const hoverElements = document.querySelectorAll('#list, .buttons');

	hoverElements.forEach(el => {
		el.addEventListener('mouseenter', () => blurFooter.classList.add('hover'));
		el.addEventListener('mouseleave', () => blurFooter.classList.remove('hover'));
	});
}

// scroll horizontal en desktop

function initScroll() {
	if (window.innerWidth <= 1024) return;
	const gallery = document.querySelector("#gallery-container");
	if (!gallery) return;

	gallery.addEventListener("wheel", (event) => {
		event.preventDefault();
		gallery.scrollLeft += (event.deltaY + event.deltaX);
	});
}

// nav styles

function initButtonStatus() {
	const buttons = $('#size>*');
	buttons.on('click', function () {
		if (info) return;
		buttons.css('opacity', 'calc(1/3)');
		$(this).css('opacity', '1');
	});
}

// active post

function showPostImages() {

	const posts = document.querySelectorAll('.post');

	posts.forEach((post) => {

		const allImgs = post.querySelectorAll('img');
		const imgs = Array.from(allImgs).slice(1);
		const firstImg = allImgs[0];

		function setSize() {
			allImgs.forEach((img, index) => {
				const imgWidth = img.getBoundingClientRect().width;
				img.dataset.initialMaxWidth = imgWidth + 'px';

				if (index > 0) {
					img.style.maxWidth = '0';
				}
			});
		}

		if (allImgs.length === 0) return;

		let loaded = 0;
		allImgs.forEach(img => {
			function onLoad() {
				loaded++;
				if (loaded === allImgs.length) setSize();
			}
			if (img.complete && img.naturalWidth !== 0) {
				onLoad();
			} else {
				img.addEventListener('load', onLoad);
			}
		});

		if (firstImg) {
			firstImg.addEventListener('click', function (e) {
				e.stopPropagation();

				const mediaContainer = post.querySelector('.media');
				mediaContainer.classList.add('gap');

				if (imgs.length === 0) return;

				// const buttonsContainer = post.querySelector('.buttons');
				// buttonsContainer.classList.add('active');

				const postContent = post.querySelector('.content');
				postContent.classList.add('active');

				post.classList.add('open');
				post.style.maxWidth = '';

				imgs.forEach((img) => {
					img.style.maxWidth = img.dataset.initialMaxWidth;
				});

				posts.forEach(otherPost => {
					if (otherPost !== post) {
						gallery.style.gap = '0';
						const otherMedia = otherPost.querySelector('.media');
						otherMedia.classList.remove('gap');
						otherPost.style.maxWidth = '0';
					}
				});
			});
		}
	});

}

// info

function showInfo() {

	const infoButton = document.getElementById('info');
	const workButton = document.getElementById('work');
	const infoFields = document.getElementById('info-fields');
	const contact = document.getElementById('contact');
	const header = document.querySelector('header');
	const blurFooter = document.getElementById('blur-footer');
	const list = document.getElementById('list');

	infoButton?.addEventListener('click', () => {

		info = true;

		header.classList.add('active');

		infoFields.style.height = infoFields.scrollHeight + 'px';
		infoFields.classList.add('open');
		contact.classList.add('open');

		infoButton.style.opacity = '1';
		workButton.style.opacity = 'calc(1/3)';

		list.classList.add('info');
		blurFooter.style.transform = 'translateY(20vh)';

		// 🔹 Quitar la clase "active" solo del post abierto
		const openPost = document.querySelector('.post.open');
		if (openPost) {
			const postContent = openPost.querySelector('.content');
			if (postContent) postContent.classList.remove('active');
		}

	});

	workButton?.addEventListener('click', () => {

		info = false;

		header.classList.remove('active', 'hover');
		workButton.style.opacity = '';
		infoButton.style.opacity = '';

		infoFields.style.height = '0';
		infoFields.classList.remove('open');
		contact.classList.remove('open');

		list.classList.remove('info');
		blurFooter.style.transform = '';

		const openPost = document.querySelector('.post.open');
		if (openPost) {
			const postContent = openPost.querySelector('.content');
			if (postContent) postContent.classList.add('active');
		}

	});
}

// list 

function list() {
	const posts = $('.post');
	const listItems = $('#list>*');

	posts.on('mouseenter', function () {
		const index = $(this).data('index');
		listItems.removeClass('hover');
		listItems.filter(`[data-index="${index}"]`).addClass('hover');
	});

	listItems.on('mouseenter', function () {
		const index = $(this).data('index');
		posts.removeClass('hover');
		posts.filter(`[data-index="${index}"]`).addClass('hover');
	});

	listItems.on('mouseleave', function () {
		posts.removeClass('hover');
	});
}

function listInteractive(animationDuration = 1500) {
	const container = document.getElementById('gallery-container');
	const posts = document.querySelectorAll('#gallery .post');
	const listItems = document.querySelectorAll('#list > div');

	if (!container || posts.length === 0 || listItems.length === 0) return;

	listItems.forEach(item => {
		item.addEventListener('mouseenter', () => {

			const anyActive = Array.from(posts).some(post => post.classList.contains('open'));
			if (anyActive) return;

			const index = item.dataset.index;
			const post = document.querySelector(`#gallery .post[data-index="${index}"]`);
			
			if (!post) return;

			const postCenter = post.offsetLeft + post.offsetWidth / 2;
			const containerCenter = container.offsetWidth / 2;
			const targetScroll = postCenter - containerCenter;

			animateScroll(container, targetScroll, animationDuration);

		});

	});
}

function animateScroll(container, target, duration) {
	const start = container.scrollLeft;
	const distance = target - start;
	const startTime = performance.now();

	function easeInOutQuad(t) {
		return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
	}

	function scrollStep(currentTime) {
		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / duration, 1);
		const eased = easeInOutQuad(progress);

		container.scrollLeft = start + distance * eased;

		if (elapsed < duration) {
			requestAnimationFrame(scrollStep);
		}
	}

	requestAnimationFrame(scrollStep);
}

// post buttons

function postButtons() {
	const posts = document.querySelectorAll('#gallery .post');

	posts.forEach(post => {
		const buttonsContainer = post.querySelector('.buttons');
		const closeButton = post.querySelector('.close-button');
		const postContent = post.querySelector('.content');

		const excerptButton = post.querySelector('.info-button');
		const excerpt = post.querySelector('.excerpt');

		if (!buttonsContainer) return;

		excerptButton.addEventListener('click', () => {
			excerpt.classList.toggle('active');
		});

		closeButton.addEventListener('click', () => {

			const allImgs = post.querySelectorAll('img');
			const imgs = Array.from(allImgs).slice(1);
			imgs.forEach((img) => {
				img.style.maxWidth = '0';
			});

			excerpt.classList.remove('active');

			gallery.style.gap = '3px';
			const media = post.querySelector('.media');
			media.classList.remove('gap');
			post.classList.remove('open');

			setTimeout(() => {
				post.style.maxWidth = post.dataset.initialMaxWidth;
			}, 1000);

			posts.forEach(otherPost => {
				if (otherPost !== post) {
					otherPost.style.maxWidth = otherPost.dataset.initialMaxWidth;
				}
			});

			postContent.classList.remove('active');

		});
	});
}