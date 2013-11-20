/** 
 * @author Jérémy BOUNY / https://github.com/jbouny | http://www.jeremybouny.fr
 * @file js/main.js
 * 
 * Part of the project gravitris https://github.com/jbouny/gravitris
 * 
 * Main file that provide the start of the game.
 * Initialize all other files and start them.
 */
 
function MainLoop()
{
	var aStart = +new Date();
	
	if( Display.ms_View != null )
		Display.ms_View.Display();
	Game.UpdateGravity( Config.ms_FrameRate );
	
	var aEnd = +new Date();
	
	var aDiff = aEnd - aStart;
	var aDelay = ( aDiff >= Config.ms_DelayMs )? 0 : ( Config.ms_DelayMs - aDiff );
	setTimeout( MainLoop, aDelay );
}

$( function() {
	var aViewers = [ Display2D, Display3D ];
	if( Display3D.Enable )
		aViewers.push( Display3DShader );
	
	// Initialization of game configuration, window management (user actions), game and viewer selector
	Config.Initialize();
	Window.Initialize();
	Game.Initialize();
	Display.Initialize( aViewers );
	
	// Initialize the Wrapping that permits to link the user, the game and the current viewer
	Window.FallCallback = function() { Game.Fall(); };
	Window.ResizeCallback = function( inWidth, inHeight ) { Display.ms_View.Resize( inWidth, inHeight ); } ;
	Window.NextViewCallback = function() { Display.SelectNext(); };
	Window.PrevViewCallback = function() { Display.SelectPrev(); };
	Window.PauseCallback = function() { Game.Pause(); };
	Window.ReloadCallback = function() { Game.Reload(); };
	Window.LeftCallback = function() { Game.Left(); };
	Window.RightCallback = function() { Game.Right(); };
	Window.UpCallback = function() { Game.Up(); };
	Window.DownCallback = function() { Game.Down(); };
	Window.SwipeCallback = function( inX, inY ) { Game.Swipe( inX, inY ); };
	
	Display.Select( '2d' );
	
	// Start the game
	MainLoop();
} );