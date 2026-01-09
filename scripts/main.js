const isMobile = window.innerWidth <= 768;

// content

$(document).ready(function () {

	if (!window.content || !window.content.projects) return;

	const c = window.content;

	const $carousel = $('#feed');

	const archive = $('#archive');

	$carousel.empty();
	
	const isMobile = window.innerWidth <= 768;

	function responsive() {

		// feed

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

		// archive
		function shuffle(array) {
			const arr = array.slice();
			for (let i = arr.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[arr[i], arr[j]] = [arr[j], arr[i]];
			}
			return arr;
		}

		const allMedia = [];

		c.projects.forEach(project => {
			project.media?.forEach(m => allMedia.push(m));
		});

		// shuffle
		function shuffleArchive() {

			archive.empty();

			shuffle(allMedia).forEach(m => {

				const media = $('<div>');

				if (m.type === 'image') {
					media.append($('<img>').attr('src', m.src));
				}

				archive.append(media);
			});
		}

		$(document).on('click', '#archive-btn', function () {

			if ($('#about, #archive').hasClass('active')) return;

			shuffleArchive();

		});

		// shuffle();

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

// document.addEventListener('DOMContentLoaded', logoAnimation);

// feed

// hover

$(document).on('mouseenter touchstart', '.cover>img', function () {

	const post = $(this).closest('.post');
	const prevPost = $('.post').filter('.active');

	if ($('.post').hasClass('open')) return;

	post.find('.media').css('transition-delay', '');

	// $('.post').not(post)
	// 	.addClass('hide');

	// post
	// 	.removeClass('hide')
	// 	.addClass('active');

	// if (!isMobile) {
	// 	post.off('wheel.postScroll').on('wheel.postScroll', function (event) {
	// 		event.preventDefault();
	// 		this.scrollLeft += (event.originalEvent.deltaY + event.originalEvent.deltaX);
	// 	});
	// }

	if (!isMobile) {
		let isDragging = false;
		let dragMoved = false;
		let startX;
		let scrollStart;

		post.off('.dragScroll');
		post.find('img').attr('draggable', false);

		post.on('mousedown.dragScroll', function (e) {
			isDragging = true;
			dragMoved = false;
			startX = e.pageX;
			scrollStart = this.scrollLeft;
		});

		$(document).on('mousemove.dragScroll', (e) => {
			if (!isDragging) return;
			const dx = e.pageX - startX;
			if (Math.abs(dx) > 5) dragMoved = true;
			post[0].scrollLeft = scrollStart - dx;
		});

		$(document).on('mouseup.dragScroll', () => {
			isDragging = false;
		});

		post.on('click.dragScroll', function (e) {
			if (dragMoved) {
				e.preventDefault();
				e.stopImmediatePropagation();
				dragMoved = false;
			}
		});
	}

	if (postScroll) {

		setTimeout(() => {
			$('.post').not(post)
				.addClass('hide')
				.removeClass('active');

			if ($('.post').hasClass('open')) return;

			post
				.removeClass('hide')
				.addClass('active');

		}, 1000);

		console.log('delay');

	} else {

		$('.post').not(post)
			.addClass('hide')
			.removeClass('active');

		post
			.removeClass('hide')
			.addClass('active');

		console.log('noDelay');
	}

});

$(document).on('mouseleave', '.cover', function () {

	const post = $(this).closest('.post');
	// const prevPost = post.filter('.active');

	if ($('.post').hasClass('open')) return;

	if (postScroll) {

		// post.animate({ scrollLeft: 0 }, 1000, function () {
		// 	post.removeClass('active');
		// 	$('.post').not(post).removeClass('hide');
		// });

		post.animate({ scrollLeft: 0 }, 1000);

		setTimeout(() => {

			post.removeClass('active');

			if (!post.hasClass('open')) {
				$('.post').removeClass('hide');
			} 

		}, 1000);
	
		console.log('scroll+out');

	} else {

		post.removeClass('active');
		$('.post').removeClass('hide');

		console.log('out');

	}

	// post.off('wheel.postScroll');
	post.off('.dragScroll');

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
	const otherPost = post.hasClass('hide');
	const currentList = $('#list [data-index="' + (postIndex + 1) + '"]');
	const allList = $('#list [data-index]');
	const isMobile = window.innerWidth <= 768;
	const prevPost = allPosts.filter('.open');

	function movePost(callback) {

		// const prevPost = allPosts.filter('.open');

		if (isMobile) {
			if (otherPost) {
				prevPost.animate({ scrollTop: 0 }, 1000, callback);
			} else {
				post.animate({ scrollTop: 0 }, 1000, callback);
			}
		} else {
			if (otherPost) {
				prevPost.animate({ scrollLeft: 0 }, 1000, callback);
			} else {
				post.animate({ scrollLeft: 0 }, 1000, callback);
			}
		}

	}

	function moveFeed(callback) {

		const offsetTop = post.offset().top;
		const topMargin = window.innerHeight * 0.125;
		const scrollTo = offsetTop - topMargin;

		if (isMobile) {
			html.animate({ scrollTop: offsetTop }, 1000, callback);
		} else {
			html.animate({ scrollTop: scrollTo }, 1000, callback);
		}
	}

	function openPost() {

		if (isMobile) {

			const img = post.find('.cover>img');

			if (!img.length) return;

			if (otherPost) {
				setTimeout(() => {

					const imgHeight = img.outerHeight();

					post.height(imgHeight);

					setTimeout(() => {
						post.css('height', '100dvh');
					}, 10);

				}, 1000 * 2);
				// console.log('scroll');
			} else {
				setTimeout(() => {

					const imgHeight = img.outerHeight();

					post.height(imgHeight);

					setTimeout(() => {
						post.css('height', '100dvh');
					}, 10);

				}, 1000);
				// console.log('noScroll');
			}

		}

		html.addClass('fixed');

		if (otherPost) {

			// const prevPost = allPosts.filter('.open');

			if (isMobile) {

				const otherImg = prevPost.find('.cover > img').first();
				if (!otherImg.length) return;
				const imgHeight = otherImg.outerHeight();
				prevPost.height(imgHeight);

				setTimeout(() => {
					prevPost.css('height', '');
				}, 1000);

				setTimeout(() => {
					prevPost
						.addClass('hide')
						.removeClass('open');

					post
						.addClass('open')
						.removeClass('hide active');
				}, 1000);

			} else {

				prevPost
					.addClass('hide')
					.removeClass('open active');

				post
					.addClass('open')
					.removeClass('hide active');

			}

			console.log('next>slide');

		} else {

			post
				.addClass('open')
				.removeClass('hide active');

			console.log('next>open');

		}

		allList.removeClass('active');
		currentList.addClass('active');

		$('.single-ui').addClass('active');

		if (!isMobile) {
			let isDragging = false;
			let dragMoved = false;
			let startX;
			let scrollStart;

			post.off('.dragScroll');
			post.find('img').attr('draggable', false);

			post.on('mousedown.dragScroll', function (e) {
				isDragging = true;
				dragMoved = false;
				startX = e.pageX;
				scrollStart = this.scrollLeft;
			});

			$(document).on('mousemove.dragScroll', (e) => {
				if (!isDragging) return;
				const dx = e.pageX - startX;
				if (Math.abs(dx) > 5) dragMoved = true;
				post[0].scrollLeft = scrollStart - dx;
			});

			$(document).on('mouseup.dragScroll', () => {
				isDragging = false;
			});

			post.on('click.dragScroll', function (e) {
				if (dragMoved) {
					e.preventDefault();
					e.stopImmediatePropagation();
					dragMoved = false;
				}
			});
		}

	}

	// isOpen
	if (isOpen) return;

	if (!isMobile) {
		
		// isScroll
		if (postScroll && otherPost) {

			prevPost.one('transitionend', () => {
				moveFeed();
			});

			movePost(() => {
				openPost();
			});

			console.log('scroll+open');

		} else if (otherPost) {

			prevPost.one('transitionend', () => {
				moveFeed();
			});

			openPost();

			// openPost(() => {
			// 	moveFeed();
			// });

			console.log('slide');

		} else if (postScroll) {
			
			movePost(() => {
				openPost();	
				moveFeed();		
			});

			console.log('extra');

		} else {

			moveFeed();
			openPost();

			console.log('open');

		}

	} else {

		if (otherPost) {

			if (postScroll) {

				movePost(() => {

					post.one('transitionend', () => {
						moveFeed();
					});

					openPost();

				});
			} else {

				post.one('transitionend', () => {
					moveFeed();
				});

				openPost();

			}


		} else {

			moveFeed();
			openPost();

		}
	}

	// close
	function closePost() {

		if (!isMobile) {

			post.removeClass('open active');

		} else {
			const img = post.find('.cover > img');

			if (!img.length) return;

			const imgHeight = img.outerHeight();

			post.height(imgHeight);

			setTimeout(() => {

				post.removeClass('open active');
				post.css('height', '');

			}, 1000);

		}

		html.removeClass('fixed');

		allPosts.removeClass('hide');

		allList.removeClass('active');

		$('.single-ui').removeClass('active open');

	}

	if (!isMobile) {

		post.off('wheel.postScroll').on('wheel.postScroll', function (event) {

			event.preventDefault();
			this.scrollLeft += (event.originalEvent.deltaY + event.originalEvent.deltaX);

		});

		allPosts.not(post).off('wheel.postScroll');

	}

	$(document).one('click', '.close-btn, .post', function (e) {

		const isPost = $(this).is('.post');

		if (isPost && e.target !== this) return;

		if (postScroll) {

			movePost(() => {
				closePost();
				// $('header').removeClass('active');
				$('#overlay').removeClass('single');
			});

		} else {

			closePost();
			// $('header').removeClass('active');
			$('#overlay').removeClass('single');
			
		}

		allPosts.off('wheel.postScroll');

	});
	
}

// $(document).on('click', '.post.active', function () {

// 	handlePost($(this));

// });

$(document).on('click', '.post.active .cover, .post.hide .cover>img', function () {

	const post = $(this).closest('.post');
	handlePost(post);

});

$(document).on('click', '#list [data-index]', function () {

	const index = $(this).data('index') - 1;
	const post = $('.post').eq(index);

	if (!post.length) return;

	handlePost(post);

	$('.single-ui').removeClass('open');

});

function openList() {
	
	if (isMobile && $('.single-ui').hasClass('open')) return;

	const indexItems = $('#list').children();

	indexItems.addClass('hover');

	// $('header').addClass('active');
	$('#overlay').addClass('single');
}

function closeList() {

	const indexItems = $('#list').children();

	indexItems.removeClass('hover');

	if ($('.single-ui').hasClass('open')) {

	} else {
		// $('header').removeClass('active');
		$('#overlay').removeClass('single');
	}

}

$(document).on('mouseenter', '#list', function () {

	openList();
	
});

$(document).on('mouseleave', '#list', function () {

	closeList();

});

// buttons

const menuButtons = $('#nav>*');
const archive = $('#archive');
const projects = $('#front-page');
const about = $('#about');
const postButtons = $('.single-ui');
const overlay = $('#overlay');

menuButtons.on('click', function () {

	$(this).addClass('active');
	menuButtons.not(this).removeClass('active');

	// const index = $(this).data('index');

	// $(this).siblings().removeClass('active');
	// $(this).addClass('active');

	// $('main>*').removeClass('active');
	// $(`main>*[data-index="${index}"]`).addClass('active');

});

// post
$(document).on('click', '.info-btn', function () {

	postButtons.toggleClass('open');
	$('#overlay').toggleClass('single');

});

// projects
$(document).on('click', '#projects-btn', function () {

	archive.one('transitionend', () => {
		if (archive.hasClass('active')) return;
		projects.addClass('active');

	});

	$('main>*').not(projects).removeClass('active');

	$('html').removeClass('fixed');

	if (postButtons.hasClass('open')) {
		overlay
			.removeClass('about')
			.addClass('single');
	}

	if (postButtons.hasClass('active')) {
		about.one('transitionend', () => {
			postButtons.removeClass('about');
		});
	} else {
		postButtons.removeClass('about');
	}

});

// about
$(document).on('click', '#about-btn', function () {

	function openAbout() {
		about.addClass('active');

		overlay
			.addClass('about')
			.removeClass('single');

	}

	if (postButtons.hasClass('active')) {
		postButtons.addClass('about');
		postButtons.one('transitionend', () => {
			openAbout();
		});
	} else {
		postButtons.addClass('about');
		openAbout();
	}

});

$(document).on('click', '#nav>*:not(#about-btn)', function () {

	about.removeClass('active');
	overlay.removeClass('about');
	// postButtons.removeClass('about');

});

$(document).on('click', '#about', function (e) {

	if (e.target !== this) return;

	about.removeClass('active');
	overlay.removeClass('about');
	postButtons.removeClass('about');

	const index = $('main>*.active').data('index');

	$('#nav>*').removeClass('active');
	$(`#nav>*[data-index="${index}"]`).addClass('active');

});

// archive
$(document).on('click', '#archive-btn', function () {

	const posts = $('.post');

	projects.one('transitionend', () => {

		if (projects.hasClass('active')) return;

		$('html').scrollTop(0);

		posts
			.removeClass('open hide active')
			.scrollLeft(0)
			.off('wheel.postScroll')
			.off('.dragScroll');

			postButtons.removeClass('active open');

			$('#list>*').removeClass('active');

		if (isMobile) {
			posts.css('height', '');
		}

		if (about.hasClass('active')) return;

		archive
			.addClass('active')
			.scrollTop(0);

	});

	postButtons.addClass('about');

	$('main>*').not(archive).removeClass('active');

	overlay.removeClass('single');

	$('html').addClass('fixed');

});

$(document).on('click', '#archive>*', function () {

	$(this).toggleClass('active');

});