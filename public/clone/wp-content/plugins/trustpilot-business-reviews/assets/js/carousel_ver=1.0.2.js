jQuery(function ($) {
	function getPerView($container) {
		const width = window.innerWidth;
		if (width < 550) {
			return parseInt($container.data('per-view-mobile'), 10) || 1;
		}
		if (width < 992) {
			return parseInt($container.data('per-view-tablet'), 10) || 2;
		}
		return parseInt($container.data('per-view'), 10) || 3;
	}

	function showSlide($container, slideIndex) {
		const $track = $container.find('.tpbr_all_reviews.carousel');
		const $items = $track.find('.carousel-item');
		const totalItems = $items.length;
		const perView = Math.max(1, getPerView($container));
		const maxIndex = Math.max(0, totalItems - perView);

		slideIndex = slideIndex || 0;
		if (slideIndex < 0) {
			slideIndex = 0;
		}
		if (slideIndex > maxIndex) {
			slideIndex = maxIndex;
		}

		$container.css('--tpbr-per-view', perView);
		$container.find('.carousel-nav').attr('data-index', slideIndex).attr('data-per-view', perView);

		if (totalItems <= perView) {
			$container.find('.carousel-nav').hide();
			slideIndex = 0;
		} else {
			$container.find('.carousel-nav').show();
			$container.find('.carousel-nav .slider-prev').css({
				'pointer-events': slideIndex <= 0 ? 'none' : 'auto',
				opacity: slideIndex <= 0 ? '0.5' : '1'
			});
			$container.find('.carousel-nav .slider-next').css({
				'pointer-events': slideIndex >= maxIndex ? 'none' : 'auto',
				opacity: slideIndex >= maxIndex ? '0.5' : '1'
			});
		}

		const offset = slideIndex * (100 / perView);
		$track.css('transform', 'translateX(-' + offset + '%)');
	}

	function initCarousel($container) {
		const currentIndex = parseInt($container.find('.carousel-nav').attr('data-index'), 10) || 0;
		showSlide($container, currentIndex);
	}

	$('.tpbr_reviews_container .carousel-container').each(function () {
		initCarousel($(this));
	});

	$(document).on('click', '.tpbr_reviews_container .carousel-nav .slider-next', function () {
		const $container = $(this).closest('.carousel-container');
		const $nav = $container.find('.carousel-nav');
		const perView = Math.max(1, getPerView($container));
		const step = 1;
		showSlide($container, parseInt($nav.attr('data-index'), 10) + step);
	});

	$(document).on('click', '.tpbr_reviews_container .carousel-nav .slider-prev', function () {
		const $container = $(this).closest('.carousel-container');
		const $nav = $container.find('.carousel-nav');
		const step = 1;
		showSlide($container, parseInt($nav.attr('data-index'), 10) - step);
	});

	let resizeTimer;
	$(window).on('resize', function () {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function () {
			$('.tpbr_reviews_container .carousel-container').each(function () {
				initCarousel($(this));
			});
		}, 150);
	});
});
