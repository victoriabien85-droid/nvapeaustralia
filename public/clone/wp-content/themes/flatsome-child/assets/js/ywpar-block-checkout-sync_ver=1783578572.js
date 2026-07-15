(function ($) {
	'use strict';

	var syncTimer = null;
	var isSyncing = false;
	var reconcileTimer = null;
	var cartStoreSignature = '';
	var DEBOUNCE_MS = 500;
	var SYNC_RETRY_DELAY_MS = 500;
	var MAX_SYNC_ATTEMPTS = 2;
	var labels = window.cnvapesYwparSync || {
		applyingLabel: 'Applying points…',
		updatingLabel: 'Updating order total…',
		applyFailedLabel: 'Points could not be applied to your order. Please refresh the page and try again.',
		cartChangedLabel: 'Your cart changed, so the points discount was removed. Please apply points again.',
		hasRedeemSession: false,
		hasRedeemDiscount: false,
		reconcileUrl: ''
	};

	function cartHasYwparCoupon(cart) {
		if (!cart || !cart.coupons) {
			return false;
		}

		return cart.coupons.some(function (coupon) {
			return coupon.code && coupon.code.indexOf('ywpar_discount') === 0;
		});
	}

	function cartHasRedeemDiscount(cart) {
		if (!cart || !cart.totals) {
			return false;
		}

		var discount = parseInt(cart.totals.total_discount, 10);
		return !isNaN(discount) && discount > 0;
	}

	function cartRedeemApplied(cart) {
		return cartHasYwparCoupon(cart) || cartHasRedeemDiscount(cart);
	}

	function pageHasRedeemContext() {
		return !!labels.hasRedeemSession || !!labels.hasRedeemDiscount || !!getApplyButtons().length;
	}

	function updateLabelsFromReconcile(data) {
		if (!data) {
			return;
		}

		if (typeof data.hasSession !== 'undefined') {
			labels.hasRedeemSession = !!data.hasSession;
		}

		if (typeof data.hasDiscount !== 'undefined') {
			labels.hasRedeemDiscount = !!data.hasDiscount;
		}
	}

	function showSyncNotice(message, type) {
		if (!window.wp || !wp.data || !wp.data.dispatch) {
			return;
		}

		var noticesDispatch = wp.data.dispatch('core/notices');
		if (!noticesDispatch || typeof noticesDispatch.createNotice !== 'function') {
			return;
		}

		noticesDispatch.createNotice(type || 'warning', message, {
			isDismissible: true,
			context: 'wc/cart'
		});
	}

	function getApplyButtons() {
		return $('#ywpar_apply_discounts, .ywpar-button-message.ywpar-button-percentage-discount');
	}

	function getOrderSummaryTargets() {
		return $(
			'.wp-block-woocommerce-checkout-order-summary-block, ' +
			'.wc-block-cart__sidebar, ' +
			'.wc-block-components-order-summary'
		).filter(':visible').first();
	}

	function wrapButtonLabel($button) {
		if (!$button.length || $button.find('.cnvapes-ywpar-btn-label').length) {
			return;
		}

		var nodes = $button.contents().filter(function () {
			return this.nodeType === 3 || (this.nodeType === 1 && !$(this).hasClass('cnvapes-ywpar-btn-label'));
		});

		if (!nodes.length) {
			return;
		}

		nodes.wrapAll('<span class="cnvapes-ywpar-btn-label"></span>');
	}

	function setSummaryOverlay(stage) {
		var $summary = getOrderSummaryTargets();
		if (!$summary.length) {
			return;
		}

		var text = stage === 'sync' ? labels.updatingLabel : labels.applyingLabel;
		var $overlay = $summary.children('.cnvapes-ywpar-summary-overlay');

		if (!$overlay.length) {
			$overlay = $(
				'<div class="cnvapes-ywpar-summary-overlay" aria-live="polite" aria-busy="true">' +
					'<span class="cnvapes-ywpar-summary-label"></span>' +
				'</div>'
			);
			$summary.addClass('cnvapes-ywpar-summary-loading').append($overlay);
		}

		$overlay.find('.cnvapes-ywpar-summary-label').text(text);
	}

	function clearSummaryOverlay() {
		getOrderSummaryTargets()
			.removeClass('cnvapes-ywpar-summary-loading')
			.children('.cnvapes-ywpar-summary-overlay')
			.remove();
	}

	function setApplyingState(active, stage) {
		getApplyButtons().each(function () {
			var $button = $(this);
			wrapButtonLabel($button);

			if (active) {
				$button.addClass('cnvapes-ywpar-is-loading').attr('aria-busy', 'true').prop('disabled', true);
			} else {
				$button.removeClass('cnvapes-ywpar-is-loading').removeAttr('aria-busy').prop('disabled', false);
			}
		});

		if (active) {
			setSummaryOverlay(stage || 'apply');
		} else {
			clearSummaryOverlay();
		}
	}

	function getCartDispatch() {
		if (!window.wp || !wp.data || !wp.data.dispatch) {
			return null;
		}

		return wp.data.dispatch('wc/store/cart');
	}

	function fetchCart(attempt, afterApply) {
		return wp.apiFetch({ path: '/wc/store/v1/cart' }).then(function (cart) {
			if (afterApply && !cartRedeemApplied(cart) && attempt < MAX_SYNC_ATTEMPTS - 1) {
				return new window.Promise(function (resolve) {
					window.setTimeout(function () {
						resolve(fetchCart(attempt + 1, afterApply));
					}, SYNC_RETRY_DELAY_MS);
				});
			}

			return cart;
		});
	}

	function receiveCartFromApi(options) {
		options = options || {};

		var cartDispatch = getCartDispatch();
		if (!cartDispatch || typeof cartDispatch.receiveCart !== 'function' || !wp.apiFetch) {
			if (options.manageLoading) {
				setApplyingState(false);
			}
			return window.Promise.resolve(null);
		}

		return fetchCart(0, !!options.afterApply).then(function (cart) {
			cartDispatch.receiveCart(cart);

			if (options.afterApply && !cartRedeemApplied(cart)) {
				console.warn('cnvapes_ywpar: points applied but redeem discount not found in Store API cart.');
				showSyncNotice(labels.applyFailedLabel, 'warning');
			}

			if (options.cartChanged && !cartRedeemApplied(cart)) {
				showSyncNotice(labels.cartChangedLabel, 'warning');
			}

			return cart;
		});
	}

	function reconcileOnServer() {
		if (!labels.reconcileUrl) {
			return window.Promise.resolve(null);
		}

		return $.post(labels.reconcileUrl).then(function (response) {
			if (response && response.success && response.data) {
				updateLabelsFromReconcile(response.data);
			}

			return response;
		});
	}

	function reconcileThenSync(options) {
		options = options || {};

		if (isSyncing) {
			return window.Promise.resolve(null);
		}

		var shouldReconcile = !!options.forceReconcile || (labels.hasRedeemSession && !labels.hasRedeemDiscount);

		if (!shouldReconcile || !labels.reconcileUrl) {
			return receiveCartFromApi(options);
		}

		isSyncing = true;

		if (options.manageLoading) {
			setApplyingState(true, 'sync');
		}

		return reconcileOnServer()
			.then(function () {
				return receiveCartFromApi(options);
			})
			.catch(function (error) {
				console.warn('cnvapes_ywpar: reconcile failed.', error);
				if (options.cartChanged) {
					showSyncNotice(labels.cartChangedLabel, 'warning');
				}
				return receiveCartFromApi(options);
			})
			.finally(function () {
				window.setTimeout(function () {
					isSyncing = false;
					if (options.manageLoading) {
						setApplyingState(false);
					}
				}, DEBOUNCE_MS);
			});
	}

	/**
	 * Pull fresh cart from Store API and push into the Blocks cart store.
	 */
	function syncBlockCartStore() {
		if (isSyncing) {
			return;
		}

		isSyncing = true;
		setApplyingState(true, 'sync');

		receiveCartFromApi({ afterApply: true, manageLoading: true })
			.catch(function (error) {
				console.warn('cnvapes_ywpar: failed to sync cart store after applying points.', error);
				showSyncNotice('Could not update your order total. Please try again.', 'error');
			})
			.finally(function () {
				window.setTimeout(function () {
					isSyncing = false;
					setApplyingState(false);
				}, DEBOUNCE_MS);
			});
	}

	function syncCartQuietly() {
		if (isSyncing) {
			return;
		}

		if (labels.hasRedeemSession && !labels.hasRedeemDiscount) {
			reconcileThenSync({ afterApply: false, manageLoading: false, forceReconcile: true });
			return;
		}

		receiveCartFromApi({ afterApply: false, manageLoading: false }).catch(function () {
			// Ignore quiet sync errors after coupon removal.
		});
	}

	function syncCartAfterChange() {
		if (isSyncing) {
			return;
		}

		reconcileThenSync({ afterApply: false, manageLoading: false, cartChanged: true, forceReconcile: true });
	}

	function scheduleSync() {
		window.clearTimeout(syncTimer);
		syncTimer = window.setTimeout(syncBlockCartStore, 250);
	}

	function scheduleReconcile() {
		window.clearTimeout(reconcileTimer);
		reconcileTimer = window.setTimeout(function () {
			if (!labels.hasRedeemSession || isSyncing) {
				return;
			}

			var store = window.wp && wp.data && wp.data.select ? wp.data.select('wc/store/cart') : null;
			if (!store || typeof store.getCartData !== 'function') {
				return;
			}

			var cart = store.getCartData();
			if (!cart || cartRedeemApplied(cart)) {
				return;
			}

			reconcileThenSync({ afterApply: false, manageLoading: false, cartChanged: true, forceReconcile: true });
		}, 300);
	}

	function getCartStoreSignature(cart) {
		if (!cart) {
			return '';
		}

		return JSON.stringify({
			coupons: (cart.coupons || []).map(function (coupon) {
				return coupon.code;
			}),
			discount: cart.totals ? cart.totals.total_discount : 0
		});
	}

	function setupCartStoreSubscription() {
		if (!window.wp || !wp.data || typeof wp.data.subscribe !== 'function') {
			return;
		}

		wp.data.subscribe(function () {
			var store = wp.data.select('wc/store/cart');
			if (!store || typeof store.getCartData !== 'function') {
				return;
			}

			var cart = store.getCartData();
			if (!cart) {
				return;
			}

			var signature = getCartStoreSignature(cart);
			if (signature === cartStoreSignature) {
				return;
			}

			cartStoreSignature = signature;

			if (labels.hasRedeemSession && !cartRedeemApplied(cart)) {
				scheduleReconcile();
			}
		});
	}

	function isYwparApplyPointsRequest(settings) {
		return settings && settings.url && settings.url.indexOf('ywpar_apply_points') !== -1;
	}

	function isRemoveCouponRequest(settings) {
		return settings && settings.url && settings.url.indexOf('/wc/store/v1/cart/remove-coupon') !== -1;
	}

	function isYwparCouponRemoval(settings, xhr) {
		if (!isRemoveCouponRequest(settings)) {
			return false;
		}

		if (xhr && xhr.status && xhr.status >= 400) {
			return false;
		}

		var requestData = settings.data || '';
		if (typeof requestData === 'string' && requestData.indexOf('ywpar_discount') !== -1) {
			return true;
		}

		if (typeof requestData === 'object' && requestData && requestData.code) {
			return String(requestData.code).indexOf('ywpar_discount') === 0;
		}

		return false;
	}

	$(document).ajaxSend(function (_event, _xhr, settings) {
		if (!isYwparApplyPointsRequest(settings)) {
			return;
		}

		setApplyingState(true, 'apply');
	});

	$(document).ajaxComplete(function (_event, xhr, settings) {
		if (isYwparCouponRemoval(settings, xhr)) {
			labels.hasRedeemSession = false;
			labels.hasRedeemDiscount = false;
			syncCartQuietly();
			return;
		}

		if (!isYwparApplyPointsRequest(settings)) {
			return;
		}

		if (xhr && xhr.status && xhr.status >= 400) {
			setApplyingState(false);
			showSyncNotice('Could not apply points. Please try again.', 'error');
			return;
		}

		labels.hasRedeemSession = true;
		scheduleSync();
	});

	$(document).ajaxError(function (_event, _xhr, settings) {
		if (!isYwparApplyPointsRequest(settings)) {
			return;
		}

		setApplyingState(false);
		showSyncNotice('Could not apply points. Please try again.', 'error');
	});

	$(document).on('submit', 'form.ywpar_apply_discounts', function () {
		setApplyingState(true, 'apply');
		labels.hasRedeemSession = true;
		scheduleSync();
	});

	$(window).on('load', function () {
		if (!pageHasRedeemContext()) {
			return;
		}

		setupCartStoreSubscription();
		syncCartQuietly();
	});

	$(document.body).on('updated_cart_totals', function () {
		if (!pageHasRedeemContext()) {
			return;
		}

		syncCartAfterChange();
	});

})(jQuery);
