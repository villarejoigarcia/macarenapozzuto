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
				// const $credits = $('<p>').addClass('credits').text(project.credits || '');
				$infoContainer.append($excerpt);
			}

			const $buttons = $('<div>').addClass('buttons').attr('data-index', index + 1);

			const texts = [
				{ key: 'info', value: buttons.info },
			];

			texts.forEach(item => {
				const { key, value } = item;
				if (!value) return;

				const className = key
					.toLowerCase()
					.replace(/\s+/g, '-') 
					+ '-button';

				const $div = $('<div>').addClass(className);
				const $span = $('<a>').text(value);
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
	// initBlur();
	initBlurFooterHover();
	initScroll();
	initButtonStatus();
	showPostImages();
	showInfo();
	list();
	listInteractive();
	postButtons();

});


// scroll horizontal en desktop

let openPost = false;

function initScroll() {
	if (window.innerWidth <= 1024) return;
	const gallery = document.querySelector("#gallery-container");
	if (!gallery) return;

	gallery.addEventListener("wheel", (event) => {
		event.preventDefault();
		if (openPost) return;
		gallery.scrollLeft += (event.deltaY + event.deltaX);
	});
}

function initPostScroll(post) {
	if (window.innerWidth <= 1024) return;
	if (!post) return;

	// Evitar múltiples listeners duplicados
	if (post._hasScrollListener) return;
	post._hasScrollListener = true;

	post.addEventListener("wheel", (event) => {
		if (!openPost) return;
		event.preventDefault();
		post.scrollLeft += (event.deltaY + event.deltaX);
	});
}

// view mode

const posts = document.querySelectorAll('#gallery .post');

let largeView = true;
let smallView = false;
let info = false;

function viewModes() {

	const large = document.getElementById('large');
	const small = document.getElementById('small');
	const gallery = document.getElementById('gallery');

	const posts = Array.from(gallery.children);

	posts.forEach((post, index) => {

		post.dataset.index = index + 1;

		const firstImg = post.querySelector('img:first-of-type');

		function setSize() {
			if (window.innerWidth <= 1024) {
				const firstImgHeight = firstImg.getBoundingClientRect().height;
				post.dataset.initialMaxHeight = firstImgHeight + 'px';

				post.style.maxHeight = post.dataset.initialMaxHeight;
				firstImg.style.maxHeight = post.dataset.initialMaxHeight;

			} else {
				const firstImgWidth = firstImg.getBoundingClientRect().width;
				post.dataset.initialMaxWidth = firstImgWidth + 'px';

				post.style.maxWidth = post.dataset.initialMaxWidth;
				firstImg.style.maxWidth = post.dataset.initialMaxWidth;
			}
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
		if (info || largeView) return;
		smallView = false;
		largeView = true;

		const openPost = Array.from(posts).find(post => post.classList.contains('open'));

		posts.forEach(post => {
			post.style.height = '100%';

			// actualizar siempre dataset del post
			const postInitial = parseFloat(post.dataset.initialMaxWidth);
			if (!isNaN(postInitial)) {
				post.dataset.initialMaxWidth = (postInitial * 3) + 'px';
			}

			// actualizar dataset y style.maxWidth de todas las imágenes
			const imgs = post.querySelectorAll('img');
			let totalWidth = 0;
			imgs.forEach(img => {
				const imgInitial = parseFloat(img.dataset.initialMaxWidth);
				if (!isNaN(imgInitial)) {
					const newImgWidth = imgInitial * 3;
					img.dataset.initialMaxWidth = newImgWidth + 'px';
					img.style.maxWidth = newImgWidth + 'px'; // 🔹 aplicar siempre
					totalWidth += newImgWidth;
				}
			});

			if (openPost && post === openPost) {
				// post abierto: maxWidth = suma de sus imágenes
				post.style.maxWidth = totalWidth + 'px';
			} else if (!post.classList.contains('closed')) {
				// solo actualizamos maxWidth si el post no está cerrado
				post.style.maxWidth = post.dataset.initialMaxWidth;
			}
		});
	});

	// small
	small?.addEventListener('click', function () {
		if (info || smallView) return;
		smallView = true;
		largeView = false;

		const openPost = Array.from(posts).find(post => post.classList.contains('open'));

		posts.forEach(post => {
			post.style.height = 'calc(100%/3)';

			// actualizar dataset del post
			const postInitial = parseFloat(post.dataset.initialMaxWidth);
			if (!isNaN(postInitial)) {
				post.dataset.initialMaxWidth = (postInitial / 3) + 'px';
			}

			// actualizar dataset de todas las imágenes
			const imgs = post.querySelectorAll('img');
			let totalWidth = 0;
			imgs.forEach(img => {
				const imgInitial = parseFloat(img.dataset.initialMaxWidth);
				if (!isNaN(imgInitial)) {
					const newImgWidth = imgInitial / 3;
					img.dataset.initialMaxWidth = newImgWidth + 'px';
					// solo aplicamos style.maxWidth a las imágenes del post abierto
					if (openPost && post === openPost) img.style.maxWidth = newImgWidth + 'px';
					totalWidth += newImgWidth;
				}
			});

			if (openPost && post === openPost) {
				post.style.maxWidth = totalWidth + 'px';
			} else if (!openPost) {
				post.style.maxWidth = post.dataset.initialMaxWidth;
			}
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

function initBlurFooterHover() {

	const headerBlur = document.querySelector('header');
	const blurFooter = document.getElementById('blur-footer');
	const listItems = document.querySelectorAll('#list>*');

	if (!headerBlur || !blurFooter) return;

	const viewportHeight = window.innerHeight;
	const viewportWidth = window.innerWidth;
	const triggerFooter = viewportHeight * 0.8;

	window.addEventListener('mousemove', (e) => {
		const isInLeftHalf = e.clientX <= viewportWidth / 2; // 🟢 solo mitad izquierda

		if (e.clientY >= triggerFooter && isInLeftHalf) {
			blurFooter.classList.add('active');

			listItems.forEach(listItem => {
				listItem.classList.add('open');
			});
		} else {
			blurFooter.classList.remove('active');

			listItems.forEach(listItem => {
				listItem.classList.remove('open');
			});
		}
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

// cursor status

const cursorText = document.createElement('p');
cursorText.style.position = 'fixed';
cursorText.style.pointerEvents = 'none';
cursorText.style.zIndex = '1000';
cursorText.style.margin = '0';
document.body.appendChild(cursorText);

function updateCursorText(post, e) {
	if (window.innerWidth > 1024) {
		const text = post.classList.contains('open') ? 'Close' : 'Open';
		cursorText.textContent = text;
		cursorText.style.left = e.clientX + 'px';
		cursorText.style.top = e.clientY + 'px';
	}
}

// open post

function showPostImages() {

	const posts = document.querySelectorAll('.post');
	const container = document.querySelector('#gallery-container');
	const isMobile = window.innerWidth <= 1024;

	posts.forEach((post) => {

		const allImgs = post.querySelectorAll('img');
		const imgs = Array.from(allImgs).slice(1);
		const postContent = post.querySelector('.content');

		function setSize() {
			allImgs.forEach((img, index) => {
				if (isMobile) {
					const h = img.getBoundingClientRect().height;
					img.dataset.initialMaxHeight = h + 'px';

					if (index > 0) img.style.maxHeight = '0';
				} else {
					const w = img.getBoundingClientRect().width;
					img.dataset.initialMaxWidth = w + 'px';

					if (index > 0) img.style.maxWidth = '0';
				}
			});
		}

		if (allImgs.length === 0) return;

		const mediaContainer = post.querySelector('.media');
		if (mediaContainer) {
			mediaContainer.addEventListener('mouseenter', () => {
				cursorText.style.display = 'block';
				mediaContainer.addEventListener('mousemove', (e) => {
					updateCursorText(post, e);
				});
			});

			mediaContainer.addEventListener('mouseleave', () => {
				cursorText.style.display = 'none';
				mediaContainer.removeEventListener('mousemove', updateCursorText);
			});
		}

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

			img.addEventListener('click', function (e) {

				const images = post.querySelectorAll('img');
				let totalMaxWidth = 0;

				images.forEach(img => {
					const value = parseFloat(img.dataset.initialMaxWidth);
					if (!isNaN(value)) totalMaxWidth += value;
				});

				// scroll gallery container

				// function smoothScrollTo(container, target, duration = 1500) {
				// 	const start = container.scrollLeft;
				// 	const distance = target - start;
				// 	const startTime = performance.now();

				// 	function easeInOutQuad(t) {
				// 		return t < 0.5
				// 			? 2 * t * t
				// 			: 1 - Math.pow(-2 * t + 2, 2) / 2;
				// 	}

				// 	function animate(time) {
				// 		const elapsed = time - startTime;
				// 		const progress = Math.min(elapsed / duration, 1);
				// 		const eased = easeInOutQuad(progress);

				// 		container.scrollLeft = start + distance * eased;

				// 		if (progress < 1) {
				// 			requestAnimationFrame(animate);
				// 		}
				// 	}

				// 	requestAnimationFrame(animate);
				// }

				function smoothScrollTo(container, target, duration = 1500) {

					const isMobile = window.innerWidth <= 1024;

					const start = isMobile ? container.scrollTop : container.scrollLeft;
					const distance = target - start;
					const startTime = performance.now();

					function easeInOutQuad(t) {
						return t < 0.5
							? 2 * t * t
							: 1 - Math.pow(-2 * t + 2, 2) / 2;
					}

					function animate(time) {
						const elapsed = time - startTime;
						const progress = Math.min(elapsed / duration, 1);
						const eased = easeInOutQuad(progress);

						if (isMobile) {
							container.scrollTop = start + distance * eased;
						} else {
							container.scrollLeft = start + distance * eased;
						}

						if (progress < 1) {
							requestAnimationFrame(animate);
						}
					}

					requestAnimationFrame(animate);
				}

				// 251121 0933

				// 1: restar el offsetLeft del container con el offsetLeft del active post
				// 2: abrir el post activo con un max-width de 100vw
				// 3: overflow: scroll en el post activo para que se haga scroll en el post y no en la gallery
				// Small: Mostar todas las imagenes abiertas y jerarquizar los post activos mediante tamaño, opacidad, etc.

				//

				// const postCenter = post.offsetLeft;
				// const containerCenter = container.offsetLeft;
				// const targetScroll = postCenter - containerCenter;

				let targetScroll;

				if (isMobile) {
					// En mobile → scroll vertical
					targetScroll = post.offsetTop - container.offsetTop;
				} else {
					// Desktop → scroll horizontal
					targetScroll = post.offsetLeft - container.offsetLeft;
				}

				setTimeout(() => {
					smoothScrollTo(container, targetScroll, 1000);
				}, 250);

				const isOpen = post.classList.contains('open');

				const isClosed = Array.from(posts).some(otherPost =>
					otherPost !== post && otherPost.classList.contains('closed')
				);
				e.stopPropagation();

				function closePost() {
					const excerpt = post.querySelector('.excerpt');
					const allImgs = post.querySelectorAll('img');
					const imgs = Array.from(allImgs).slice(1);
					const blurFooter = document.querySelector('#blur-footer');

					// imgs.forEach((img) => {
					// 	img.style.maxWidth = '0';
					// });

					if (isMobile) {
						imgs.forEach(img => img.style.maxHeight = '0');
						post.style.maxHeight = post.dataset.initialMaxHeight;
					} else {
						imgs.forEach(img => img.style.maxWidth = '0');
						post.style.maxWidth = post.dataset.initialMaxWidth;
					}

					const excerptButton = post.querySelector('.info-button');
					const buttonText = excerptButton.querySelector('a');

					buttonText.textContent = "+ Info";

					excerpt.classList.remove('active');
					excerpt.style.height = '0';
					blurFooter.classList.remove('about');

					post.classList.remove('open');
					post.style.maxWidth = post.dataset.initialMaxWidth;

					posts.forEach(otherPost => {
						if (otherPost !== post) {
							otherPost.classList.remove('closed');

							if (isMobile) {
								otherPost.style.maxHeight = otherPost.dataset.initialMaxHeight;
								otherPost.querySelector('img').style.maxHeight = otherPost.dataset.initialMaxHeight;
							} else {
								otherPost.style.maxWidth = otherPost.dataset.initialMaxWidth;
								otherPost.querySelector('img').style.maxWidth = otherPost.dataset.initialMaxWidth;
							}
	
						}
					});

					postContent.classList.remove('active');
				}

				if (isOpen) {

					openPost = false;

					console.log('close');

					container.style.overflow = "scroll";

					if (isMobile) {

						// MOBILE → scroll vertical
						if (post.scrollTop !== 0) {

							smoothScrollTo(post, 0, 1000);

							setTimeout(() => {
								closePost();
							}, 500);

						} else {
							closePost();
						}

					} else {

						// DESKTOP → scroll horizontal
						if (post.scrollLeft !== 0) {

							smoothScrollTo(post, 0, 1000);

							setTimeout(() => {
								closePost();
							}, 500);

						} else {
							closePost();
						}
					}

				} else if (!isOpen && !isClosed) {

					openPost = true;

					console.log('open');

					container.style.overflow = "hidden";

					post.dataset.previousScroll = container.scrollLeft;

					post.classList.add('open');
					initPostScroll(post);

					if (imgs.length === 0) return;

						const postContent = post.querySelector('.content');
						postContent.classList.add('active');

					if (isMobile) {
						post.style.maxHeight = '100dvh';
						imgs.forEach(img => img.style.maxHeight = img.dataset.initialMaxHeight);
					} else {
						post.style.maxWidth = '100vw';
						imgs.forEach(img => img.style.maxWidth = img.dataset.initialMaxWidth);
					}

				}

			});

		});

	});

}

// list 

function list() {
	const posts = $('.post');
	const listItems = $('#list>*');

	posts.on('mouseenter', function () {
		const index = $(this).data('index');
		listItems.removeClass('hover');
		listItems.removeClass('active');
		listItems.filter(`[data-index="${index}"]`).addClass('hover');
		listItems.filter(`[data-index="${index}"]`).addClass('active');
	});

	listItems.on('mouseenter', function () {
		const index = $(this).data('index');
		// posts.removeClass('hover');
		posts.filter(`[data-index="${index}"]`).addClass('hover');
	});

	// listItems.on('mouseleave', function () {
	// 	posts.removeClass('hover');
	// });
}

function listInteractive(animationDuration = 1500) {
	const container = document.getElementById('gallery-container');
	const posts = document.querySelectorAll('#gallery .post');
	const listItems = document.querySelectorAll('#list > div');

	if (!container || posts.length === 0 || listItems.length === 0) return;

	const isMobile = window.innerWidth <= 1024;

	listItems.forEach(item => {
		item.addEventListener('click', () => {

			listItems.forEach(i => i.classList.remove('active'));
			item.classList.add('active');

			const anyActive = Array.from(posts).some(post => post.classList.contains('open'));
			const index = item.dataset.index;
			const post = document.querySelector(`#gallery .post[data-index="${index}"]`);
			if (!post) return;

			if (anyActive) {

				console.log('list');

				const imgs = post.querySelectorAll('img');
				const postContent = post.querySelector('.content');

				postContent.classList.add('active');

				let totalSize = 0;
				// const isMobile = window.innerWidth <= 1024;

				imgs.forEach((img) => {
					if (isMobile) {
						img.style.maxHeight = img.dataset.initialMaxHeight;
						const value = parseFloat(img.dataset.initialMaxHeight);
						if (!isNaN(value)) totalSize += value;
					} else {
						img.style.maxWidth = img.dataset.initialMaxWidth;
						const value = parseFloat(img.dataset.initialMaxWidth);
						if (!isNaN(value)) totalSize += value;
					}
				});

				// 251121 1121

				// post.style.maxWidth = totalMaxWidth + 'px';

				//

				// post.style.paddingLeft = '';

				post.classList.remove('closed');
				post.classList.add('open');
				initPostScroll(post);

				// const postsArray = Array.from(posts);

				// postsArray.forEach((otherPost, index) => {
				// 	const postContent = otherPost.querySelector('.content');

				// 	if (otherPost !== post) {

				// 		otherPost.style.maxWidth = '0';
				// 		otherPost.style.paddingLeft = '0';

				// 		otherPost.classList.remove('open');
				// 		otherPost.classList.add('closed');
				// 		postContent.classList.remove('active');
				// 	}
				// });

				// scroll gallery container

				function smoothScrollTo(container, target, duration = 1500) {
					// const isMobile = window.innerWidth <= 1024;

					const start = isMobile ? container.scrollTop : container.scrollLeft;
					const distance = target - start;
					const startTime = performance.now();

					function easeInOutQuad(t) {
						return t < 0.5
							? 2 * t * t
							: 1 - Math.pow(-2 * t + 2, 2) / 2;
					}

					function animate(time) {
						const elapsed = time - startTime;
						const progress = Math.min(elapsed / duration, 1);
						const eased = easeInOutQuad(progress);

						if (isMobile) {
							container.scrollTop = start + distance * eased;
						} else {
							container.scrollLeft = start + distance * eased;
						}

						if (progress < 1) {
							requestAnimationFrame(animate);
						}
					}

					requestAnimationFrame(animate);
				}

				setTimeout(() => {

					if (isMobile) {
						post.style.maxHeight = '100dvh'; // altura máxima en mobile
						const postCenter = post.offsetTop;
						const containerCenter = container.offsetTop;
						const targetScroll = postCenter - containerCenter;

						smoothScrollTo(container, targetScroll, 1000);
					} else {
						post.style.maxWidth = '100vw'; // ancho máximo en desktop
						const postCenter = post.offsetLeft;
						const containerCenter = container.offsetLeft;
						const targetScroll = postCenter - containerCenter;

						smoothScrollTo(container, targetScroll, 1000);
					}
				}, 800+200);

				//

				const postsArray = Array.from(posts);

				postsArray.forEach((otherPost, index) => {

					if (otherPost !== post) {

						otherPost.classList.remove('open');

						const postTarget = 0;

						smoothScrollTo(otherPost, postTarget, 1000);

						if (isMobile) {
							otherPost.style.maxHeight = otherPost.dataset.initialMaxHeight;
						} else {
							otherPost.style.maxWidth = otherPost.dataset.initialMaxWidth;
						}

						const allImgs = otherPost.querySelectorAll('img');
						const imgs = Array.from(allImgs).slice(1);

						setTimeout(() => {
							imgs.forEach((img) => {
								if (isMobile) {
									img.style.maxHeight = '0';
								} else {
									img.style.maxWidth = '0';
								}
							});
						}, 800*2);

						const postContent = otherPost.querySelector('.content');
						postContent.classList.remove('active');

						const excerpt = otherPost.querySelector('.excerpt');
						excerpt.classList.remove('active');
						excerpt.style.height = '0';

						const blurFooter = document.querySelector('#blur-footer');
						blurFooter.classList.remove('about');

						const excerptButton = post.querySelector('.info-button');
						const buttonText = excerptButton.querySelector('a');

						buttonText.textContent = "+ Info";

					}
				});

			}

			if (!post.classList.contains('open')) {
				if (anyActive) return;

				// centrar post

				// const postCenter = post.offsetLeft;
				// const containerCenter = container.offsetLeft;
				// const targetScroll = postCenter - containerCenter;

				let targetScroll;

				if (isMobile) {
					// En mobile → scroll vertical
					targetScroll = post.offsetTop - container.offsetTop;
				} else {
					// Desktop → scroll horizontal
					targetScroll = post.offsetLeft - container.offsetLeft;
				}

				// setTimeout(() => {
					animateScroll(container, targetScroll, animationDuration);
				// }, 250);

				// animateScroll(container, targetScroll, animationDuration);
			}
		});
	});
}

function animateScroll(container, target, duration) {
	const isMobile = window.innerWidth <= 1024;
	const start = isMobile ? container.scrollTop : container.scrollLeft;
	const distance = target - start;
	const startTime = performance.now();

	function easeInOutQuad(t) {
		return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
	}

	function scrollStep(currentTime) {
		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / duration, 1);
		const eased = easeInOutQuad(progress);

		if (isMobile) container.scrollTop = start + distance * eased;
		else container.scrollLeft = start + distance * eased;

		if (elapsed < duration) {
			requestAnimationFrame(scrollStep);
		}
	}

	requestAnimationFrame(scrollStep);
}

// info

function showInfo() {

	const infoButton = document.getElementById('about');
	const workButton = document.getElementById('work');
	const infoFields = document.getElementById('info-fields');
	const contact = document.getElementById('contact');
	const header = document.querySelector('header');
	const blurFooter = document.getElementById('blur-footer');
	const list = document.getElementById('list');
	const gallery = document.getElementById('gallery');
	const sizeNav = document.getElementById('size');

	infoButton?.addEventListener('click', () => {

		info = true;

		header.classList.add('active');

		gallery.classList.add('about');

		sizeNav.classList.add('hide');

		// if (!smallView) {
		// 	gallery.style.transform = 'translateY(200px)';
		// } else {
		// 	gallery.style.filter = 'blur(15px)';
		// }

		gallery.style.filter = 'blur(15px)';

		infoFields.style.height = infoFields.scrollHeight + 'px';
		infoFields.classList.add('open');
		contact.classList.add('open');

		infoButton.style.opacity = '1';
		workButton.style.opacity = 'calc(1/3)';

		list.classList.add('info');
		// blurFooter.style.transform = 'translateY(20vh)';
		blurFooter.classList.add('about');

		const openPost = document.querySelector('.post.open');

		if (openPost) {
			const postContent = openPost.querySelector('.content');
			if (postContent) postContent.classList.remove('active');
		}

	});

	function handleGalleryClick() {
		if (info) {
			info = false;

			gallery.classList.remove('about');
			gallery.style = '';

			sizeNav.classList.remove('hide');

			blurFooter.classList.remove('about');
			header.classList.remove('active', 'hover');
			workButton.style.opacity = '';
			infoButton.style.opacity = '';

			infoFields.style.height = '0';
			infoFields.classList.remove('open');
			contact.classList.remove('open');
			contact.style.transform = '';
			list.classList.remove('info');
			// blurFooter.style.transform = '';

			const openPost = document.querySelector('.post.open');
			if (openPost) {
				const postContent = openPost.querySelector('.content');
				if (postContent) postContent.classList.add('active');
			}
		}
	}

	gallery?.addEventListener('click', handleGalleryClick);
	workButton?.addEventListener('click', handleGalleryClick);

}

// post buttons

function postButtons() {
	const posts = document.querySelectorAll('#gallery .post');

	posts.forEach(post => {
		const buttonsContainer = post.querySelector('.buttons');
		const blurFooter = document.getElementById('blur-footer');

		const excerptButton = post.querySelector('.info-button');
		const buttonText = excerptButton.querySelector('a');
		const excerpt = post.querySelector('.excerpt');

		if (!buttonsContainer || !excerptButton || !excerpt) return;

		excerptButton.addEventListener('click', () => {
			if (excerpt.classList.contains('active')) {
				// Colapsar
				excerpt.style.height = '0';
				excerpt.classList.remove('active');

				buttonText.textContent = "+ Info";
			} else {
				// Expandir a altura de su contenido
				const scrollHeight = excerpt.scrollHeight;
				excerpt.style.height = scrollHeight + 'px';
				excerpt.classList.add('active');

				buttonText.textContent = "- Info";
			}

			// Alternar blurFooter
			blurFooter?.classList.toggle('about');
		});

	});
}

