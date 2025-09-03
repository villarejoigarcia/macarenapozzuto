const header = document.querySelector('header');
const transition = 1000;
const blurBottom = document.getElementById('blur-footer');
const postInfo = document.querySelectorAll('.post-info');
const smallIndex = document.getElementById('small-index');

// Al hacer click en #medium, los hijos de #gallery cambian de ancho con transición
window.addEventListener('DOMContentLoaded', function () {
	const medium = document.getElementById('medium');
	const large = document.getElementById('large');
	const small = document.getElementById('small');
	const gallery = document.getElementById('gallery');

	if (!medium || !gallery) return;
	const galleryItems = Array.from(gallery.children);

	// Inicial: usar el ancho visual mostrado de la imagen como max-width
	galleryItems.forEach(item => {
		const img = item.querySelector('img');
		let setSize = () => {
			if (img) {
				const visualWidth = img.getBoundingClientRect().width;
				item.dataset.initialMaxWidth = visualWidth + 'px';
				img.style.maxWidth = item.dataset.initialMaxWidth;

				const visualHeight = img.getBoundingClientRect().height;
				item.dataset.initialMaxHeight = visualHeight + 'px';
				img.style.maxHeight = item.dataset.initialMaxHeight;
			}
		};
		if (img && img.complete) {
			setSize();
		} else if (img) {
			img.addEventListener('load', setSize);
		}
	});

	let mediumActive = false;
	let smallActive = false;

	medium.addEventListener('click', function () {
		mediumActive = true;
		galleryItems.forEach(item => {
			const img = item.querySelector('img');
			if (smallActive) {
				img.style.maxWidth = item.dataset.initialMaxWidth;
				setTimeout(() => {
					img.style.maxWidth = 'calc((100vw - (3px * 4)) / 3)';
					img.style.height = '100%';
					img.style.padding = '72px 0';
				}, transition);
			} else {
				img.style.maxWidth = 'calc((100vw - (3px * 4)) / 3)';
				img.style.height = '100%';
				img.style.padding = '72px 0';
			}
		});
		smallActive = false;
		/*post info*/
		postInfo.forEach(post => {
			post.style.opacity = '1';
		});
		blurBottom.style.height = '10%';
		smallIndex.style.opacity = '0';
	});

	large.addEventListener('click', function () {
		mediumActive = false;
		smallActive = false;
		galleryItems.forEach(item => {
			const img = item.querySelector('img');
			img.style.maxWidth = item.dataset.initialMaxWidth;
			img.style.maxHeight = item.dataset.initialMaxHeight;
			img.style.padding = '0';
		});
		/*post info*/
		postInfo.forEach(post => {
			post.style.opacity = '1';
		});
		blurBottom.style.height = '10%';
		smallIndex.style.opacity = '0';
	});

	small.addEventListener('click', function () {
		smallActive = true;
		galleryItems.forEach(item => {
			const img = item.querySelector('img');
			if (mediumActive) {
				img.style.maxWidth = item.dataset.initialMaxWidth;
				setTimeout(() => {
					img.style.maxWidth = 'calc((100vw - (3px * 7)) / 6)';
					img.style.height = 'auto';
				}, transition);
				img.style.padding = '0';
			} else {
				img.style.maxWidth = 'calc((100vw - (3px * 7)) / 6)';
				img.style.height = 'auto';
				img.style.padding = '0';
			}
		});
		mediumActive = false;
		/*post info*/
		postInfo.forEach(post => {
			post.style.opacity = '0';
		});
		blurBottom.style.height = '0';
		smallIndex.style.opacity = '1';
	});

});

// Expansión de los span.hidden de #size usando el ancho real de su texto

window.addEventListener('load', function () {
	const size = document.getElementById('size');
	if (!size) return;
	const hiddenSpans = Array.from(size.querySelectorAll('span.hidden'));

	function getTextWidth(span) {
		// Medir el ancho real del texto del span
		const originalMaxWidth = span.style.maxWidth;
		const originalVisibility = span.style.visibility;
		const originalPosition = span.style.position;
		span.style.maxWidth = 'none';
		span.style.visibility = 'hidden';
		span.style.position = 'absolute';
		// Usar scrollWidth del span directamente
		const width = span.scrollWidth;
		span.style.maxWidth = originalMaxWidth;
		span.style.visibility = originalVisibility;
		span.style.position = originalPosition;
		return width;
	}

	hiddenSpans.forEach(span => {
		const width = getTextWidth(span);
		span.dataset.realWidth = width;
		span.style.maxWidth = '0';
		span.style.display = 'inline-block';
		span.style.overflow = 'hidden';
		span.style.verticalAlign = 'bottom';
		span.style.transition = 'max-width 0.5s';
	});

	header.addEventListener('mouseenter', function () {
		hiddenSpans.forEach(span => {
			span.style.maxWidth = span.dataset.realWidth + 'px';
		});
	});
	header.addEventListener('mouseleave', function () {
		hiddenSpans.forEach(span => {
			span.style.maxWidth = '0';
		});
	});
});
// Expansión de los divs de #logo usando el ancho real del contenido

window.addEventListener('load', function () {
	const logo = document.getElementById('logo');
	const zz = document.getElementById('zz');
	if (!logo) return;

	const logoDivs = Array.from(logo.querySelectorAll('div:not(#zz)'));

	// Función para medir el ancho real del h1 aunque el div esté colapsado
	function getH1Width(div) {
		const h1 = div.querySelector('h1');
		if (!h1) return 0;
		// Guardar estilos originales
		const originalMaxWidth = div.style.maxWidth;
		const originalVisibility = div.style.visibility;
		const originalPosition = div.style.position;
		// Hacer visible y sin restricción, fuera de flujo
		div.style.maxWidth = 'none';
		div.style.visibility = 'hidden';
		div.style.position = 'absolute';
		// Forzar reflow y medir
		const width = h1.scrollWidth;
		// Restaurar estilos
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

	header.addEventListener('mouseenter', function () {
		logoDivs.forEach(div => {
			div.style.maxWidth = div.dataset.realWidth + 'px';
		});
		if (zz) {
			zz.style.maxWidth = '0';
		}
	});

	header.addEventListener('mouseleave', function () {
		logoDivs.forEach(div => {
			div.style.maxWidth = '0';
		});
		if (zz) {
			zz.style.maxWidth = zz.dataset.realWidth + 'px';
		}
	});
});

// blur expansion

$(function () {
	const logo = $('#logo');
	const headerBlur = $('header');
	headerBlur.on('mouseenter', function () {
		headerBlur.addClass('hover');
	});
	headerBlur.on('mouseleave', function () {
		headerBlur.removeClass('hover');
	});
});

// scroll

if (window.innerWidth > 1024) {

	document.addEventListener("DOMContentLoaded", function () {

		const gallery = document.querySelector("#gallery-container");

		gallery.addEventListener("wheel", (event) => {
			event.preventDefault();
			gallery.scrollLeft += (event.deltaY + event.deltaX);
		});

	});

}

// button status

$(function () {

	const buttons = $('#size>*');

	buttons.on('click', function () {
		buttons.css('opacity', 'calc(1/3)');
		$(this).css('opacity', '1');
	});

});