// content

$(document).ready(function () {

	if (!window.content || !window.content.projects) return;

	const c = window.content;

	const $carousel = $('#feed');

	$carousel.empty();

	c.projects.forEach((project, index) => {

		const slide = $('<div>')
		.addClass('post')
		.attr('data-index', index + 1);

		// media

		if (project.media) {

			const cover = $('<div>').addClass('cover');
			const media = $('<div>').addClass('media');

			let firstImageAdded = false;

			project.media.forEach(m => {
				if (m.type === "image") {

					const img = $('<img>').attr('src', m.src);

					if (!firstImageAdded) {
						cover.append(img);
						firstImageAdded = true;
					} else {
						media.append(img);
					}
				}
			});

			if (media.children().length) {
				cover.append(media);
			}

			slide.append(cover);

		}

		if (project.fields) {

			const fields = $('<div>').addClass('caption');

			fields.append(
				$('<p>').text(index + 1 + '.')
			);

			fields.append($('<p>').addClass('title').text(project.fields.title));
			fields.append($('<p>').text(project.fields.category));
			fields.append($('<p>').text(project.fields.year));

			slide.append(fields);
		}

		$carousel.append(slide);

	});

	const $list = $('#list');
	$list.empty();

	c.projects.forEach((project, index) => {

		if (project.fields) {
			const $fields = $('<div>').attr('data-index', index + 1);

			$fields.append($('<a>').text(project.fields.title));

			$list.append($fields);
		}

	});

	// functions

	logoAnimation();
});

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
		div.style.maxWidth = '0';
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

// logo

document.addEventListener('DOMContentLoaded', logoAnimation);

// feed

// hover
$(document).on('mouseleave', '.cover', function () {

	const post = $(this).closest('.post');

	if ($('.post').hasClass('open')) return;

	if (post.scrollLeft() !== 0) {

		post.find('.media').css('transition-delay', '1.333s');

		setTimeout(() => {

			post.animate({ scrollLeft: 0 }, 1000);
			post
				.removeClass('active');

		}, 666);
	} else {

		$('.post')
			.removeClass('hide active');

	}
});

$(document).on('mouseenter', '.cover', function () {

	const post = $(this).closest('.post');

	if ($('.post').hasClass('open')) return;

	post.find('.media').css('transition-delay', '');

	$('.post').not(post)
		.addClass('hide')
		.removeClass('active open');

	post
		.removeClass('hide')
		.addClass('active');
});


// scroll
let postScroll = false;

document.addEventListener('scroll', function (e) {

	const post = e.target.closest?.('.post');

	if (!post) return;

	postScroll = post.scrollLeft !== 0;

}, true);


// open
// $(document).on('click', '.post', function () {

// 	// console.log(postScroll);

// 	const post = $(this);

// 	const isOpen = post.hasClass('open');

// 	$('body').addClass('fixed');

// 	function movePost() {
// 		$('.post').animate({ scrollLeft: 0 }, 1000);
// 	}

// 	function openPost() {
// 		post
// 			.addClass('open')
// 			.removeClass('hide');

// 		$('.post').not(post)
// 			.addClass('hide')
// 			.removeClass('open active');

// 		post.one('transitionend', () => {

// 			post.addClass('active');

// 			const windowHeight = $(window).height();
// 			const postOffsetTop = post.offset().top;
// 			const postHeight = post.outerHeight();

// 			const scrollTo =
// 				postOffsetTop + postHeight / 2 - windowHeight / 2;

// 			$('html, body').animate({ scrollTop: scrollTo }, 1000);
// 		});
// 	}

// 	function closePost() {

// 		$('body').removeClass('fixed');

// 		post.removeClass('open active');

// 		$('.post').removeClass('hide');

// 	}

// 	if (isOpen) {
// 		if (postScroll) {

// 			movePost();

// 			setTimeout(() => {
// 				closePost();
// 			}, 1000);

// 		} else {

// 			closePost();
// 			movePost();

// 		}
// 		return;
// 	}

// 	if (postScroll) {

// 		movePost();

// 		setTimeout(() => {
// 			openPost();
// 		}, 1000);

// 	} else {

// 		openPost();
// 		movePost();

// 	}

// });

function handlePost(post) {

	const isOpen = post.hasClass('open');
	const postIndex = $('.post').index(post); 

	function movePost() {
		$('.post').animate({ scrollLeft: 0 }, 1000);
	}

	function openPost() {
		$('body').addClass('fixed');

		post
			.addClass('open')
			.removeClass('hide');

		$('.post').not(post)
			.addClass('hide')
			.removeClass('open active');

		$('#list [data-index]').removeClass('active');
		$('#list [data-index="' + (postIndex + 1) + '"]').addClass('active');

		post.one('transitionend', () => {

			post.addClass('active');

			const windowHeight = $(window).height();
			const postOffsetTop = post.offset().top;
			const postHeight = post.outerHeight();

			const scrollTo =
				postOffsetTop + postHeight / 2 - windowHeight / 2;

			$('html, body').animate({ scrollTop: scrollTo }, 1000);
		});
	}

	function closePost() {
		$('body').removeClass('fixed');

		post.removeClass('open active');

		$('.post').removeClass('hide');

		$('#list [data-index]').removeClass('active');
	}

	if (isOpen) {
		if (postScroll) {
			movePost();
			setTimeout(closePost, 1000);
		} else {
			movePost();
			closePost();
		}
		return;
	}

	if (postScroll) {
		movePost();
		setTimeout(openPost, 1000);
	} else {
		movePost();
		openPost();
	}
}

$(document).on('click', '.post', function () {

	handlePost($(this));

});

$(document).on('click', '#list [data-index]', function () {

	const index = $(this).data('index') - 1;
	const post = $('.post').eq(index);

	if (!post.length) return;

	handlePost(post);

});

$(document).on('mouseenter', '#list', function () {

	const indexItems = $(this).children();

	indexItems.addClass('hover');

	$('header').addClass('active');
});

$(document).on('mouseleave', '#list', function () {

	const indexItems = $(this).children();

	indexItems.removeClass('hover');

	$('header').removeClass('active');

});

// list

// si .post está .open cambiar los mouseenter de los otros .post por click (prev/next)

// generar una función general para aplicarle setTimeout en función de si el post se ha movido o no

// if postScroll = mover > cerrar > abrir
// if !postScroll = cerrar > abrir