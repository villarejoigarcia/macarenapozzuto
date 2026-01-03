const isMobile = window.innerWidth <= 768;

// content

$(document).ready(function () {

	if (!window.content || !window.content.projects) return;

	const c = window.content;

	const $carousel = $('#feed');

	$carousel.empty();
	
	const isMobile = window.innerWidth <= 768;

	function responsive() {

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

						if (isMobile) {
							img.on('load', function () {
								const width = $(this).outerWidth();
								$(this).css('width', width + 'px');
							});
						} else {
							img.on('load', function () {
								$(this).css('width', '');
							});
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

	}

	const $list = $('#list');
	$list.empty();

	c.projects.forEach((project, index) => {

		if (project.fields) {
			const $fields = $('<div>').attr('data-index', index + 1);

			$fields.append($('<a>').text(project.fields.title));

			$list.append($fields);
		}

	});

	responsive();

	let lastIsMobile = window.innerWidth <= 768;

	$(window).on('resize', function () {

		const isMobile = window.innerWidth <= 768;
		if (isMobile !== lastIsMobile) {
			responsive();
			lastIsMobile = isMobile;
		}
	});

	// functions

	logoAnimation();

});

// logo animation

function logoAnimation() {

	const header = document.querySelector('header');
	const logo = document.getElementById('logo');
	const logoWrap = document.getElementById('logo-wrap');
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

	logoWrap?.addEventListener('mouseenter', () => {
		logoDivs.forEach(div => {
			div.style.maxWidth = div.dataset.realWidth + 'px';
		});
		if (zz) zz.style.maxWidth = '0';
	});
	logoWrap?.addEventListener('mouseleave', () => {
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

	const isMobile = window.innerWidth <= 768;

	if (!post) return;

	if (isMobile) {
		postScroll = post.scrollTop !== 0;
	} else {
		postScroll = post.scrollLeft !== 0;
	}

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

// const CLOSED_VH = 33.333;
// const OPEN_VH = 75;
// const HEIGHT_RATIO = OPEN_VH / CLOSED_VH; // 2.25

function handlePost(post) {

	const isOpen = post.hasClass('open');
	const wasOpen = $('.post').hasClass('open');
	const postIndex = $('.post').index(post); 
	const isMobile = window.innerWidth <= 768;

	function movePost() {
		if (isMobile) {
			$('.post').animate({ scrollTop: 0 }, 1000);
		} else {
			$('.post').animate({ scrollLeft: 0 }, 1000);
		}
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

		$('.single-ui').addClass('active');

		// if (isMobile) {
		// 	post
		// 		.find('.media')
		// 		.addClass('open');
		// }

		// $('#list [data-index="' + (postIndex + 1) + '"]').addClass('active');

		// function afterLayout() {
		// 	adjustScrollLeft(post);
		// 	moveFeed();
		// }
		// adjustScrollLeft(post);

		// post.one('transitionend', () => {
			// moveFeed();
		// });

		// post.one('transitionend', () => {

		function moveFeed() {

			post.addClass('active');

			const offsetTop = post.offset().top;
			const topMargin = window.innerHeight * 0.125; // 12.5vh

			const scrollTo = offsetTop - topMargin;

			if (isMobile) {
				$('html, body').animate({ scrollTop: offsetTop }, 666 * 2);
			} else {
				$('html, body').animate({ scrollTop: scrollTo }, 666 * 2);
			}

		}

		if (wasOpen) {
			post.one('transitionend', () => {
				moveFeed();
			});
			console.log('a');
		} else {
			// post.one('transitionend', () => {
				moveFeed();
				console.log('b');
			// });
		}

		// });
	}

	function closePost() {
		$('body').removeClass('fixed');

		post.removeClass('open active');

		$('.post').removeClass('hide');

		$('#list [data-index]').removeClass('active');

		$('.single-ui').removeClass('active open');
		
	}

	if (postScroll) {
		if (isOpen) return;
		movePost();
		if (wasOpen) {
			setTimeout(openPost, 1000);
		} else {
			openPost();
		}
	} else {
		if (isOpen) return;
		openPost();
	}

	// close

	$(document).on('click', '.close-btn', function () {

		if (postScroll) {
			movePost();
			setTimeout(closePost, 1000);
		} else {
			closePost();
		}

		$('header').removeClass('active');

	});
}

$(document).on('click', '.post', function () {

	handlePost($(this));

});

$(document).on('click', '#list [data-index]', function () {

	const index = $(this).data('index') - 1;
	const post = $('.post').eq(index);

	if (!post.length) return;

	handlePost(post);

	$('.single-ui').removeClass('open');

});

$(document).on('mouseenter', '#list', function () {

	const indexItems = $(this).children();

	indexItems.addClass('hover');

	$('header').addClass('active');
});

$(document).on('mouseleave', '#list', function () {

	const indexItems = $(this).children();

	indexItems.removeClass('hover');

	if ($('.single-ui').hasClass('open')) {

	} else {
		$('header').removeClass('active');
	}

});

// single 

// fields

$(document).on('click', '.info-btn', function () {

	$('.single-ui').toggleClass('open');

	if (isMobile) {
		$('#list').toggleClass('active');
	} else {
		$('header').toggleClass('active');
	}

});