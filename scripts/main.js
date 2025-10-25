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
				buttons.button2
			];

			texts.forEach(text => {
				const className = text
					.toLowerCase()
					.replace(/\s+/g, '-')
					+ '-button';

				const $div = $('<div>').addClass(className);
				const $span = $('<a>').text(text);
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
			const firstImgWidth = firstImg.getBoundingClientRect().width;
			post.dataset.initialMaxWidth = firstImgWidth + 'px';
			post.style.maxWidth = post.dataset.initialMaxWidth;
			firstImg.style.maxWidth = post.dataset.initialMaxWidth;

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
		}else if (!post.classList.contains('closed')) {
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

document.addEventListener('DOMContentLoaded', logoAnimation);

function initBlurFooterHover() {

	const headerBlur = document.querySelector('header');
	const blurFooter = document.getElementById('contact');
	const listItems = document.querySelectorAll('#list>*');

	if (!headerBlur || !blurFooter) return;

	const viewportHeight = window.innerHeight;
	const viewportWidth = window.innerWidth;
	const triggerFooter = viewportHeight * 0.8;

	window.addEventListener('mousemove', (e) => {
		const isInLeftHalf = e.clientX <= viewportWidth / 2; // 🟢 solo mitad izquierda

		if (e.clientY >= triggerFooter && isInLeftHalf) {
			blurFooter.classList.add('list');

			listItems.forEach(listItem => {
				listItem.classList.add('open');
			});
		} else {
			blurFooter.classList.remove('list');

			listItems.forEach(listItem => {
				listItem.classList.remove('open');
			});
		}
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

// open post

// Crear el elemento p que seguirá al cursor
const cursorText = document.createElement('p');
cursorText.style.position = 'fixed';
cursorText.style.pointerEvents = 'none';
cursorText.style.zIndex = '1000';
cursorText.style.margin = '0';
document.body.appendChild(cursorText);

// Función para actualizar el texto y posición
function updateCursorText(post, e) {
    const text = post.classList.contains('open') ? 'Close' : 'Open';
    cursorText.textContent = text;
    cursorText.style.left = e.clientX + 'px';
    cursorText.style.top = e.clientY + 'px';
}

function showPostImages() {

	const posts = document.querySelectorAll('.post');
	const container = document.querySelector('#gallery-container');

	posts.forEach((post) => {

		const allImgs = post.querySelectorAll('img');
		const imgs = Array.from(allImgs).slice(1);
		const postContent = post.querySelector('.content');

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

		// Añadir eventos para el texto del cursor en el elemento .media
		const mediaContainer = post.querySelector('.media');
		if (mediaContainer) {
			mediaContainer.addEventListener('mouseenter', () => {
				cursorText.style.display = 'block';
				mediaContainer.addEventListener('mousemove', (e) => {
					updateCursorText(post, e); // seguimos pasando el post para comprobar su estado
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
					const value = parseFloat(img.dataset.initialMaxWidth); // lee data-initial-max-width
					if (!isNaN(value)) totalMaxWidth += value; // suma si es número
				});

				// scroll gallery container

				function smoothScrollTo(container, target, duration = 1000) {
					const start = container.scrollLeft;
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

						container.scrollLeft = start + distance * eased;

						if (progress < 1) {
							requestAnimationFrame(animate);
						}
					}

					requestAnimationFrame(animate);
				}

				smoothScrollTo(container, 0);

				//

				const isOpen = post.classList.contains('open');
				
				const isClosed = Array.from(posts).some(otherPost =>
					otherPost !== post && otherPost.classList.contains('closed')
				);
				e.stopPropagation();

				console.log(container.scrollLeft);

				if (isOpen) {

					console.log('B');

					// const postContent = post.querySelector('.content');
					const excerpt = post.querySelector('.excerpt');
					const allImgs = post.querySelectorAll('img');
					const imgs = Array.from(allImgs).slice(1);

					imgs.forEach((img) => {
						img.style.maxWidth = '0';
					});

					excerpt.classList.remove('active');

					post.classList.remove('open');
					post.style.maxWidth = post.dataset.initialMaxWidth;

					posts.forEach(otherPost => {
						if (otherPost !== post) {
							otherPost.style.maxWidth = otherPost.dataset.initialMaxWidth;
							const allImgs = otherPost.querySelectorAll('img');
							const firstImg = allImgs[0];
							firstImg.style.maxWidth = otherPost.dataset.initialMaxWidth;
							otherPost.classList.remove('closed');
							otherPost.style.marginLeft = '';
						}
					});

					postContent.classList.remove('active');

				} else if (!isOpen && !isClosed) {

					console.log('A');

					// container.style.overflow = 'hidden';

					post.classList.add('open');
					const mediaContainer = post.querySelector('.media');
					mediaContainer.classList.add('gap');

					if (imgs.length === 0) return;

					const postContent = post.querySelector('.content');
					postContent.classList.add('active');

					post.style.maxWidth = totalMaxWidth + 'px';

					imgs.forEach((img) => {
						img.style.maxWidth = img.dataset.initialMaxWidth;
					});

					const postsArray = Array.from(posts);
					const currentIndex = postsArray.indexOf(post);

					postsArray.forEach((otherPost, index) => {
						if (otherPost !== post) {
							
								otherPost.style.maxWidth = '0';
								otherPost.style.marginLeft = '0';
							
							otherPost.classList.add('closed');
						}
					});

				}

				
			});

		});

	});

}

// info

function showInfo() {

	const infoButton = document.getElementById('about');
	const workButton = document.getElementById('work');
	const infoFields = document.getElementById('info-fields');
	const contact = document.getElementById('contact');
	const header = document.querySelector('header');
	const blurFooter = document.getElementById('contact');
	const list = document.getElementById('list');
	const gallery = document.getElementById('gallery');

	infoButton?.addEventListener('click', () => {

		info = true;

		header.classList.add('active');

		gallery.classList.add('about');

		if (!smallView) {
			gallery.style.transform = 'translateY(200px)';
		} else {
			gallery.style.filter = 'blur(15px)';
		}

		infoFields.style.height = infoFields.scrollHeight + 'px';
		infoFields.classList.add('open');
		contact.classList.add('open');

		infoButton.style.opacity = '1';
		workButton.style.opacity = 'calc(1/3)';

		list.classList.add('info');
		// blurFooter.style.transform = 'translateY(20vh)';
		blurFooter.classList.add('hover');

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

		blurFooter.classList.remove('hover');
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
	}
}

// ambos clics hacen lo mismo
gallery?.addEventListener('click', handleGalleryClick);
workButton?.addEventListener('click', handleGalleryClick);
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
	
	listItems.forEach(item => {
	item.addEventListener('click', () => {

		const anyActive = Array.from(posts).some(post => post.classList.contains('open'));
		const index = item.dataset.index;
		const post = document.querySelector(`#gallery .post[data-index="${index}"]`);
		if (!post) return;

		if (anyActive) {
			console.log('C');
			
			const mediaContainer = post.querySelector('.media');
			const imgs = post.querySelectorAll('img');
			const postContent = post.querySelector('.content');

			postContent.classList.add('active');

			let totalMaxWidth = 0;

			imgs.forEach((img) => {
				img.style.maxWidth = img.dataset.initialMaxWidth;
				const value = parseFloat(img.dataset.initialMaxWidth);
				if (!isNaN(value)) totalMaxWidth += value;
			});
			post.style.maxWidth = totalMaxWidth + 'px';
			post.style.marginLeft = '';

			post.classList.remove('closed');
			post.classList.add('open');

			const postsArray = Array.from(posts);
			const currentIndex = postsArray.indexOf(post);

			postsArray.forEach((otherPost, index) => {
				const postContent = otherPost.querySelector('.content');

				if (otherPost !== post) {
					
						otherPost.style.maxWidth = '0';
						otherPost.style.marginLeft = '0';
					
					otherPost.classList.remove('open');
					otherPost.classList.add('closed');
					postContent.classList.remove('active');
				}
			});
			//
		}

		if (!post.classList.contains('open')) {
			if (anyActive) return;
			// abrir post
			const postCenter = post.offsetLeft + post.offsetWidth / 2;
			const containerCenter = container.offsetWidth / 2;
			const targetScroll = postCenter - containerCenter;

			animateScroll(container, targetScroll, animationDuration);
		} 
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
		// const closeButton = post.querySelector('.close-button');
		const postContent = post.querySelector('.content');

		const excerptButton = post.querySelector('.info-button');
		const excerpt = post.querySelector('.excerpt');

		if (!buttonsContainer) return;

		excerptButton.addEventListener('click', () => {
			excerpt.classList.toggle('active');
		});

		// closeButton.addEventListener('click', () => {

		// 	const allImgs = post.querySelectorAll('img');
		// 	// const firstImg = allImgs[0];
		// 	const imgs = Array.from(allImgs).slice(1);
		// 	imgs.forEach((img) => {
		// 		img.style.maxWidth = '0';
		// 	});

		// 	excerpt.classList.remove('active');

		// 	gallery.style.gap = '3px';
		// 	const media = post.querySelector('.media');
		// 	media.classList.remove('gap');
		// 	post.classList.remove('open');

		// 	setTimeout(() => {
		// 		post.style.maxWidth = post.dataset.initialMaxWidth;
		// 	}, 1000);

		// 	posts.forEach(otherPost => {
		// 		if (otherPost !== post) {
		// 			otherPost.style.maxWidth = otherPost.dataset.initialMaxWidth;
		// 			const allImgs = otherPost.querySelectorAll('img');
		// 			const firstImg = allImgs[0];
		// 			firstImg.style.maxWidth = otherPost.dataset.initialMaxWidth;
		// 		}
		// 	});

		// 	postContent.classList.remove('active');

		// });
	});
}

