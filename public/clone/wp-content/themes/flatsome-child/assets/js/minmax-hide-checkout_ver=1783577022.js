(function ($) {
	'use strict';

	var config = window.cnvapesMinmaxHide || {};
	var selectors = Array.isArray(config.selectors) ? config.selectors : [];
	var styleId = 'cnvapes-minmax-hide-checkout-dynamic';

	function getTargets() {
		var nodes = [];
		selectors.forEach(function (selector) {
			document.querySelectorAll(selector).forEach(function (el) {
				if (nodes.indexOf(el) === -1) {
					nodes.push(el);
				}
			});
		});
		return nodes;
	}

	function hasMinmaxErrorInDom() {
		if (document.querySelector('.berocket_minmax')) {
			return true;
		}

		var miniCartNotices = document.querySelector('.cnvapes-mini-cart-minmax-notices');
		if (miniCartNotices) {
			if (miniCartNotices.getAttribute('data-cn-minmax-hide') === '1') {
				return true;
			}
			if (miniCartNotices.querySelector('.woocommerce-error')) {
				return true;
			}
		}

		var blockErrors = document.querySelectorAll('.wc-block-components-notice-banner.is-error');
		for (var i = 0; i < blockErrors.length; i++) {
			var text = blockErrors[i].textContent || '';
			if (text.indexOf('berocket_minmax') !== -1 || /quantity|cost|cart must/i.test(text)) {
				return true;
			}
		}

		return false;
	}

	function shouldHideCheckout() {
		if (!config.enabled) {
			return false;
		}

		if (hasMinmaxErrorInDom()) {
			return true;
		}

		return !!config.shouldHide;
	}

	function applyHideState(hide) {
		var targets = getTargets();

		targets.forEach(function (el) {
			el.style.setProperty('display', hide ? 'none' : '', 'important');
		});

		var styleEl = document.getElementById(styleId);
		if (hide) {
			if (!styleEl && selectors.length) {
				styleEl = document.createElement('style');
				styleEl.id = styleId;
				styleEl.textContent = selectors.join(',') + '{display:none!important;}';
				document.head.appendChild(styleEl);
			}
		} else if (styleEl) {
			styleEl.parentNode.removeChild(styleEl);
		}
	}

	function refresh() {
		applyHideState(shouldHideCheckout());
	}

	function scheduleRefresh() {
		window.requestAnimationFrame(refresh);
		setTimeout(refresh, 150);
		setTimeout(refresh, 500);
	}

	$(document).ready(scheduleRefresh);

	$(document.body).on('updated_wc_div updated_cart_totals wc_fragments_refreshed wc_fragments_loaded', scheduleRefresh);

	document.addEventListener('wc-blocks_added_to_cart', scheduleRefresh);

	if (window.MutationObserver) {
		var observer = new MutationObserver(function (mutations) {
			for (var i = 0; i < mutations.length; i++) {
				var mutation = mutations[i];
				if (mutation.type === 'childList' || mutation.type === 'attributes') {
					scheduleRefresh();
					return;
				}
			}
		});

		$(document).ready(function () {
			var roots = document.querySelectorAll(
				'.wc-block-cart, .wc-block-checkout, .widget_shopping_cart_content, .wc-block-mini-cart'
			);
			roots.forEach(function (root) {
				observer.observe(root, {
					childList: true,
					subtree: true,
					attributes: true,
					attributeFilter: ['data-cn-minmax-hide', 'class']
				});
			});
		});
	}
})(jQuery);
