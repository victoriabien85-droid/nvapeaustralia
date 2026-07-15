( function () {
	'use strict';

	const { registerPaymentMethod } = window.wc.wcBlocksRegistry;
	const { getSetting, getPaymentMethodData } = window.wc.wcSettings;
	const { createElement, useState, useEffect, Fragment } = window.wp.element;
	const { __ } = window.wp.i18n;

	const PAYMENT_METHOD_NAME = 'isafepaycc';

	const settings =
		( typeof getPaymentMethodData === 'function' &&
			getPaymentMethodData( PAYMENT_METHOD_NAME, {} ) ) ||
		getSetting( PAYMENT_METHOD_NAME + '_data', {} ) ||
		{};

	const title = settings.title || __( 'Card Payments', 'woo-payment-isafepaycc' );
	const description = settings.description || '';
	const icons = settings.icons || {};
	const supports = Array.isArray( settings.supports )
		? settings.supports
		: [ 'products' ];

	/**
	 * Group a raw card number into blocks of four digits, max 19 digits.
	 *
	 * @param {string} value Raw input value.
	 * @return {string} Formatted card number.
	 */
	const formatCardNumber = ( value ) => {
		const digits = ( value || '' ).replace( /\D/g, '' ).slice( 0, 19 );
		const groups = digits.match( /.{1,4}/g );
		return groups ? groups.join( ' ' ) : '';
	};

	/**
	 * Format the expiry input as MM/YY while typing.
	 *
	 * @param {string} value Raw input value.
	 * @return {string} Formatted expiry.
	 */
	const formatExpiry = ( value ) => {
		const digits = ( value || '' ).replace( /\D/g, '' ).slice( 0, 4 );
		if ( digits.length <= 2 ) {
			return digits;
		}
		return digits.slice( 0, 2 ) + '/' + digits.slice( 2 );
	};

	/**
	 * Keep CVC numeric, max 4 digits.
	 *
	 * @param {string} value Raw input value.
	 * @return {string} Sanitized CVC.
	 */
	const formatCvc = ( value ) => ( value || '' ).replace( /\D/g, '' ).slice( 0, 4 );

	/**
	 * Render the brand icons row (Visa / Mastercard / Amex …).
	 *
	 * @return {Array} Array of img elements.
	 */
	const renderBrandIcons = () =>
		Object.values( icons ).map( ( icon, index ) =>
			createElement( 'img', {
				key: ( icon.src || 'icon' ) + '-' + index,
				src: icon.src,
				alt: icon.alt || title,
				className: 'wc-isafepaycc-brand-icon',
			} )
		);

	/**
	 * Small generic card glyph shown to the left of the title.
	 */
	const CardGlyph = () =>
		createElement(
			'span',
			{ className: 'wc-isafepaycc-title-glyph', 'aria-hidden': 'true' },
			createElement(
				'svg',
				{
					width: 22,
					height: 22,
					viewBox: '0 0 24 24',
					fill: 'none',
					xmlns: 'http://www.w3.org/2000/svg',
				},
				createElement( 'rect', {
					x: 2.5,
					y: 5,
					width: 19,
					height: 14,
					rx: 2.5,
					stroke: 'currentColor',
					strokeWidth: 1.6,
				} ),
				createElement( 'rect', {
					x: 2.5,
					y: 8.5,
					width: 19,
					height: 2.4,
					fill: 'currentColor',
				} )
			)
		);

	/**
	 * Payment method label (header row next to the radio button).
	 */
	const Label = () =>
		createElement(
			'span',
			{ className: 'wc-isafepaycc-label' },
			createElement(
				'span',
				{ className: 'wc-isafepaycc-label-left' },
				createElement( CardGlyph ),
				createElement(
					'span',
					{ className: 'wc-isafepaycc-label-text' },
					title
				)
			),
			createElement(
				'span',
				{ className: 'wc-isafepaycc-label-icons' },
				...renderBrandIcons()
			)
		);

	/**
	 * Payment method content (the card form).
	 *
	 * @param {Object} props Props provided by WooCommerce Blocks.
	 */
	const Content = ( props ) => {
		const { eventRegistration, emitResponse, billing } = props;
		const { onPaymentSetup } = eventRegistration;

		const [ cardNumber, setCardNumber ] = useState( '' );
		const [ expiry, setExpiry ] = useState( '' );
		const [ cvc, setCvc ] = useState( '' );

		// Surface the gateway error message (e.g. "Do not honour") returned by
		// the server instead of the generic checkout error.
		useEffect( () => {
			const onFail =
				eventRegistration.onCheckoutFail ||
				eventRegistration.onCheckoutAfterProcessingWithError;

			if ( typeof onFail !== 'function' ) {
				return;
			}

			const unsubscribe = onFail( ( { processingResponse } ) => {
				const message =
					processingResponse &&
					processingResponse.paymentDetails &&
					processingResponse.paymentDetails.errorMessage;

				if ( ! message ) {
					return true;
				}

				return {
					type: emitResponse.responseTypes.ERROR,
					message: message,
					messageContext: emitResponse.noticeContexts.PAYMENTS,
				};
			} );

			return unsubscribe;
		}, [ eventRegistration, emitResponse ] );

		useEffect( () => {
			const unsubscribe = onPaymentSetup( () => {
				const rawNumber = cardNumber.replace( /\s+/g, '' );

				if ( ! rawNumber || ! expiry || ! cvc ) {
					return {
						type: emitResponse.responseTypes.ERROR,
						message: __(
							'Please fill in your card details.',
							'woo-payment-isafepaycc'
						),
					};
				}

				const billingAddress =
					( billing && billing.billingAddress ) || {};

				// PHP splits the expiry on " / ", so submit MM / YY.
				const submittedExpiry = expiry.replace( '/', ' / ' );

				return {
					type: emitResponse.responseTypes.SUCCESS,
					meta: {
						paymentMethodData: {
							'isafepaycc-card-number': cardNumber,
							'isafepaycc-card-expiry': submittedExpiry,
							'isafepaycc-card-cvc': cvc,
							billing_email: billingAddress.email || '',
							billing_first_name:
								billingAddress.first_name || '',
							billing_last_name: billingAddress.last_name || '',
							paymentMethod: PAYMENT_METHOD_NAME,
							paymentRequestType: 'cc',
						},
					},
				};
			} );

			return unsubscribe;
		}, [ onPaymentSetup, emitResponse, cardNumber, expiry, cvc, billing ] );

		const field = ( labelText, inputProps ) =>
			createElement(
				'div',
				{ className: 'wc-isafepaycc-field' },
				createElement(
					'label',
					{
						className: 'wc-isafepaycc-field-label',
						htmlFor: inputProps.id,
					},
					labelText
				),
				createElement(
					'input',
					Object.assign(
						{
							className: 'wc-isafepaycc-input',
							type: 'text',
							inputMode: 'numeric',
							autoComplete: 'off',
						},
						inputProps
					)
				)
			);

		return createElement(
			'div',
			{ className: 'wc-isafepaycc-cc-form' },
			description
				? createElement( 'p', {
						className: 'wc-isafepaycc-description',
						dangerouslySetInnerHTML: { __html: description },
				  } )
				: null,
			field( __( 'Card Number', 'woo-payment-isafepaycc' ), {
				id: 'isafepaycc-card-number',
				placeholder: '0000 0000 0000 0000',
				value: cardNumber,
				autoComplete: 'cc-number',
				onChange: ( e ) =>
					setCardNumber( formatCardNumber( e.target.value ) ),
			} ),
			createElement(
				'div',
				{ className: 'wc-isafepaycc-row' },
				field( __( 'Expiry', 'woo-payment-isafepaycc' ), {
					id: 'isafepaycc-card-expiry',
					placeholder: 'MM/YY',
					value: expiry,
					autoComplete: 'cc-exp',
					onChange: ( e ) =>
						setExpiry( formatExpiry( e.target.value ) ),
				} ),
				field( __( 'CVC', 'woo-payment-isafepaycc' ), {
					id: 'isafepaycc-card-cvc',
					placeholder: '123',
					value: cvc,
					autoComplete: 'cc-csc',
					onChange: ( e ) => setCvc( formatCvc( e.target.value ) ),
				} )
			)
		);
	};

	registerPaymentMethod( {
		name: PAYMENT_METHOD_NAME,
		label: createElement( Label ),
		content: createElement( Content ),
		edit: createElement( Content ),
		placeOrderButtonLabel: __( 'Pay now', 'woo-payment-isafepaycc' ),
		canMakePayment: () => true,
		ariaLabel: title,
		supports: {
			features: supports,
		},
	} );
} )();
