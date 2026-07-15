( function ( $ ) {
	'use strict';

	$( function () {
		$( document ).on( 'click', '.cfm-accordion-header, .cfm-ico-arrow', function ( e ) {
			e.stopPropagation();

			var $header = $( this ).closest( '.cfm-accordion-header' );
			var $accordion = $header.closest( '.cfm-accordion' );
			var $content = $header.next( '.cfm-accordion-content' );

			if ( $header.hasClass( 'active' ) ) {
				$header.removeClass( 'active' );
				$content.slideUp( 300 );
				return;
			}

			$accordion.find( '.cfm-accordion-header' ).removeClass( 'active' );
			$accordion.find( '.cfm-accordion-content' ).slideUp( 300 );
			$header.addClass( 'active' );
			$content.slideDown( 300 );
		} );
	} );
}( jQuery ) );
