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

		}, 1000);
	} else {

		$('.post')
			.removeClass('hide active');

	}
});

$(document).on('mouseenter touchstart', '.cover', function () {

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

// post
function handlePost(post) {
	
	const html = $('html');
	const allPosts = $('.post');
	const postIndex = $('.post').index(post);
	const isOpen = post.hasClass('open');
	const currentList = $('#list [data-index="' + (postIndex + 1) + '"]');
	const allList = $('#list [data-index]');
	const isMobile = window.innerWidth <= 768;

	function movePost(callback) {

		if (isMobile) {
			allPosts.animate({ scrollTop: 0 }, 1000, callback);
		} else {
			allPosts.animate({ scrollLeft: 0 }, 1000, callback);
		}

	}

	function moveFeed() {

		const offsetTop = post.offset().top;
		const topMargin = window.innerHeight * 0.125;
		const scrollTo = offsetTop - topMargin;

		if (isMobile) {
			html.animate({ scrollTop: offsetTop }, 1000);
		} else {
			html.animate({ scrollTop: scrollTo }, 1000);
		}
	}

	function openPost() {

		html.addClass('fixed');

		post
			.addClass('open')
			.removeClass('hide active');

		allPosts.not(post)
			.addClass('hide')
			.removeClass('open');

		allList.removeClass('active');
		currentList.addClass('active');

		$('.single-ui').addClass('active');

	}

	// isOpen
	if (isOpen) return;

	post.one('transitionend', () => {
		moveFeed();
	});
	
	// isScroll
	if (postScroll) {

		movePost(() => {
			openPost();
		});

	} else {

		openPost();

	}

	// close
	function closePost() {

		html.removeClass('fixed');

		post.removeClass('open active');

		allPosts.removeClass('hide');

		allList.removeClass('active');

		$('.single-ui').removeClass('active open');
		
	}

	$(document).one('click', '.close-btn', function () {

		if (postScroll) {

			movePost(() => {
				closePost();
				$('header').removeClass('active');
			});

		} else {

			closePost();
			$('header').removeClass('active');
			
		}

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