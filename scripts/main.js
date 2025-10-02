// content

$(document).ready(function () {

	if (!window.content || !window.content.projects) return;
	const c = window.content;

	const $carousel = $('#gallery');
	$carousel.empty();

	c.projects.forEach((project) => {
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
		}

		// fields

		if (project.fields) {
			const $fields = $('<div>').addClass('fields');
			$fields.append($('<p>').text(project.fields.title));
			$fields.append($('<p>').text(project.fields.category));
			$fields.append($('<p>').text(project.fields.year));
			$slide.append($fields);
		}

		$carousel.append($slide);
	});

	const $list = $('#list');
	$list.empty();

	c.projects.forEach((project) => {

		if (project.fields) {
			const $fields = $('<div>');
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
	initScroll();
	initButtonStatus();
	showPostImages();
	showInfo();
});

let largeView = true;
let smallView = false;
let info = false;

function viewModes() {

	const blurBottom = document.getElementById('blur-footer');
	const list = document.getElementById('list');

	const large = document.getElementById('large');
	const small = document.getElementById('small');
	const gallery = document.getElementById('gallery');

	const posts = Array.from(gallery.children);

	// set-up initial sizes

	posts.forEach(post => {

		const firstImg = post.querySelector('img:first-of-type');

		function setSize() {

			const firstImgWidth = firstImg.getBoundingClientRect().width;
			post.dataset.initialMaxWidth = firstImgWidth + 'px';
			firstImg.style.maxWidth = post.dataset.initialMaxWidth;

			const firstImgHeight = firstImg.getBoundingClientRect().height;
			post.dataset.initialMaxHeight = firstImgHeight + 'px';
			firstImg.style.maxHeight = post.dataset.initialMaxHeight;

		};

		window.addEventListener('load', setSize);

	});

	// large

	large?.addEventListener('click', function () {

		if (info) return;

		largeView = true;
		smallView = false;

		posts.forEach(post => {

			const firstImg = post.querySelector('img:first-of-type');
			const fields = post.querySelector('.fields');
			const mediaContainer = post.querySelector('.media');

			if (!firstImg) return;

			firstImg.style.maxWidth = post.dataset.initialMaxWidth;
			firstImg.style.maxHeight = post.dataset.initialMaxHeight;
			// firstImg.style.height = '100%';

			const otherImgs = post.querySelectorAll('img:not(:first-of-type)');

			otherImgs.forEach(img => {
				img.style.maxWidth = '0';
			});

			mediaContainer.classList.remove('gap');

			fields.classList.remove('hidden');

			post.classList.remove('open');

		});

		blurBottom.style.height = '';
		list.style.opacity = '0';

	});

	// small

	small?.addEventListener('click', function () {

		if (info) return;

		smallView = true;
		largeView = false;

		posts.forEach(post => {

			const imgs = post.querySelectorAll('img');
			const fields = post.querySelector('.fields');
			const mediaContainer = post.querySelector('.media');

			if (!imgs) return;

			imgs.forEach(img => {
				img.style.maxWidth = 'calc((100vw - (3px * 7)) / 6)';
				img.style.height = 'auto';
			});

			mediaContainer.classList.add('gap');

			fields.classList.add('hidden');

			post.classList.remove('open');

		});

		blurBottom.style.height = '0';
		list.style.opacity = '1';

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

// button status en #size
function initButtonStatus() {
	const buttons = $('#size>*');
	buttons.on('click', function () {
		if (info) return;
		buttons.css('opacity', 'calc(1/3)');
		$(this).css('opacity', '1');
	});
}

function showPostImages() {

	const posts = document.querySelectorAll('.post');

	posts.forEach((post) => {

		const allImgs = post.querySelectorAll('img');
		const imgs = Array.from(allImgs).slice(1);

		function setSize() {

			allImgs.forEach((img, index) => {
				const imgWidth = img.getBoundingClientRect().width;
				img.dataset.initialMaxWidth = imgWidth + 'px';

				if (index > 0) {
					img.style.maxWidth = '0';
					img.style.height = '0';
				}
			});

		};

		window.addEventListener('load', setSize);

		post.addEventListener('click', function () {

			const mediaContainer = post.querySelector('.media');

			if (imgs.length === 0) return;

			if (largeView === true) {

				imgs.forEach(img => {
					img.style.maxWidth = img.dataset.initialMaxWidth;
					img.style.height = 'auto';
				});

				mediaContainer.classList.add('gap');

				const isOpen = post.classList.contains('open');

				if (isOpen) {

					post.classList.remove('open');

					mediaContainer.classList.remove('gap');

					imgs.forEach((img) => {
						img.style.maxWidth = '0';
					});

					posts.forEach(otherPost => {
						if (otherPost !== post) {

							gallery.style.gap = '3px';

							const otherImgs = otherPost.querySelectorAll('img');
							const otherMedia = otherPost.querySelector('.media');
							const fields = otherPost.querySelector('.fields');

							otherMedia.classList.remove('gap');
							fields.classList.remove('hidden');

							otherImgs.forEach((img,index) => {
								if (index === 0) {
									img.style.maxWidth = img.dataset.initialMaxWidth;
								}
							});

						}
					});

				} else {

					post.classList.add('open');

					imgs.forEach((img) => {
						img.style.maxWidth = img.dataset.initialMaxWidth;
					});

					posts.forEach(otherPost => {
						if (otherPost !== post) {

							gallery.style.gap = '0';

							const otherImgs = otherPost.querySelectorAll('img');
							const otherMedia = otherPost.querySelector('.media');
							const fields = otherPost.querySelector('.fields');

							otherMedia.classList.remove('gap');

							fields.classList.add('hidden');

							otherImgs.forEach(img => {
								img.style.maxWidth = '0';
								img.style.height = 'auto';
							});

						}
					});

				}

			}

		});

	});

}

// info

function showInfo() {

	const infoButton = document.getElementById('info');
	const workButton = document.getElementById('work');
	const infoFields = document.getElementById('info-fields');
	const contact = document.getElementById('contact');
	const header = document.querySelector('header');
	const fields = document.querySelectorAll('.fields');
	const blurFooter = document.getElementById('blur-footer');

	const list = document.getElementById('list');

	infoButton?.addEventListener('click', () => {

		info = true;

		console.log(info);

		header.style.paddingBottom = '200vh';

		infoFields.style.height = infoFields.scrollHeight + 'px';
		infoFields.classList.add('open');

		contact.classList.add('open');

		infoButton.style.opacity = '1';
		workButton.style.opacity = 'calc(1/3)';

		fields.forEach(field => {
			field.classList.add('info');
		});

		blurFooter.style.transform = 'translateY(20vh)';

		list.style.opacity = '0';

	});

	workButton?.addEventListener('click', () => {

		info = false;

		console.log(info);

		header.style.paddingBottom = '';
		workButton.style.opacity = '';

		infoFields.style.height = '0';
		infoFields.classList.remove('open');

		contact.classList.remove('open');

		infoButton.style.opacity = '';

		fields.forEach(field => {
			field.classList.remove('info');
		});

		blurFooter.style.transform = '';

		list.style.opacity = '1';

	});
}