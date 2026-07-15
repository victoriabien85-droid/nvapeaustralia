( function ( $ ) {
	'use strict';

	$( function () {
		if ( typeof cnpSettings === 'undefined' ) {
			return;
		}

		var $root = $( '#cnp-popup-root' );
		var $popup = $( '#cnp-popup' );
		var $email = $( '#cnp-popup-email' );
		var $error = $( '.cnp-popup__error' );

		if ( ! $root.length || ! $popup.length ) {
			return;
		}

		var notificationId = cnpSettings.notificationId || '';
		var storageKey = ( cnpSettings.storagePrefix || 'cnp_dismissed_' ) + notificationId;
		var sessionKey = cnpSettings.sessionKey || 'ageVerified_21plus';
		var delay = parseInt( cnpSettings.delay, 10 ) || 0;
		var i18n = cnpSettings.i18n || {};

		function isDismissed() {
			try {
				return localStorage.getItem( storageKey ) === '1';
			} catch ( e ) {
				return false;
			}
		}

		function isAgeVerified() {
			try {
				return sessionStorage.getItem( sessionKey ) === 'true';
			} catch ( e ) {
				return false;
			}
		}

		function setAgeVerified() {
			try {
				sessionStorage.setItem( sessionKey, 'true' );
			} catch ( e ) {
				// Ignore storage errors.
			}
		}

		function suppressAgeModal() {
			$( '#snm-age-mask, #snm-age-modal' ).prop( 'hidden', true );
		}

		function restoreAgeModal() {
			if ( isAgeVerified() ) {
				return;
			}

			$( '#snm-age-mask, #snm-age-modal' ).prop( 'hidden', false );
		}

		function dismiss( markAgeVerified ) {
			try {
				localStorage.setItem( storageKey, '1' );
			} catch ( e ) {
				// Ignore storage errors.
			}

			if ( markAgeVerified ) {
				setAgeVerified();
			} else {
				restoreAgeModal();
			}

			hidePopup();
		}

		function hidePopup() {
			$root.removeClass( 'is-visible' );
			setTimeout( function () {
				$root.prop( 'hidden', true );
			}, 400 );
		}

		function showPopup() {
			$root.prop( 'hidden', false );
			requestAnimationFrame( function () {
				$root.addClass( 'is-visible' );
				if ( $email.length ) {
					$email.trigger( 'focus' );
				}
			} );
		}

		function showError( message ) {
			if ( ! $error.length ) {
				window.alert( message );
				return;
			}

			$error.text( message ).prop( 'hidden', false );
			$email.addClass( 'is-invalid' );
		}

		function clearError() {
			$error.prop( 'hidden', true ).text( '' );
			$email.removeClass( 'is-invalid' );
		}

		function isValidEmail( value ) {
			return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( value );
		}

		function confirmAgeAndDismiss() {
			dismiss( true );
		}

		function getLostPasswordUrl() {
			return cnpSettings.lostPasswordUrl || '/my-account/lost-password/';
		}

		function showSuccessState( email ) {
			var $body = $popup.find( '.cnp-popup__body' );
			var $success = $popup.find( '.cnp-popup__success' );
			var $message = $success.find( '.cnp-popup__success-message' );
			var title = i18n.successTitle || 'Check your email!';
			var template = i18n.successMessage || "We've created your CNVAPES account and sent a password setup link to %s. Please set your password to view your welcome points.";
			var passwordLabel = i18n.setPassword || 'Set Your Password';
			var safeEmail = $( '<div>' ).text( email ).html();

			$popup.addClass( 'is-success' );
			$body.prop( 'hidden', true );
			$success.prop( 'hidden', false );
			$success.find( '.cnp-popup__success-title' ).text( title );
			$message.html( template.replace( '%s', '<strong>' + safeEmail + '</strong>' ) );
			$success.find( '.cnp-popup__success-password' )
				.attr( 'href', getLostPasswordUrl() )
				.text( passwordLabel );

			try {
				localStorage.setItem( storageKey, '1' );
				setAgeVerified();
			} catch ( e ) {
				// Ignore storage errors.
			}

			setTimeout( function () {
				if ( $popup.hasClass( 'is-success' ) ) {
					hidePopup();
				}
			}, 8000 );
		}

		function submitEmail() {
			var email = $.trim( $email.val() || '' );

			clearError();

			if ( ! email ) {
				showError( i18n.emailRequired || 'Please enter your email address.' );
				return;
			}

			if ( ! isValidEmail( email ) ) {
				showError( i18n.emailInvalid || 'Please enter a valid email address.' );
				return;
			}

			var $btn = $popup.find( '[data-action="get-coupon"]' );
			var originalText = $btn.text();

			$btn.prop( 'disabled', true ).text( i18n.submitting || 'Submitting...' );

			$.post(
				cnpSettings.ajaxUrl,
				{
					action: 'cnp_submit_coupon_email',
					nonce: cnpSettings.nonce,
					email: email,
					notification_id: notificationId
				}
			)
				.done( function ( response ) {
					if ( response && response.success ) {
						showSuccessState( email );
						return;
					}

					var message = ( response && response.data && response.data.message )
						? response.data.message
						: ( i18n.submitError || 'Something went wrong. Please try again.' );

					showError( message );
				} )
				.fail( function ( xhr ) {
					var message = i18n.submitError || 'Something went wrong. Please try again.';

					if ( xhr.responseJSON && xhr.responseJSON.data && xhr.responseJSON.data.message ) {
						message = xhr.responseJSON.data.message;
					}

					showError( message );
				} )
				.always( function () {
					if ( ! $popup.hasClass( 'is-success' ) ) {
						$btn.prop( 'disabled', false ).text( originalText );
					}
				} );
		}

		function scheduleShow() {
			if ( isDismissed() || isAgeVerified() ) {
				return;
			}

			setTimeout( function () {
				if ( isDismissed() || isAgeVerified() ) {
					restoreAgeModal();
					return;
				}

				showPopup();
			}, Math.max( 0, delay ) * 1000 );
		}

		$popup.on( 'click', '[data-action="get-coupon"]', function ( e ) {
			e.preventDefault();

			if ( $email.length ) {
				submitEmail();
				return;
			}

			confirmAgeAndDismiss();
		} );

		$popup.on( 'click', '[data-action="continue"]', function ( e ) {
			e.preventDefault();
			confirmAgeAndDismiss();
		} );

		$popup.on( 'click', '[data-action="under"]', function ( e ) {
			e.preventDefault();
			window.location.href = cnpSettings.underRedirect || 'about:blank';
		} );

		$popup.on( 'click', '.cnp-popup__success-password', function () {
			try {
				localStorage.setItem( storageKey, '1' );
				setAgeVerified();
			} catch ( e ) {
				// Ignore storage errors.
			}
		} );

		$popup.on( 'click', '.cnp-popup__close', function ( e ) {
			if ( $popup.hasClass( 'is-success' ) ) {
				e.preventDefault();
				hidePopup();
				return;
			}

			e.preventDefault();
			dismiss( false );
		} );

		$email.on( 'input', clearError );

		$email.on( 'keydown', function ( e ) {
			if ( e.key === 'Enter' ) {
				e.preventDefault();
				$popup.find( '[data-action="get-coupon"]' ).trigger( 'click' );
			}
		} );

		$( document ).on( 'keydown', function ( e ) {
			if ( e.key === 'Escape' && $root.hasClass( 'is-visible' ) ) {
				if ( $popup.hasClass( 'is-success' ) ) {
					hidePopup();
					return;
				}

				dismiss( false );
			}
		} );

		if ( ! isDismissed() && ! isAgeVerified() ) {
			suppressAgeModal();
			scheduleShow();
		}
	} );
}( jQuery ) );
