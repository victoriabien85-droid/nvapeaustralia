( function () {
	'use strict';

	const settings = window.wc.wcSettings.getSetting( 'fy-paypal-offline_data', {} );
	const defaultLabel = window.wp.i18n.__( 'PayPal Offline', 'woo-paypal-offline' );
	const label = window.wp.htmlEntities.decodeEntities( settings.title ) || defaultLabel;

	const Content = () => {
		return window.wp.htmlEntities.decodeEntities( settings.description || '' );
	};

	const WcpoPaypalOffline = {
		name: 'fy-paypal-offline',
		label: window.React.createElement(
			( props ) => {
				const { PaymentMethodLabel } = props.components;
				return window.React.createElement( PaymentMethodLabel, { text: label } );
			},
			null
		),
		content: window.React.createElement( Content, null ),
		edit: window.React.createElement( Content, null ),
		canMakePayment: () => true,
		ariaLabel: label,
		supports: {
			features: settings.supports,
		},
	};

	window.wc.wcBlocksRegistry.registerPaymentMethod( WcpoPaypalOffline );
} )();
