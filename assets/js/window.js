/** 
 * @author J�r�my BOUNY / https://github.com/jbouny | http://www.jeremybouny.fr
 * @file js/window.js
 * 
 * Part of the project gravitris https://github.com/jbouny/gravitris
 * 
 * Manage the user actions and provide some callbacks to use them.
 */

var Window = {
	ms_Width: 0,
	ms_Height: 0,
	ms_MiddleX: 0,
	ms_MiddleY: 0,
	ms_Callbacks: {
		37: "Window.LeftCallback()",			// Impulse Left
		38: "Window.UpCallback()",				// Impulse Up
		39: "Window.RightCallback()",			// Impulse Right
		40: "Window.DownCallback()",			// Impulse Down
		32: "Window.FallCallback()",			// Fall on the ground
		67: "Window.NextViewCallback()",		// Change viewer
		70: "Window.ToggleFullScreen()",		// Toggle fullscreen
		80: "Window.PauseCallback()",			// Pause
		82: "Window.ReloadCallback()",			// Reload
		01: "Window.PrevViewCallback()"			// Previous view
	},
	
	Initialize: function()
	{
		Window.UpdateSize();
		
		// Create callbacks from keyboard
		$(document).keydown( function( inEvent ) { Window.CallAction( inEvent.keyCode ); } ) ;
		$(window).resize( function( inEvent ) {
			Window.UpdateSize();
			Window.ResizeCallback( Window.ms_Width, Window.ms_Height );
		} );
		
		// Create callbacks from buttons and touch actions
		
		// Full screen
		$( '#fullscreen' ).click( function() { Window.CallAction( 70 ); } );
		
		// Fall
		var aFallAction = function( inEvent ) { Window.CallAction( 32 ); inEvent.stopPropagation(); };
		$( 'body' ).hammer( { swipe_velocity: 0.1 } ).on( "tap", aFallAction );
		
		$( 'body' ).hammer( { swipe_velocity: 0.1 } ).on( "swipe", function( inEvent ) { 
			inEvent.stopPropagation();
			var aX = inEvent.gesture.deltaX / ( Window.ms_Width * 0.15 ) ;
			var aY = inEvent.gesture.deltaY / ( Window.ms_Width * 0.15 );
			Window.SwipeCallback( aX, aY );
		} );
		
		// Switch view
		var aSwitchAction = function( inEvent ) { Window.CallAction( 67 ); inEvent.stopPropagation(); };
		$( '#view_prev' ).click( function( inEvent ) { Window.CallAction( 01 ); inEvent.stopPropagation(); } );
		$( '#view_next' ).click( aSwitchAction );
		$( 'body' ).hammer( { swipe_min_touches: 2, swipe_max_touches: 2, swipe_velocity: 0.1 } ).on( "pinchout", aSwitchAction );
		
		// Pause
		var aPauseAction = function( inEvent ) { Window.CallAction( 80 ); inEvent.stopPropagation(); };
		$( '#pause' ).click( aPauseAction );
		
		// Reload
		var aReloadAction = function( inEvent ) { Window.CallAction( 82 ); inEvent.stopPropagation(); };
		$( '#reload' ).click( aReloadAction );
	},
	UpdateSize: function()
	{
		Window.ms_Width = $(window).width();
		Window.ms_Height = $(window).height() - 4;
		Window.ms_MiddleX = Window.ms_Width * 0.5;
		Window.ms_MiddleY = Window.ms_Height * 0.5;
	},
	CallAction: function( inId )
	{
		if( inId in Window.ms_Callbacks )
		{
			eval( Window.ms_Callbacks[inId] );
			return false ;
		}
	},
	ToggleFullScreen: function()
	{
		if( !document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement ) 
		{
			if( document.documentElement.requestFullscreen )
				document.documentElement.requestFullscreen();
			else if( document.documentElement.mozRequestFullScreen )
				document.documentElement.mozRequestFullScreen();
			else if( document.documentElement.webkitRequestFullscreen )
				document.documentElement.webkitRequestFullscreen( Element.ALLOW_KEYBOARD_INPUT );
		} 
		else 
		{
			if( document.cancelFullScreen )
				document.cancelFullScreen();
			else if( document.mozCancelFullScreen )
				document.mozCancelFullScreen();
			else if ( document.webkitCancelFullScreen )
				document.webkitCancelFullScreen();
		}
	},	
	ResizeCallback: function( inWidth, inHeight ) {},
	LeftCallback: function() {},
	UpCallback: function() {},
	RightCallback: function() {},
	DownCallback: function() {},
	SwipeCallback: function( inX, inY ) {},
	PauseCallback: function() {},
	FallCallback: function() {},
	ReloadCallback: function() {},
	NextViewCallback: function() {},
	PrevViewCallback: function() {},
};