( function ( $ ) {
	'use strict';

	function requestHasAction( settings, actionName ) {
		var data = settings && settings.data ? settings.data : '';

		if ( typeof data === 'string' ) {
			return data.indexOf( 'action=' + actionName ) !== -1;
		}

		if ( typeof data === 'object' && data !== null ) {
			return data.action === actionName;
		}

		return false;
	}

	function openMiniCart() {
		$( document ).trigger( 'flatsome-open-mini-cart' );

		setTimeout( function () {
			var $dropdown = $( '.cart-item.has-dropdown' );

			if ( $dropdown.length ) {
				$dropdown.addClass( 'current-dropdown cart-active' );
				return;
			}

			var $toggle = $( '.header .cart-item .off-canvas-toggle, .header-main .cart-item .off-canvas-toggle' ).first();

			if ( $toggle.length ) {
				$toggle.trigger( 'click' );
			}
		}, 50 );
	}

	function getLoadingAddToCartButton() {
		return $( '.single_add_to_cart_button.loading, .sticky-add-to-cart .single_add_to_cart_button.loading' ).first();
	}

	/**
	 * Flatsome skips added_to_cart when notices HTML contains "error"
	 * (e.g. woocommerce-error from Min/Max Quantity warnings).
	 */
	function flatsomeSkippedAddedToCart( notices ) {
		return notices && notices.indexOf( 'error' ) > 0;
	}

	function completeAddedToCart( response, $button ) {
		if ( ! response || ! response.fragments ) {
			return false;
		}

		var $btn = $button && $button.length ? $button : getLoadingAddToCartButton();

		if ( $btn.length ) {
			$btn.removeClass( 'loading' );
		}

		$( document.body ).trigger( 'added_to_cart', [
			response.fragments,
			response.cart_hash || '',
			$btn,
		] );

		return true;
	}

	// Standard WooCommerce / Flatsome loop add-to-cart.
	$( document.body ).on( 'added_to_cart.fmmcr', function () {
		setTimeout( openMiniCart, 80 );
	} );

	// Flatsome single-product AJAX may skip added_to_cart when notices contain errors.
	$( document ).ajaxSuccess( function ( event, xhr, settings ) {
		if ( ! requestHasAction( settings, 'flatsome_ajax_add_to_cart' ) ) {
			return;
		}

		var response = xhr.responseJSON;

		if ( ! response || ! response.fragments ) {
			return;
		}

		var notices = response.notices || '';

		if ( ! flatsomeSkippedAddedToCart( notices ) ) {
			return;
		}

		completeAddedToCart( response );
	} );
}( jQuery ) );
